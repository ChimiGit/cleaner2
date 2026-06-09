import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'NG Clean — Professional Cleaning Services in Perth';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#143258',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#7fb539',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
            }}
          >
            ✦
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: '#ffffff', letterSpacing: '-1px' }}>
            NG Clean
          </span>
        </div>
        <p style={{ fontSize: 30, color: 'rgba(255,255,255,0.85)', textAlign: 'center', margin: '0 0 16px', lineHeight: 1.3 }}>
          Professional Cleaning Services in Perth
        </p>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.55)', textAlign: 'center', margin: 0 }}>
          End of Lease · Deep Cleaning · Carpet · Oven · Window
        </p>
        <div
          style={{
            marginTop: 48,
            background: '#7fb539',
            color: '#fff',
            fontSize: 18,
            fontWeight: 700,
            padding: '12px 32px',
            borderRadius: 40,
          }}
        >
          ngclean.com.au
        </div>
      </div>
    ),
    { ...size }
  );
}
