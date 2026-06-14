'use client';

import { useState, useMemo } from 'react';
import { Icon } from './Icon';
import type { PricingConfig } from '@/lib/pricing';
import { DEFAULT_PRICING } from '@/lib/pricing';

function closestPrice(table: [number, number, number][], beds: number, baths: number) {
  const exact = table.find(([b, ba]) => b === beds && ba === baths);
  if (exact) return exact[2];
  let best = table[0];
  let bestDist = Infinity;
  for (const row of table) {
    const dist = Math.abs(row[0] - beds) + Math.abs(row[1] - baths);
    if (dist < bestDist) { bestDist = dist; best = row; }
  }
  return best[2];
}


type ServiceType = 'regular' | 'deep' | 'bond' | 'carpet' | 'oven' | 'window' | 'office' | 'airbnb' | 'school' | '';
type Mode = 'size' | 'hourly';

const SERVICES: { id: ServiceType; label: string }[] = [
  { id: 'regular', label: 'Regular / Fortnightly' },
  { id: 'deep',    label: 'Deep Clean' },
  { id: 'bond',    label: 'End of Lease / Vacate' },
  { id: 'carpet',  label: 'Carpet Cleaning' },
  { id: 'oven',    label: 'Oven Cleaning' },
  { id: 'window',  label: 'Window Cleaning' },
  { id: 'office',  label: 'Office Cleaning' },
  { id: 'airbnb',  label: 'Airbnb Cleaning' },
  { id: 'school',  label: 'School / Childcare Cleaning' },
];

function calcPrice(mode: Mode, svc: ServiceType, freq: string, beds: number, baths: number, hours: number, extraMins: number, pricing: PricingConfig): number | null {
  if (!svc) return null;
  if (mode === 'hourly') {
    const h = hours + extraMins / 60;
    if (svc === 'deep') return Math.round(h * pricing.deepHourly);
    if (svc === 'bond') return Math.round(h * pricing.vacateHourly);
    if (svc === 'regular') return Math.round(h * (pricing.regularHourly[freq as keyof typeof pricing.regularHourly] ?? pricing.defaultHourly));
    return Math.round(h * pricing.defaultHourly);
  }
  if (svc === 'regular') return closestPrice(pricing.regularTable, beds, baths);
  if (svc === 'deep')    return closestPrice(pricing.deepTable, beds, baths);
  if (svc === 'bond')    return closestPrice(pricing.vacateTable, beds, baths);
  return null;
}


function Stepper({ value, onChange, min = 0, max = 9 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="qe-stepper">
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="decrease">−</button>
      <span>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="increase">+</button>
    </div>
  );
}

export interface QuoteData {
  svc: ServiceType;
  mode: Mode;
  beds: number;
  baths: number;
  hours: number;
  extraMins: number;
  freq: string;
}

interface QuoteEstimatorProps {
  onBook: (data: QuoteData) => void;
  pricing?: PricingConfig;
}

export function QuoteEstimator({ onBook, pricing = DEFAULT_PRICING }: QuoteEstimatorProps) {
  const [mode, setMode] = useState<Mode>('hourly');
  const [beds, setBeds] = useState(1);
  const [baths, setBaths] = useState(0);
  const [hours, setHours] = useState(0);
  const [extraMins, setExtraMins] = useState(0);
  const [svc, setSvc] = useState<ServiceType>('');
  const [freq, setFreq] = useState('once');
  const total = useMemo(() => calcPrice(mode, svc, freq, beds, baths, hours, extraMins, pricing), [mode, svc, freq, beds, baths, hours, extraMins, pricing]);

  const hourlyRate = svc === 'deep' ? pricing.deepHourly : svc === 'bond' ? pricing.vacateHourly : (pricing.regularHourly[freq as keyof typeof pricing.regularHourly] ?? pricing.defaultHourly);

  return (
    <div className="qe-card">
      <div className="qe-head">
        <div className="qe-title">Instant quote</div>
        <div className="qe-sub">Estimate upfront — no sign-up.</div>
        <div className="qe-tabs">
          <button className={'qe-tab' + (mode === 'hourly' ? ' active' : '')} onClick={() => setMode('hourly')}>Hourly</button>
          <button className={'qe-tab' + (mode === 'size' ? ' active' : '')} onClick={() => setMode('size')}>By Size</button>
        </div>
      </div>

      <div className="qe-body">
        {mode === 'size' ? (
          <div className="qe-row">
            <div className="qe-field">
              <label className="qe-label"><Icon name="bed" size={12} /> Bedrooms</label>
              <Stepper value={beds} onChange={setBeds} min={0} max={6} />
            </div>
            <div className="qe-field">
              <label className="qe-label"><Icon name="shield" size={12} /> Bathrooms</label>
              <Stepper value={baths} onChange={setBaths} min={0} max={6} />
            </div>
          </div>
        ) : (
          <div className="qe-row">
            <div className="qe-field">
              <label className="qe-label">Hours</label>
              <Stepper value={hours} onChange={(v) => setHours(v === 1 ? (hours === 0 ? 2 : 0) : v)} min={0} max={8} />
            </div>
            <div className="qe-field">
              <label className="qe-label">Extra mins</label>
              <select className="qe-select" value={extraMins} onChange={(e) => setExtraMins(Number(e.target.value))}>
                <option value={0}>None</option>
                {[5,10,15,20,25,30,35,40,45,50,55].map(m => (
                  <option key={m} value={m}>+{m} min</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="qe-field" style={{ marginTop: 14 }}>
          <label className="qe-label">Type of clean</label>
          <select className="qe-select" value={svc} onChange={(e) => setSvc(e.target.value as ServiceType)}>
            <option value="" disabled>Select type of clean</option>
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        <div className="qe-field" style={{ marginTop: 14 }}>
          <label className="qe-label">Frequency</label>
          <div className="chips">
            {[
              { id: 'once', label: 'Once Off' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'fortnightly', label: 'Fortnightly' },
              { id: 'monthly', label: 'Monthly' },
            ].map((f) => (
              <button key={f.id} className={'chip' + (freq === f.id ? ' sel' : '')} onClick={() => setFreq(f.id)} style={{ fontSize: 13, padding: '7px 13px' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="qe-footer">
        <div className="qe-price">
          <span className="qe-price-label">Estimate</span>
          {total !== null ? (
            <>
              <div className="qe-price-value">${total}</div>
              <span className="qe-price-note">
                {mode === 'hourly' ? `${extraMins > 0 ? `${hours}h ${extraMins}m` : `${hours}h`} · $${hourlyRate}/hr` : 'guide price'}
              </span>
            </>
          ) : (
            <>
              <div className="qe-price-value">$0</div>
              <span className="qe-price-note">guide price</span>
            </>
          )}
        </div>
        <button className="btn btn-primary qe-book-btn" onClick={() => onBook({ svc, mode, beds, baths, hours, extraMins, freq })}>
          Book Now <Icon name="arrow" size={16} className="arr" />
        </button>
      </div>
    </div>
  );
}
