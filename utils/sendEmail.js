const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // True for SSL, False for TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (toEmail, verificationLink) => {
  try {
    const mailOptions = {
      from: `"MalathPlus Info" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: "Verify Your Email",
      text: `Click the link below to verify your email:\n\n${verificationLink}`,
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationLink}">${verificationLink}</a>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to", toEmail);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = sendVerificationEmail;
