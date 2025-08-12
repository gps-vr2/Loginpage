import { Response } from 'express';
import prisma from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendVerificationCode } from '../utils/mailer';

// A simple in-memory store for password reset codes.
// In a production app, use a database table or Redis for this.
const verificationCodes: { [email: string]: { code: string; expires: number } } = {};

/**
 * @description Handles the initial registration check to see if an email is already in use.
 * @route POST /api/register
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
 * @description Sets a password for a new user and returns a temporary token for profile completion.
 * @route POST /api/setpassword
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

/**
 * @description Saves the final user details to the database after verifying the registration token.
 * @route POST /api/saveuser
 */
export const saveUser = async (req: AuthenticatedRequest, res: Response) => {
  const { email, hashedPassword } = req.user; 
  const { name, whatsapp, congregationNumber } = req.body;

  if (!name || !whatsapp || !congregationNumber) {
    return res.status(400).json({ error: "Missing required profile fields" });
  }

  // Validate congregation number format (exactly 7 digits)
  if (!/^\d{7}$/.test(congregationNumber)) {
    return res.status(400).json({ error: "Congregation number must be exactly 7 digits." });
  }

  // Convert to number for DB storage
  const congregationNumberNum = Number(congregationNumber);

  try {
    const congregation = await prisma.congregation.findUnique({
      where: { idCongregation: congregationNumberNum }
    });
    if (!congregation) return res.status(200).json({ congregationExists: false });

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

    return res.status(201).json({ congregationExists: true });
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ error: "Failed to save user." });
  }
};

/**
 * @description Authenticates a user with email and password, returning a JWT.
 * @route POST /api/login
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

/**
 * @description Callback handler for Google OAuth. Creates a JWT and redirects to the frontend.
 * @route GET /api/auth/google/callback
 */
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

/**
 * @description Checks if an email exists and sends a verification code for password reset.
 * @route POST /api/checkmail
 */
export const checkMail = async (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    const user = await prisma.login.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'No account found with this email.' });

    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // Code expires in 10 minutes
    verificationCodes[email] = { code, expires };
    await sendVerificationCode(email, code);

    return res.status(200).json({ message: 'Verification code sent successfully.' });
  } catch (error) {
    console.error('Check mail process failed:', error);
    return res.status(500).json({ error: 'Failed to send verification code.' });
  }
};

/**
 * @description Verifies a 5-digit code and returns a temporary token for resetting the password.
 * @route POST /api/verify-code
 */
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

/**
 * @description Resets a user's password using a valid reset token.
 * @route POST /api/reset-password
 */
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

/**
 * @description Fetches details for the currently authenticated user.
 * @route GET /api/getuser
 */
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

/**
 * @description Creates a new congregation and a new user simultaneously.
 * @route POST /api/Congname
 */
export const createCongregationAndUser = async (req: AuthenticatedRequest, res: Response) => {
  const { email, hashedPassword } = req.user;
  const { name, whatsapp, congregationNumber, congregationName, language } = req.body;

  if (!name || !whatsapp || !congregationNumber || !congregationName || !language) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Validate congregation number format (exactly 7 digits)
  if (!/^\d{7}$/.test(congregationNumber)) {
    return res.status(400).json({ error: "Congregation number must be exactly 7 digits." });
  }

  if (congregationName.trim().length < 3) {
    return res.status(400).json({ error: "Congregation name must be at least 3 characters." });
  }

  // Convert to number for DB storage
  const congregationNumberNum = Number(congregationNumber);

  try {
    const existingCongregation = await prisma.congregation.findUnique({
      where: { idCongregation: congregationNumberNum }
    });

    if (existingCongregation) {
      return res.status(409).json({ error: 'A congregation with this number already exists.' });
    }

    const [newCongregation, newUser] = await prisma.$transaction([
      prisma.congregation.create({
        data: { idCongregation: congregationNumberNum, name: congregationName, language }
      }),
      prisma.login.create({
        data: { name, email, password: hashedPassword, whatsapp, congregationNumber: congregationNumberNum, googleSignIn: false }
      }),
    ]);

    const sessionToken = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ message: 'Congregation and user created successfully.', token: sessionToken });
  } catch (error) {
    console.error('Error creating congregation and user:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
