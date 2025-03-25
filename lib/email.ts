import nodemailer from 'nodemailer';

interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: {
    filename: string;
    content: Buffer;
    cid: string;
  }[];
}

export async function sendEmail({ to, subject, text, html, attachments }: EmailParams) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html: html || text.replace(/\n/g, '<br>'),
    attachments
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
} 