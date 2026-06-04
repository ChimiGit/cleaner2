import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, phone, service, message } = await req.json();

  try {
    await resend.emails.send({
      from: 'NG Clean <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL!],
      subject: `New Quote Request — ${service || 'General'}`,
      html: `
        <h2 style="color:#143258;margin:0 0 20px">New Quote Request</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:15px">
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600;width:120px">Name</td><td style="padding:10px 16px;border-bottom:1px solid #e1e7e0">${name}</td></tr>
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600">Email</td><td style="padding:10px 16px;border-bottom:1px solid #e1e7e0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600">Phone</td><td style="padding:10px 16px;border-bottom:1px solid #e1e7e0"><a href="tel:${phone}">${phone}</a></td></tr>
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600">Service</td><td style="padding:10px 16px;border-bottom:1px solid #e1e7e0">${service || '—'}</td></tr>
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600">Message</td><td style="padding:10px 16px">${message || '—'}</td></tr>
        </table>
        <p style="margin-top:24px;color:#7c8896;font-size:13px">Sent from the NG Clean website contact form.</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
