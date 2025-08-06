"use server";
import { MailerSend, EmailParams, Sender } from "mailersend";
// lib/email/sendEmail.ts

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY!,
});

const sender = new Sender(
  "MS_xnr0V5@test-ywj2lpnd3pmg7oqz.mlsender.net",
  "Svyrn"
); // Must match a verified sender

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const emailParams = new EmailParams()
    .setFrom(sender)
    .setTo([{ email: to }])
    .setSubject(subject)
    .setHtml(html);

  try {
    const response = await mailersend.email.send(emailParams);
    console.log("Email sent:", response?.statusCode);
    return response;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}
