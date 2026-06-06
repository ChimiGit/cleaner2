import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FREQ_LABELS: Record<string, string> = {
  once: 'Once Off', weekly: 'Weekly', fortnightly: 'Fortnightly', monthly: 'Monthly',
};

const ADDON_LABELS: Record<string, string> = {
  fridge: 'Inside Fridge ($59)',
  windows: 'Exterior Windows ($80)',
  carpet: 'Carpet Steam Clean ($35/room)',
  balcony: 'Balcony Cleaning ($35)',
  walls: 'Wall Deep Cleaning ($180)',
  garage: 'Garage Sweep ($29)',
  patio: 'Patio / Alfresco ($29)',
  tiles: 'Professional Tile Cleaning ($150)',
  blinds: 'Blinds Wet Wipe ($120)',
};

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 16px;background:#f6f8f5;font-weight:600;width:160px;vertical-align:top">${label}</td>
    <td style="padding:10px 16px;border-bottom:1px solid #e1e7e0">${value}</td>
  </tr>`;
}

export async function POST(req: NextRequest) {
  const {
    name, email, phone, address, suburb,
    service, pricingMode,
    beds, baths, hours,
    frequency, date, time,
    addons, carpetRooms,
    entryMethod, parking,
  } = await req.json();

  const sizeInfo = pricingMode === 'hourly'
    ? `${hours} hrs (hourly)`
    : `${beds ?? '—'} bed · ${baths ?? '—'} bath`;

  const addonList = Array.isArray(addons) && addons.length > 0
    ? addons.map((id: string) => {
        const label = ADDON_LABELS[id] ?? id;
        return id === 'carpet' ? `Carpet Steam Clean (${carpetRooms} room${carpetRooms > 1 ? 's' : ''} · $${35 * carpetRooms})` : label;
      }).join('<br>')
    : '—';

  try {
    await resend.emails.send({
      from: 'NG Clean <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `New Booking Request — ${service || 'General'}`,
      html: `
        <div style="font-family:sans-serif;max-width:620px;margin:0 auto">
          <div style="background:#143258;padding:24px 28px;border-radius:8px 8px 0 0">
            <h2 style="color:#fff;margin:0;font-size:20px">New Booking Request</h2>
            <p style="color:rgba(255,255,255,.65);margin:4px 0 0;font-size:13px">NG Clean — website booking form</p>
          </div>
          <table style="border-collapse:collapse;width:100%;font-size:15px">
            ${row('Service', service || '—')}
            ${row('Pricing mode', pricingMode === 'hourly' ? 'Hourly' : 'By Size')}
            ${row('Size / Duration', sizeInfo)}
            ${row('Frequency', FREQ_LABELS[frequency] ?? frequency ?? '—')}
            ${row('Add-ons', addonList)}
            ${row('Preferred date', date || '—')}
            ${row('Preferred time', time || '—')}
            ${row('Name', name || '—')}
            ${row('Email', `<a href="mailto:${email}" style="color:#143258">${email}</a>`)}
            ${row('Phone', `<a href="tel:${phone}" style="color:#143258">${phone}</a>`)}
            ${row('Address', [address, suburb].filter(Boolean).join(', ') || '—')}
            ${row('Entry', entryMethod || '—')}
            ${row('Parking', parking || '—')}
          </table>
          <p style="padding:16px;color:#7c8896;font-size:12px;margin:0">
            Sent from the NG Clean website. Reply directly to this email to contact the customer.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
