import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// We need to add these credentials to the .env file
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// Create a "transporter" - an object that can send email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

/**
 * Sends a verification code to the specified email address.
 * @param to The recipient's email address.
 * @param code The 5-digit verification code to send.
 */
export const sendVerificationCode = async (to: string, code: string) => {
  const mailOptions = {
    from: `"Your App Name" <${GMAIL_USER}>`,
    to: to,
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <h2>Password Reset Verification</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background-color: #f0f0f0; padding: 10px 20px; border-radius: 5px; display: inline-block;">
          ${code}
        </p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to', to);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email.');
  }
};

/**
 * Sends an invite approval notification to the user.
 * @param to The recipient's email address.
 * @param name The user's name.
 * @param congregationNumber The congregation number.
 */
export const sendInviteApprovedEmail = async (to: string, name: string, congregationNumber: number) => {
  const mailOptions = {
    from: `"Congregation Portal" <${GMAIL_USER}>`,
    to: to,
    subject: 'Your Invitation Has Been Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Welcome to Congregation #${congregationNumber}!</h2>
        <p>Dear ${name},</p>
        <p>Great news! Your invitation to join Congregation #${congregationNumber} has been approved by the administrator.</p>
        <p>You can now log in to your account using your email and password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://www.j7w.org'}/login" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Login Now
          </a>
        </div>
        <p>If you have any questions, please contact your congregation administrator.</p>
        <p>Welcome aboard!</p>
        <hr style="margin: 30px 0;">
        <p style="color: #888; font-size: 12px;">This is an automated email. Please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Invite approval email sent successfully to', to);
  } catch (error) {
    console.error('Error sending invite approval email:', error);
    throw new Error('Failed to send invite approval email.');
  }
};
