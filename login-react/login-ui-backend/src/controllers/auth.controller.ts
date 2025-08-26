import { Response } from 'express';
import prisma from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendVerificationCode } from '../utils/mailer';

// In-memory store for verification codes (for demo; in production, use Redis)
const verificationCodes: { [email: string]: { code: string; expires: number } } = {};

/* ============================
   Registration / Password
============================ */

/**
 * @route POST /api/register
 * @desc Check if email is already in use
 */
export const registerUser = async (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const existingUser = await prisma.login.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ error: 'A user with this email already exists.' });
    return res.status(200).json({ message: 'Email is available for registration.' });
  } catch (error) {
    console.error('Registration check failed:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * @route POST /api/setpassword
 * @desc Sets password for new user and returns temporary token
 */
export const setPassword = async (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const registrationToken = jwt.sign({ email, hashedPassword }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return res.status(200).json({ token: registrationToken });
  } catch (error) {
    console.error('Set password failed:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/* ============================
   User Creation
============================ */

/**
 * @route POST /api/saveuser
 * @desc Saves final user details after verifying registration token
 */
export const saveUser = async (req: AuthenticatedRequest, res: Response) => {
  const { email, hashedPassword } = req.user;
  const { name, whatsapp, congregationNumber } = req.body;

  if (!name || !whatsapp || !congregationNumber) {
    return res.status(400).json({ error: "Missing required profile fields" });
  }
  if (!/^\d{7}$/.test(congregationNumber)) {
    return res.status(400).json({ error: "Congregation number must be exactly 7 digits." });
  }

  const congregationNumberNum = Number(congregationNumber);

  try {
    const congregation = await prisma.congregation.findUnique({
      where: { idCongregation: congregationNumberNum },
    });
    if (!congregation) {
      return res.status(400).json({ error: "This congregation does not exist." });
    }

    const existingUser = await prisma.login.findFirst({
      where: { congregationNumber: congregationNumberNum },
    });

    if (existingUser) {
      return res.status(200).json({ congregationExists: true, existingEmail: existingUser.email });
    }

    await prisma.login.create({
      data: {
        name,
        email,
        password: hashedPassword,
        whatsapp,
        congregationNumber: congregationNumberNum,
        googleSignIn: false
      },
    });

    return res.status(201).json({ congregationExists: false });
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ error: "Failed to save user." });
  }
};

/* ============================
   Login
============================ */

/**
 * @route POST /api/login
 * @desc Authenticates user and returns JWT
 */
export const loginUser = async (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await prisma.login.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });

    const updatedUser = await prisma.login.update({
      where: { id: user.id },
      data: { loginCount: { increment: 1 }, updatedAt: new Date() },
    });

    const sessionToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ token: sessionToken, lastLoginDate: updatedUser.updatedAt });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/* ============================
   Google OAuth Callback
============================ */

export const googleCallback = async (req: AuthenticatedRequest, res: Response) => {
  const { user, isNewUser } = req.user;
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET as string,
    { expiresIn: isNewUser ? '1h' : '7d' }
  );

  const frontendUrl = process.env.FRONTEND_URL || 'https://www.j7w.org';
  res.redirect(`${frontendUrl}/auth/google/callback?token=${token}&isNewUser=${isNewUser}`);
};

/* ============================
   Email Verification
============================ */

export const checkMail = async (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await prisma.login.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'No account found with this email.' });

    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expires = Date.now() + 10 * 60 * 1000;
    verificationCodes[email] = { code, expires };
    await sendVerificationCode(email, code);

    return res.status(200).json({ message: 'Verification code sent successfully.' });
  } catch (error) {
    console.error('Check mail failed:', error);
    return res.status(500).json({ error: 'Failed to send verification code.' });
  }
};

export const verifyCode = async (req: AuthenticatedRequest, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code are required.' });

  const storedInfo = verificationCodes[email];
  if (!storedInfo || storedInfo.expires < Date.now() || storedInfo.code !== code) {
    return res.status(400).json({ error: 'Invalid or expired verification code.' });
  }

  const resetToken = jwt.sign(
    { email, purpose: 'password-reset' },
    process.env.JWT_SECRET as string,
    { expiresIn: '15m' }
  );

  delete verificationCodes[email];
  return res.status(200).json({ resetToken });
};

export const resetPassword = async (req: AuthenticatedRequest, res: Response) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) return res.status(400).json({ error: 'Token and new password are required.' });
  if (newPassword.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET as string) as { email: string; purpose: string };
    if (decoded.purpose !== 'password-reset') return res.status(403).json({ error: 'Invalid token purpose.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.login.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    return res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Password reset failed:', error);
    return res.status(403).json({ error: 'Invalid or expired reset token.' });
  }
};

/* ============================
   Get Current User
============================ */

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await prisma.login.findUnique({
      where: { id: userId },
      select: { name: true, congregationNumber: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.status(200).json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/* ============================
   Get User By Congregation
============================ */

export const getUserByCongregation = async (req: AuthenticatedRequest, res: Response) => {
  const { congId } = req.query;
  if (!congId || typeof congId !== "string") return res.status(400).json({ error: "Congregation number is required" });

  try {
    const user = await prisma.login.findFirst({
      where: { congregationNumber: Number(congId) },
      select: { email: true, name: true },
    });
    if (!user) return res.status(404).json({ error: "No user found with this congregation number" });
    return res.status(200).json({ email: user.email, name: user.name });
  } catch (error) {
    console.error("Error fetching user by congregation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================
   Create Congregation & User
============================ */

export const createCongregationAndUser = async (req: AuthenticatedRequest, res: Response) => {
  const { email, hashedPassword } = req.user;
  const { name, whatsapp, congregationNumber, congregationName, language } = req.body;

  if (!name || !whatsapp || !congregationNumber || !congregationName || !language) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  if (!/^\d{7}$/.test(congregationNumber)) return res.status(400).json({ error: "Congregation number must be exactly 7 digits." });
  if (congregationName.trim().length < 3) return res.status(400).json({ error: "Congregation name must be at least 3 characters." });

  const congregationNumberNum = Number(congregationNumber);

  try {
    const existingCongregation = await prisma.congregation.findUnique({ where: { idCongregation: congregationNumberNum } });
    if (existingCongregation) return res.status(409).json({ error: 'A congregation with this number already exists.' });

    const [newCongregation, newUser] = await prisma.$transaction([
      prisma.congregation.create({ data: { idCongregation: congregationNumberNum, name: congregationName, language } }),
      prisma.login.create({ data: { name, email, password: hashedPassword, whatsapp, congregationNumber: congregationNumberNum, googleSignIn: false } }),
    ]);

    const sessionToken = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    return res.status(201).json({ message: 'Congregation and user created successfully.', token: sessionToken });
  } catch (error) {
    console.error('Error creating congregation and user:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
