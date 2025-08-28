const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Dummy lookup function — replace with DB query
const getAdminEmailByCongregation = (congId) => {
  const mapping = {
    "2898201": "admin1@example.com",
    "1234567": "admin2@example.com",
  };
  return mapping[congId] || "defaultadmin@example.com";
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
  const adminEmail = getAdminEmailByCongregation(congregationNumber);

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: adminEmail,
    subject: `New Account Request for Congregation #${congregationNumber}`,
    html: `
      <p>User <strong>${userEmail}</strong> has created an account with Congregation <strong>#${congregationNumber}</strong>.</p>
      <p>Please review and approve their access in the admin panel.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent to admin." });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

module.exports = router;