// app/actions/sendResetEmail.ts
'use server';

import { sendEmail } from '@/lib/email';

export async function sendResetEmail(email: string, resetUrl: string) {
  const html = `
    <p>Hello,</p>
    <p>You requested a password reset.</p>
    <p><a href="${resetUrl}">Click here</a> to reset your password.</p>
  `;

  return await sendEmail({
    to: email,
    subject: 'Reset your password',
    html,
  });
}
