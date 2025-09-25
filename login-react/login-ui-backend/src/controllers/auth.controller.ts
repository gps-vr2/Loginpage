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
   User Creation & Congregation
============================ */

export const saveUser = async (req: AuthenticatedRequest, res: Response) => {
  const { email, hashedPassword } = req.user;
  const { name, whatsapp, congregationNumber, congregationName, language } = req.body;

  if (!name || !whatsapp || !congregationNumber) {
    return res.status(400).json({ error: "Missing required profile fields" });
  }
  if (!/^\d{7}$/.test(congregationNumber)) {
    return res.status(400).json({ error: "Congregation number must be exactly 7 digits." });
  }

  // Ensure congregationNumber is a number and matches schema type
  const congregationNumberNum = Number(congregationNumber);
  if (isNaN(congregationNumberNum)) {
    return res.status(400).json({ error: "Congregation number must be numeric." });
  }

  try {
    // 1. Check if congregation exists
    const congregation = await prisma.congregation.findUnique({
      where: { idCongregation: congregationNumberNum },
    });

    if (!congregation) {
      // New congregation - user becomes admin
      if (!congregationName || !language) {
        return res.status(200).json({ error: "This congregation does not exist." });
      }
      
      console.log("Creating congregation:", congregationNumberNum, congregationName, language);
      console.log("Creating user as admin:", name, email, whatsapp, congregationNumberNum);

      const result = await prisma.$transaction(async (tx) => {
        const newCongregation = await tx.congregation.create({
          data: { idCongregation: congregationNumberNum, name: congregationName, language }
        });
        const newUser = await tx.login.create({
          data: {
            name,
            email,
            password: hashedPassword,
            whatsapp,
            congregationNumber: congregationNumberNum,
            isAdmin: true, // First user becomes admin
            googleSignIn: false
          }
        });
        return { newCongregation, newUser };
      });

      // Success: allow login immediately for admin
      const sessionToken = jwt.sign(
        { id: result.newUser.id, email: result.newUser.email, name: result.newUser.name, isAdmin: true },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );
      return res.status(201).json({ created: true, token: sessionToken });
    } else {
      // Congregation exists - check if user already exists
      const existingUser = await prisma.login.findFirst({
        where: { congregationNumber: congregationNumberNum, email },
      });

      if (existingUser) {
        return res.status(200).json({ congregationExists: true, existingEmail: existingUser.email });
      }

      // Check if there's already a pending invite
      const existingInvite = await prisma.invite.findFirst({
        where: { congregationNumber: congregationNumberNum, email },
      });

      if (existingInvite) {
        return res.status(200).json({ 
          congregationExists: true, 
          inviteStatus: existingInvite.status,
          message: existingInvite.status === 'pending' ? 
            'Your invite is pending admin approval.' : 
            `Your previous invite was ${existingInvite.status}.`
        });
      }

      // Create new invite for admin approval
      await prisma.invite.create({
        data: {
          name,
          email,
          whatsapp,
          congregationNumber: congregationNumberNum,
          status: 'pending'
        }
      });

      return res.status(200).json({ 
        congregationExists: true, 
        inviteCreated: true,
        message: "Invite sent to admin for approval."
      });
    }
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: "Invalid congregation reference." });
    }
    console.error("Error saving user:", error);
    return res.status(500).json({ error: "Failed to save user." });
  }
};

/* ============================
   Login
============================ */

export const loginUser = async (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await prisma.login.findUnique({ 
      where: { email: email.toLowerCase() },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        password: true, 
        isAdmin: true,
        loginCount: true 
      }
    });
    
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });

    const updatedUser = await prisma.login.update({
      where: { id: user.id },
      data: { loginCount: { increment: 1 }, updatedAt: new Date() },
    });

    const sessionToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ 
      token: sessionToken, 
      lastLoginDate: updatedUser.updatedAt,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/* ============================
   Google OAuth Callback
============================ */

export const googleCallback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userData = req.user as any;
    console.log('Google callback received user data:', userData);

    // Handle both existing users and new users
    let user, isNewUser;
    
    if (userData.isNewUser) {
      // New user case - userData contains { email, name, isNewUser: true }
      user = userData;
      isNewUser = true;
    } else {
      // Existing user case - userData is the user object itself
      user = userData;
      isNewUser = false;
    }

    const token = jwt.sign(
      { 
        id: user.id || 0, 
        email: user.email, 
        name: user.name, 
        isAdmin: user.isAdmin || false 
      },
      process.env.JWT_SECRET as string,
      { expiresIn: isNewUser ? '1h' : '7d' }
    );

    const frontendUrl = process.env.FRONTEND_URL || 'https://www.j7w.org';
    res.redirect(`${frontendUrl}/auth/google/callback?token=${token}&isNewUser=${isNewUser}`);
  } catch (error) {
    console.error('Google callback error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'https://www.j7w.org';
    res.redirect(`${frontendUrl}/auth/error?message=Authentication failed`);
  }
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
      select: { name: true, congregationNumber: true, isAdmin: true },
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
   Create Congregation & User (legacy)
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

    const result = await prisma.$transaction(async (tx) => {
      const newCongregation = await tx.congregation.create({ data: { idCongregation: congregationNumberNum, name: congregationName, language } });
      const newUser = await tx.login.create({ data: { name, email, password: hashedPassword, whatsapp, congregationNumber: congregationNumberNum, googleSignIn: false } });
      return { newCongregation, newUser };
    });

    const sessionToken = jwt.sign({ id: result.newUser.id, email: result.newUser.email, name: result.newUser.name }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    return res.status(201).json({ message: 'Congregation and user created successfully.', token: sessionToken });
  } catch (error) {
    console.error('Error creating congregation and user:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};