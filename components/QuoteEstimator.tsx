'use client';

import { useState, useMemo } from 'react';
import { Icon } from './Icon';

// Fixed package prices [beds, baths, price]
const REGULAR_TABLE: [number, number, number][] = [
  [1, 1, 120], [2, 1, 155], [2, 2, 199],
  [3, 1, 199], [3, 2, 235], [4, 2, 269], [5, 3, 339],
];
const DEEP_TABLE: [number, number, number][] = [
  [1, 1, 350], [2, 1, 440], [2, 2, 540],
  [3, 1, 500], [3, 2, 600], [4, 2, 660], [5, 2, 720],
];
const VACATE_TABLE: [number, number, number][] = [
  [1, 1, 387], [2, 1, 459], [2, 2, 594],
  [3, 1, 531], [3, 2, 639], [4, 2, 711], [5, 2, 870],
];

// Hourly rates
const REGULAR_HOURLY: Record<string, number> = { once: 48, weekly: 45, fortnightly: 45, monthly: 48 };
const DEEP_HOURLY = 55;
const VACATE_HOURLY = 65;
const DEFAULT_HOURLY = 48;

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


type ServiceType = 'regular' | 'deep' | 'bond' | 'carpet' | 'oven' | 'window' | 'office' | 'airbnb' | 'school';
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

function calcPrice(mode: Mode, svc: ServiceType, freq: string, beds: number, baths: number, hours: number, halfHour: boolean): number | null {
  if (mode === 'hourly') {
    const h = hours + (halfHour ? 0.5 : 0);
    if (svc === 'deep') return Math.round(h * DEEP_HOURLY);
    if (svc === 'bond') return Math.round(h * VACATE_HOURLY);
    if (svc === 'regular') return Math.round(h * (REGULAR_HOURLY[freq] ?? 48));
    return Math.round(h * DEFAULT_HOURLY);
  }
  // By size
  if (svc === 'regular') return closestPrice(REGULAR_TABLE, beds, baths);
  if (svc === 'deep')    return closestPrice(DEEP_TABLE, beds, baths);
  if (svc === 'bond')    return closestPrice(VACATE_TABLE, beds, baths);
  return null; // other services — quote by phone
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
  halfHour: boolean;
  freq: string;
}

interface QuoteEstimatorProps {
  onBook: (data: QuoteData) => void;
}

export function QuoteEstimator({ onBook }: QuoteEstimatorProps) {
  const [mode, setMode] = useState<Mode>('size');
  const [beds, setBeds] = useState(2);
  const [baths, setBaths] = useState(1);
  const [hours, setHours] = useState(3);
  const [halfHour, setHalfHour] = useState(false);
  const [svc, setSvc] = useState<ServiceType>('regular');
  const [freq, setFreq] = useState('once');
  const total = useMemo(() => calcPrice(mode, svc, freq, beds, baths, hours, halfHour), [mode, svc, freq, beds, baths, hours, halfHour]);

  const hourlyRate = svc === 'deep' ? DEEP_HOURLY : svc === 'bond' ? VACATE_HOURLY : (REGULAR_HOURLY[freq] ?? DEFAULT_HOURLY);

  return (
    <div className="qe-card">
      <div className="qe-head">
        <div className="qe-title">Instant quote</div>
        <div className="qe-sub">Estimate upfront — no sign-up.</div>
        <div className="qe-tabs">
          <button className={'qe-tab' + (mode === 'size' ? ' active' : '')} onClick={() => setMode('size')}>By Size</button>
          <button className={'qe-tab' + (mode === 'hourly' ? ' active' : '')} onClick={() => setMode('hourly')}>Hourly</button>
        </div>
      </div>

      <div className="qe-body">
        {mode === 'size' ? (
          <div className="qe-row">
            <div className="qe-field">
              <label className="qe-label"><Icon name="bed" size={12} /> Bedrooms</label>
              <Stepper value={beds} onChange={setBeds} min={baths === 0 ? 1 : 0} max={6} />
            </div>
            <div className="qe-field">
              <label className="qe-label"><Icon name="shield" size={12} /> Bathrooms</label>
              <Stepper value={baths} onChange={setBaths} min={beds === 0 ? 1 : 0} max={6} />
            </div>
          </div>
        ) : (
          <div className="qe-row">
            <div className="qe-field">
              <label className="qe-label">Hours</label>
              <Stepper value={hours} onChange={setHours} min={2} max={8} />
            </div>
            <div className="qe-field">
              <label className="qe-label">Plus</label>
              <button className={'qe-half' + (halfHour ? ' active' : '')} onClick={() => setHalfHour(!halfHour)}>
                +30 min
              </button>
            </div>
          </div>
        )}

        <div className="qe-field" style={{ marginTop: 14 }}>
          <label className="qe-label">Type of clean</label>
          <select className="qe-select" value={svc} onChange={(e) => setSvc(e.target.value as ServiceType)}>
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
                {mode === 'hourly' ? `${hours + (halfHour ? 0.5 : 0)} hrs · $${hourlyRate}/hr` : 'guide price'}
              </span>
            </>
          ) : (
            <>
              <div className="qe-price-value" style={{ fontSize: 16 }}>Quote by phone</div>
              <span className="qe-price-note">We'll confirm your price</span>
            </>
          )}
        </div>
        <button className="btn btn-primary qe-book-btn" onClick={() => onBook({ svc, mode, beds, baths, hours, halfHour, freq })}>
          Book Now <Icon name="arrow" size={16} className="arr" />
        </button>
      </div>
    </div>
  );
}
