import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, phone, address, service, size, date, time } = await req.json();

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.EMAIL_TO!,
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

    // Confirmation to customer
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'Booking request received — NG Clean',
      html: `
        <h2 style="color:#143258;margin:0 0 12px">Thanks, ${name.split(' ')[0]}!</h2>
        <p style="font-family:sans-serif;font-size:15px;color:#44566e;line-height:1.6">
          We've received your booking request for <strong>${service || 'a clean'}</strong> on <strong>${date || 'your preferred date'}</strong>.<br>
          A member of the NG Clean team will confirm your booking and free quote by phone shortly.
        </p>
        <p style="font-family:sans-serif;font-size:15px;color:#44566e">
          If you need to reach us, call <a href="tel:0403711348" style="color:#143258;font-weight:700">0403 711 348</a>.
        </p>
        <p style="font-family:sans-serif;font-size:13px;color:#7c8896;margin-top:24px">NG Clean · Perth, WA · ABN 61 703 572 412</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
