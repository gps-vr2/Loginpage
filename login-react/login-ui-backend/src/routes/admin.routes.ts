import { Router } from 'express';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth.middleware';
import { sendInviteApprovedEmail } from '../utils/mailer';

const router = Router();

// Get all pending invites for admin's congregation
router.get('/invites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user and check if admin
    const user = await prisma.login.findUnique({
      where: { id: userId },
      select: { isAdmin: true, congregationNumber: true }
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    // Get all pending invites for this congregation
    const invites = await prisma.invite.findMany({
      where: { 
        congregationNumber: user.congregationNumber,
        status: 'pending'
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ invites });
  } catch (error) {
    console.error('Error fetching invites:', error);
    return res.status(500).json({ error: 'Failed to fetch invites.' });
  }
});

// Accept an invite
router.post('/invite/accept/:inviteId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const inviteId = parseInt(req.params.inviteId);

    // Get user and check if admin
    const user = await prisma.login.findUnique({
      where: { id: userId },
      select: { isAdmin: true, congregationNumber: true }
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    // Get the invite and verify it belongs to admin's congregation
    const invite = await prisma.invite.findFirst({
      where: { 
        id: inviteId,
        congregationNumber: user.congregationNumber,
        status: 'pending'
      }
    });

    if (!invite) {
      return res.status(404).json({ error: 'Invite not found or already processed.' });
    }

    // Create user account and approve invite in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update invite status
      const updatedInvite = await tx.invite.update({
        where: { id: inviteId },
        data: { status: 'approved' }
      });

      // Create user account (they can now login)
      const newUser = await tx.login.create({
        data: {
          name: invite.name,
          email: invite.email,
          whatsapp: invite.whatsapp,
          congregationNumber: invite.congregationNumber,
          isAdmin: false,
          googleSignIn: false
        }
      });

      return { updatedInvite, newUser };
    });

    // Send approval email to user
    await sendInviteApprovedEmail(invite.email, invite.name, invite.congregationNumber);

    return res.status(200).json({ 
      message: 'Invite accepted successfully.',
      invite: result.updatedInvite 
    });
  } catch (error: any) {
    console.error('Error accepting invite:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }
    return res.status(500).json({ error: 'Failed to accept invite.' });
  }
});

// Reject an invite
router.post('/invite/reject/:inviteId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const inviteId = parseInt(req.params.inviteId);

    // Get user and check if admin
    const user = await prisma.login.findUnique({
      where: { id: userId },
      select: { isAdmin: true, congregationNumber: true }
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    // Get the invite and verify it belongs to admin's congregation
    const invite = await prisma.invite.findFirst({
      where: { 
        id: inviteId,
        congregationNumber: user.congregationNumber,
        status: 'pending'
      }
    });

    if (!invite) {
      return res.status(404).json({ error: 'Invite not found or already processed.' });
    }

    // Update invite status to rejected
    const updatedInvite = await prisma.invite.update({
      where: { id: inviteId },
      data: { status: 'rejected' }
    });

    return res.status(200).json({ 
      message: 'Invite rejected.',
      invite: updatedInvite 
    });
  } catch (error) {
    console.error('Error rejecting invite:', error);
    return res.status(500).json({ error: 'Failed to reject invite.' });
  }
});

// Get invite statistics for admin dashboard
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user and check if admin
    const user = await prisma.login.findUnique({
      where: { id: userId },
      select: { isAdmin: true, congregationNumber: true }
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    // Get statistics
    const [pendingCount, approvedCount, rejectedCount, totalUsers] = await Promise.all([
      prisma.invite.count({ 
        where: { congregationNumber: user.congregationNumber, status: 'pending' } 
      }),
      prisma.invite.count({ 
        where: { congregationNumber: user.congregationNumber, status: 'approved' } 
      }),
      prisma.invite.count({ 
        where: { congregationNumber: user.congregationNumber, status: 'rejected' } 
      }),
      prisma.login.count({ 
        where: { congregationNumber: user.congregationNumber } 
      })
    ]);

    return res.status(200).json({
      pendingInvites: pendingCount,
      approvedInvites: approvedCount,
      rejectedInvites: rejectedCount,
      totalUsers: totalUsers
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ error: 'Failed to fetch statistics.' });
  }
});

export default router;