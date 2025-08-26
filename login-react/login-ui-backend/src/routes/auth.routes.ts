import { Router } from 'express';
import passport from 'passport';

import { 
  registerUser, 
  setPassword,
  saveUser,
  loginUser,
  googleCallback,
  checkMail,
  verifyCode,
  resetPassword,
  getUser,
  createCongregationAndUser,
  getUserByCongregation  // <- added here
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/setpassword', setPassword);
router.post('/login', loginUser);
router.post('/checkmail', checkMail);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);

// Fetch existing user by congregation number
router.get('/getUserByCongregation', getUserByCongregation);

// --- Google OAuth Routes ---
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  googleCallback
);

// --- Protected Routes ---
router.post('/saveuser', authenticateToken, saveUser);
router.get('/getuser', authenticateToken, getUser);
router.post('/Congname', authenticateToken, createCongregationAndUser);

export default router;
