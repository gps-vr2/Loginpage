import { Router } from 'express';
import passport from 'passport';
import { getUserByCongregation } from '../controllers/user.controller';

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
  createCongregationAndUser
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

// --- Protected Routes (require a valid JWT) ---
router.post('/saveuser', authenticateToken, saveUser);
router.get('/getuser', authenticateToken, getUser);
router.post('/Congname', authenticateToken, createCongregationAndUser);

export default router;
