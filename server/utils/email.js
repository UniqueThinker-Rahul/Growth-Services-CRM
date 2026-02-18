const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create Transporter (Use your Gmail credentials)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Ensure this is in your .env
      pass: process.env.EMAIL_PASS  // Ensure this is in your .env
    }
  });

  // 2. Define Email Options
  const mailOptions = {
    from: `"GrowthService Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  // 3. Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;