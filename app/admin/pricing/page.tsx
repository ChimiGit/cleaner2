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

  async function toggleAddonStatus(id: string) {
    const addon = config.addons.find(a => a.id === id);
    if (!addon) return;
    const newStatus = (addon.status ?? 'active') === 'active' ? 'inactive' : 'active';
    setConfig(prev => ({
      ...prev,
      addons: prev.addons.map(a => a.id === id ? { ...a, status: newStatus } : a),
    }));
    const res = await fetch(`/api/admin/pricing/addon/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.status === 401) router.push('/admin/login');
  }

  if (loadError) return <div className="admin-page"><p style={{ color: '#c5412f', padding: 24 }}>{loadError}</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' }}>Pricing Dashboard</h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>Changes go live immediately after saving.</p>
        </div>
        <div className="admin-actions">
          {saved && <span className="admin-saved-badge">✓ Saved</span>}
          <button onClick={save} disabled={saving} className="admin-save-btn">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button onClick={logout} className="admin-logout-btn">Logout</button>
        </div>
      </div>

      <nav className="admin-nav">
        <a href="/admin/pricing" className="active">Pricing</a>
        <a href="/admin/gallery">Gallery</a>
      </nav>

      <div className="admin-grid">
        {/* Hourly rates + Add-ons row */}
        <div className="admin-row">
          <section className="admin-card" style={{ flex: 1 }}>
            <h2>Hourly Rates ($/hr)</h2>
            <div className="admin-rate-grid">
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
        <section className="admin-card" style={{ flex: 2 }}>
          <h2>Add-on Prices</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Add-on</th>
                <th>Unit</th>
                <th style={{ textAlign: 'right' }}>Price ($)</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {config.addons.map(a => {
                const isActive = (a.status ?? 'active') === 'active';
                return (
                  <tr key={a.id} style={{ opacity: isActive ? 1 : 0.45 }}>
                    <td>{a.label}</td>
                    <td style={{ color: '#6b7280', fontSize: 13 }}>{a.unit || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <PriceInput value={a.price} onChange={v => updateAddonPrice(a.id, v)} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={isActive} onChange={() => toggleAddonStatus(a.id)} />
                        <span className="toggle-track" />
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
        </div>

        <div className="admin-size-row">
          <SizeTableCard title="Regular Cleaning – By Size" table={config.regularTable} onChange={(idx, price) => updateSizeTable('regularTable', idx, price)} />
          <SizeTableCard title="Deep Cleaning – By Size" table={config.deepTable} onChange={(idx, price) => updateSizeTable('deepTable', idx, price)} />
          <SizeTableCard title="End of Lease / Bond – By Size" table={config.vacateTable} onChange={(idx, price) => updateSizeTable('vacateTable', idx, price)} />
        </div>
      </div>

      <div style={{ padding: '0 20px 40px', display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {saved && <span className="admin-saved-badge">✓ Saved</span>}
        <button onClick={save} disabled={saving} className="admin-save-btn">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

function SizeTableCard({ title, table, onChange }: { title: string; table: SizeTable; onChange: (idx: number, price: number) => void }) {
  return (
    <section className="admin-card">
      <h2>{title}</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Beds</th>
            <th>Baths</th>
            <th style={{ textAlign: 'right' }}>Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {table.map(([beds, baths, price], i) => (
            <tr key={i}>
              <td>{beds} bed{beds !== 1 ? 's' : ''}</td>
              <td>{baths} bath{baths !== 1 ? 's' : ''}</td>
              <td style={{ textAlign: 'right' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 6, padding: '6px 10px' }}>
        <span style={{ color: '#6b7280', fontSize: 14 }}>$</span>
        <input
          type="number" min={0} step={1} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ border: 'none', background: 'transparent', fontSize: 15, fontWeight: 600, color: '#111827', width: '100%', outline: 'none', minWidth: 0 }}
        />
        <span style={{ color: '#9ca3af', fontSize: 12, whiteSpace: 'nowrap' }}>/hr</span>
      </div>
    </div>
  );
}

function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <span style={{ color: '#6b7280', fontSize: 13 }}>$</span>
      <input
        type="number" min={0} step={1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ border: 'none', borderBottom: '1.5px solid #d1d5db', background: 'transparent', fontSize: 14, fontWeight: 600, color: '#111827', width: 70, outline: 'none', textAlign: 'right', padding: '2px 0' }}
      />
    </div>
  );
}
