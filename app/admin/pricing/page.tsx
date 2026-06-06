'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { PricingConfig } from '@/lib/pricing';
import { DEFAULT_PRICING } from '@/lib/pricing';

type SizeTable = [number, number, number][];

export default function AdminPricingPage() {
  const router = useRouter();
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/pricing');
    if (res.status === 401) { router.push('/admin/login'); return; }
    if (res.ok) setConfig(await res.json());
    else setLoadError('Failed to load pricing.');
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    setSaved(false);
    const res = await fetch('/api/admin/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    setSaving(false);
    if (res.status === 401) { router.push('/admin/login'); return; }
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  function updateSizeTable(key: keyof Pick<PricingConfig, 'regularTable' | 'deepTable' | 'vacateTable'>, idx: number, price: number) {
    setConfig(prev => {
      const table = prev[key].map((row, i) => i === idx ? [row[0], row[1], price] as [number, number, number] : row);
      return { ...prev, [key]: table };
    });
  }

  function updateHourly(field: keyof PricingConfig['regularHourly'], value: number) {
    setConfig(prev => ({ ...prev, regularHourly: { ...prev.regularHourly, [field]: value } }));
  }

  function updateAddonPrice(id: string, price: number) {
    setConfig(prev => ({
      ...prev,
      addons: prev.addons.map(a => a.id === id ? { ...a, price } : a),
    }));
  }

  if (loadError) return <div style={s.page}><p style={{ color: '#c5412f' }}>{loadError}</p></div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>Pricing Dashboard</h1>
          <p style={s.sub}>Changes go live immediately after saving.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saved && <span style={s.savedBadge}>✓ Saved</span>}
          <button onClick={save} disabled={saving} style={s.saveBtn}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button onClick={logout} style={s.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={s.grid}>
        {/* Hourly rates */}
        <section style={s.card}>
          <h2 style={s.h2}>Hourly Rates ($/hr)</h2>
          <div style={s.rateGrid}>
            <RateField label="Regular – Once Off" value={config.regularHourly.once} onChange={v => updateHourly('once', v)} />
            <RateField label="Regular – Weekly" value={config.regularHourly.weekly} onChange={v => updateHourly('weekly', v)} />
            <RateField label="Regular – Fortnightly" value={config.regularHourly.fortnightly} onChange={v => updateHourly('fortnightly', v)} />
            <RateField label="Regular – Monthly" value={config.regularHourly.monthly} onChange={v => updateHourly('monthly', v)} />
            <RateField label="Deep Clean" value={config.deepHourly} onChange={v => setConfig(p => ({ ...p, deepHourly: v }))} />
            <RateField label="End of Lease / Bond" value={config.vacateHourly} onChange={v => setConfig(p => ({ ...p, vacateHourly: v }))} />
            <RateField label="Default (other services)" value={config.defaultHourly} onChange={v => setConfig(p => ({ ...p, defaultHourly: v }))} />
          </div>
        </section>

        {/* Add-ons */}
        <section style={s.card}>
          <h2 style={s.h2}>Add-on Prices</h2>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Add-on</th>
                <th style={s.th}>Unit</th>
                <th style={{ ...s.th, textAlign: 'right' }}>Price ($)</th>
              </tr>
            </thead>
            <tbody>
              {config.addons.map(a => (
                <tr key={a.id}>
                  <td style={s.td}>{a.label}</td>
                  <td style={{ ...s.td, color: '#6b7280', fontSize: 13 }}>{a.unit || '—'}</td>
                  <td style={{ ...s.td, textAlign: 'right' }}>
                    <PriceInput value={a.price} onChange={v => updateAddonPrice(a.id, v)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Size tables */}
        <SizeTableCard
          title="Regular Cleaning – By Size"
          table={config.regularTable}
          onChange={(idx, price) => updateSizeTable('regularTable', idx, price)}
        />
        <SizeTableCard
          title="Deep Cleaning – By Size"
          table={config.deepTable}
          onChange={(idx, price) => updateSizeTable('deepTable', idx, price)}
        />
        <SizeTableCard
          title="End of Lease / Bond – By Size"
          table={config.vacateTable}
          onChange={(idx, price) => updateSizeTable('vacateTable', idx, price)}
        />
      </div>

      <div style={{ padding: '0 24px 40px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        {saved && <span style={s.savedBadge}>✓ Saved</span>}
        <button onClick={save} disabled={saving} style={s.saveBtn}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

function SizeTableCard({ title, table, onChange }: { title: string; table: SizeTable; onChange: (idx: number, price: number) => void }) {
  return (
    <section style={s.card}>
      <h2 style={s.h2}>{title}</h2>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Beds</th>
            <th style={s.th}>Baths</th>
            <th style={{ ...s.th, textAlign: 'right' }}>Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {table.map(([beds, baths, price], i) => (
            <tr key={i}>
              <td style={s.td}>{beds} bed{beds !== 1 ? 's' : ''}</td>
              <td style={s.td}>{baths} bath{baths !== 1 ? 's' : ''}</td>
              <td style={{ ...s.td, textAlign: 'right' }}>
                <PriceInput value={price} onChange={v => onChange(i, v)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function RateField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={s.rateField}>
      <label style={s.rateLabel}>{label}</label>
      <div style={s.rateInputWrap}>
        <span style={s.dollarSign}>$</span>
        <input
          type="number"
          min={0}
          step={1}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={s.rateInput}
        />
        <span style={s.perHr}>/hr</span>
      </div>
    </div>
  );
}

function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <span style={{ color: '#6b7280', fontSize: 13 }}>$</span>
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={s.priceInput}
      />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f4f6f4',
  },
  header: {
    background: '#143258',
    padding: '20px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  h1: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
  },
  sub: {
    margin: '2px 0 0',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: 20,
    padding: 24,
  },
  card: {
    background: '#fff',
    borderRadius: 10,
    padding: '20px 22px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  h2: {
    margin: '0 0 16px',
    fontSize: 15,
    fontWeight: 600,
    color: '#143258',
    borderBottom: '1.5px solid #e5e7eb',
    paddingBottom: 10,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  th: {
    padding: '6px 8px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '8px 8px',
    borderBottom: '1px solid #f3f4f6',
    color: '#1f2937',
  },
  rateGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  rateField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  rateLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 500,
  },
  rateInputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: '#f9fafb',
    border: '1.5px solid #e5e7eb',
    borderRadius: 6,
    padding: '6px 10px',
  },
  dollarSign: {
    color: '#6b7280',
    fontSize: 14,
  },
  rateInput: {
    border: 'none',
    background: 'transparent',
    fontSize: 15,
    fontWeight: 600,
    color: '#111827',
    width: 56,
    outline: 'none',
  },
  perHr: {
    color: '#9ca3af',
    fontSize: 12,
  },
  priceInput: {
    border: 'none',
    borderBottom: '1.5px solid #d1d5db',
    background: 'transparent',
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
    width: 70,
    outline: 'none',
    textAlign: 'right',
    padding: '2px 0',
  },
  saveBtn: {
    padding: '9px 20px',
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: 7,
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },
  logoutBtn: {
    padding: '9px 16px',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 7,
    fontWeight: 500,
    fontSize: 14,
    cursor: 'pointer',
  },
  savedBadge: {
    fontSize: 13,
    fontWeight: 600,
    color: '#16a34a',
    background: '#dcfce7',
    padding: '6px 12px',
    borderRadius: 6,
  },
};
