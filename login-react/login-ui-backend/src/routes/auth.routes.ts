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
  createCongregationAndUser
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

// ✅ Import Prisma client
import { prisma } from '../lib/prisma'; // adjust the path if needed

const router = Router();

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/setpassword', setPassword);
router.post('/login', loginUser);
router.post('/checkmail', checkMail);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);

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

// ✅ NEW: Fetch existing user email for a congregation
router.get('/congregation/:id/admin', async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await prisma.login.findFirst({
      where: { congregationNumber: Number(id) },
      select: { email: true },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "No user found in this congregation" });
    }

    res.json({ adminEmail: existingUser.email });
  } catch (err) {
    console.error("Error fetching admin email:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
