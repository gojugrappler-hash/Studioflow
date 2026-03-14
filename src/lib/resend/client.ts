/**
 * Resend Email Integration
 * 
 * Provides transactional and campaign email sending via Resend API.
 * Requires: RESEND_API_KEY environment variable.
 * 
 * Status: SCAFFOLD — not active until API key is configured.
 */

interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  tags?: { name: string; value: string }[];
}

interface SendEmailResult {
  id: string;
}

interface BatchEmailInput {
  emails: SendEmailInput[];
}

const RESEND_API = 'https://api.resend.com';

function getApiKey(): string {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Resend not configured — set RESEND_API_KEY environment variable');
  return key;
}

export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = getApiKey();
  const res = await fetch(`${RESEND_API}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: input.from || 'Studioflow <notifications@studioflow.app>',
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo,
      cc: input.cc,
      bcc: input.bcc,
      tags: input.tags,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Unknown Resend error' }));
    throw new Error(`Resend error: ${err.message || res.statusText}`);
  }
  return res.json();
}

export async function sendBatch(input: BatchEmailInput): Promise<SendEmailResult[]> {
  const apiKey = getApiKey();
  const res = await fetch(`${RESEND_API}/emails/batch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      input.emails.map(email => ({
        from: email.from || 'Studioflow <notifications@studioflow.app>',
        to: Array.isArray(email.to) ? email.to : [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        tags: email.tags,
      }))
    ),
  });
  if (!res.ok) throw new Error('Resend batch send failed');
  return res.json();
}

// Pre-built email templates
export function invoiceEmailHtml(invoiceNumber: string, amount: string, dueDate: string, payUrl: string): string {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e4e4ef; padding: 40px; border-radius: 12px;">
      <h1 style="color: #2dd4bf; margin-bottom: 8px;">New Invoice</h1>
      <p style="color: #8888a0;">Invoice #${invoiceNumber}</p>
      <div style="background: #12121a; padding: 24px; border-radius: 8px; margin: 24px 0;">
        <p><strong>Amount Due:</strong> ${amount}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
      </div>
      <a href="${payUrl}" style="display: inline-block; background: linear-gradient(135deg, #2dd4bf, #818cf8); color: #0a0a0f; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Pay Now
      </a>
    </div>
  `;
}

export function appointmentReminderHtml(clientName: string, date: string, time: string, artistName: string): string {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e4e4ef; padding: 40px; border-radius: 12px;">
      <h1 style="color: #818cf8; margin-bottom: 8px;">Appointment Reminder</h1>
      <p>Hey ${clientName},</p>
      <div style="background: #12121a; padding: 24px; border-radius: 8px; margin: 24px 0;">
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Artist:</strong> ${artistName}</p>
      </div>
      <p style="color: #8888a0;">See you soon! If you need to reschedule, please let us know at least 24 hours in advance.</p>
    </div>
  `;
}
