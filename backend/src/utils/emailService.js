const nodemailer = require('nodemailer');

const {
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
} = process.env;

let transporter;

function getTransporter() {
  if (!transporter) {
    if (!EMAIL_USER || !EMAIL_PASS) {
      console.warn('Email credentials missing. Emails will not be sent.');
      return null;
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  return transporter;
}

async function sendEmail({ to, subject, html, text }) {
  const mailer = getTransporter();
  if (!mailer) {
    return;
  }

  try {
    await mailer.sendMail({
      from: EMAIL_FROM || EMAIL_USER,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error('Failed to send email:', error.message);
  }
}

module.exports = {
  sendEmail,
};

