const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    logger.error('SMTP connection error:', error);
  } else {
    logger.info('SMTP server is ready to take messages');
  }
});

exports.sendEmail = async (options) => {
  const mailOptions = {
    from: `"Service Brand" <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  if (options.attachments) {
    mailOptions.attachments = options.attachments;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent:', info.messageId);
    return info;
  } catch (error) {
    logger.error('Email send error:', error);
    throw error;
  }
};
exports.sendContactEmail = async (contactData) => {
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${contactData.name}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
    <p><strong>Subject:</strong> ${contactData.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${contactData.message}</p>
    <p><strong>Service Interested:</strong> ${contactData.service || 'Not specified'}</p>
    <hr>
    <p><small>IP: ${contactData.ipAddress} | User Agent: ${contactData.userAgent}</small></p>
  `;

  return exports.sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@yourbrand.com',
    subject: `New Contact: ${contactData.subject}`,
    html
  });
};

exports.sendWelcomeEmail = async (user) => {
  const html = `
    <h2>Welcome ${user.name}!</h2>
    <p>Thank you for registering with us. We're excited to have you on board.</p>
    <p>You can now access all our services and stay updated with our latest news.</p>
    <p>If you have any questions, feel free to contact us.</p>
    <br>
    <p>Best regards,</p>
    <p>The Team</p>
  `;

  return exports.sendEmail({
    to: user.email,
    subject: 'Welcome to Our Service Brand',
    html
  });
};