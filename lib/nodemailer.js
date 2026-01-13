import nodemailer from "nodemailer";

export default async function sendMail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: `"Meww Store" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
}
