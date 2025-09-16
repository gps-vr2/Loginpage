const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const prisma = require('../db').default;

// Fetch the admin email for a congregation from the Login table
const getAdminEmailByCongregation = async (congId) => {
  try {
    // If you have a 'role' field, use: where: { congregationNumber: Number(congId), role: 'admin' }
    // Otherwise, just get the first user for that congregation
    const admin = await prisma.login.findFirst({
      where: { congregationNumber: Number(congId) },
      orderBy: { createdAt: 'asc' }, // oldest user, likely admin
    });
    return admin ? admin.email : null;
  } catch (err) {
    console.error('Error fetching admin email:', err);
    return null;
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

router.post("/notify-admin", async (req, res) => {
  const { congregationNumber, userEmail } = req.body;
  if (!congregationNumber || !userEmail) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const adminEmail = await getAdminEmailByCongregation(congregationNumber);
    if (!adminEmail) {
      return res.status(404).json({ message: "No admin found for this congregation." });
    }

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: adminEmail,
      subject: `New Account Request for Congregation #${congregationNumber}`,
      html: `
        <p>User <strong>${userEmail}</strong> has requested to join Congregation <strong>#${congregationNumber}</strong>.</p>
        <p>Please review and approve their access in the admin panel.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  res.status(200).json({ message: "You will be notified once the admin accepts your invite." });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

module.exports = router;