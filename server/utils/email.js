const nodemailer = require("nodemailer");
const env = require("../config/env");

const createTransport = () => {
  return nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
};

const sendPasswordResetEmail = async (to, resetUrl) => {
  const transporter = createTransport();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">Reset Your Password</h2>
      <p>You requested a password reset for your SnapSell account.</p>
      <p>Click the button below to set a new password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Reset Password</a>
      <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">SnapSell Marketplace</p>
    </div>
  `;

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject: "SnapSell — Reset Your Password",
    html,
    text: `Reset your password by visiting: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.`,
  });
};

module.exports = { sendPasswordResetEmail };
