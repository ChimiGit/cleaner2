import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, phone, address, service, size, date, time } = await req.json();

  try {
    await resend.emails.send({
      from: 'NG Clean <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `New Booking Request — ${service || 'General'}`,
      html: `
        <h2 style="color:#143258;margin:0 0 20px">New Booking Request</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:15px">
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600;width:140px">Service</td><td style="padding:10px 16px;border-bottom:1px solid #e1e7e0">${service || '—'}</td></tr>
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600">Size</td><td style="padding:10px 16px;border-bottom:1px solid #e1e7e0">${size || '—'}</td></tr>
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600">Date</td><td style="padding:10px 16px;border-bottom:1px solid #e1e7e0">${date || '—'}</td></tr>
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600">Time</td><td style="padding:10px 16px;border-bottom:1px solid #e1e7e0">${time || '—'}</td></tr>
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600">Name</td><td style="padding:10px 16px;border-bottom:1px solid #e1e7e0">${name}</td></tr>
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600">Email</td><td style="padding:10px 16px;border-bottom:1px solid #e1e7e0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600">Phone</td><td style="padding:10px 16px;border-bottom:1px solid #e1e7e0"><a href="tel:${phone}">${phone}</a></td></tr>
          <tr><td style="padding:10px 16px;background:#f6f8f5;font-weight:600">Address</td><td style="padding:10px 16px">${address}</td></tr>
        </table>
        <p style="margin-top:24px;color:#7c8896;font-size:13px">Sent from the NG Clean website booking form.</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
