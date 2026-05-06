const nodemailer = require('nodemailer');

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

async function sendOTP(email, otp) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(`OTP for ${email}: ${otp}`);
    return;
  }

  await getTransporter().sendMail({
    from: `"SecureVault" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your SecureVault login code',
    text: `Your SecureVault OTP is ${otp}. It expires in 10 minutes.`
  });
}

module.exports = { sendOTP };
