'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Icon } from './Icon';
import { NG } from '@/lib/data';

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  initialService?: string | null;
}

export function BookingModal({ open, onClose, initialService }: BookingModalProps) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState<string | null>(null);
  const [svcErr, setSvcErr] = useState(false);
  const [schedErr, setSchedErr] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BookingForm>();

  const nameVal = watch('name', '');
  const svc = NG.services.find((s) => s.key === service);

  useEffect(() => {
    if (open) {
      setStep(initialService ? 1 : 0);
      setService(initialService || null);
      setSize(null);
      setDate('');
      setTime(null);
      setSvcErr(false);
      setSchedErr({});
      reset();
    }
  }, [open, initialService, reset]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const nextStep = () => {
    if (step === 0) {
      if (!service) { setSvcErr(true); return; }
    }
    if (step === 1) {
      const e: Record<string, boolean> = {};
      if (!size) e.size = true;
      if (!date) e.date = true;
      if (!time) e.time = true;
      setSchedErr(e);
      if (Object.keys(e).length) return;
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const onSubmit = async (data: BookingForm) => {
    setSubmitting(true);
    try {
      await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, service: svc?.title, size, date, time }),
      });
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const titles = [
    { h: 'What can we clean?', p: 'Pick the service that fits your space.' },
    { h: 'Schedule your visit', p: 'Tell us the size and when works for you.' },
    { h: 'Your details', p: 'Where should our team head, and how do we reach you?' },
    { h: 'Booking requested', p: '' },
  ];
  const t = titles[step];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div
      className={'modal' + (open ? ' open' : '')}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <h3>{t.h}</h3>
            {t.p && <p>{t.p}</p>}
          </div>
          <button className="modal-x" onClick={onClose} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </div>

        {step < 3 && (
          <div className="steps-bar">
            {[0, 1, 2].map((i) => <i key={i} className={i <= step ? 'on' : ''}></i>)}
          </div>
        )}

        <div className="modal-body">
          {step === 0 && (
            <div className="opt-grid">
              {NG.services.map((s) => (
                <button
                  key={s.key}
                  className={'opt' + (service === s.key ? ' sel' : '')}
                  onClick={() => { setService(s.key); setSvcErr(false); }}
                >
                  <span className="opt-ic"><Icon name={s.icon} size={22} /></span>
                  <span>
                    <span className="opt-tt">{s.title}</span><br />
                    <span className="opt-ds">{s.desc.split(' ').slice(0, 7).join(' ')}…</span>
                  </span>
                  <span className="opt-pr">{s.cat}</span>
                </button>
              ))}
              {svcErr && <div className="msg" style={{ color: '#c5412f' }}>Please choose a service.</div>}
            </div>
          )}

          {step === 1 && (
            <>
              <div className={'field' + (schedErr.size ? ' err' : '')}>
                <label>Property size</label>
                <div className="chips">
                  {NG.sizes.map((s) => (
                    <button key={s} className={'chip' + (size === s ? ' sel' : '')} onClick={() => setSize(s)}>{s}</button>
                  ))}
                </div>
                {schedErr.size && <div className="msg">Select a size.</div>}
              </div>
              <div className={'field' + (schedErr.date ? ' err' : '')}>
                <label>Preferred date</label>
                <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} />
                {schedErr.date && <div className="msg">Pick a date.</div>}
              </div>
              <div className={'field' + (schedErr.time ? ' err' : '')}>
                <label>Preferred time</label>
                <div className="chips">
                  {NG.times.map((s) => (
                    <button key={s} className={'chip' + (time === s ? ' sel' : '')} onClick={() => setTime(s)}>{s}</button>
                  ))}
                </div>
                {schedErr.time && <div className="msg">Pick a time slot.</div>}
              </div>
            </>
          )}

          {step === 2 && (
            <form id="booking-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="f-row">
                <div className={'field' + (errors.name ? ' err' : '')}>
                  <label>Full name</label>
                  <input
                    {...register('name', { required: 'Required' })}
                    placeholder="Jane Doe"
                  />
                  {errors.name && <div className="msg">{errors.name.message}</div>}
                </div>
                <div className={'field' + (errors.phone ? ' err' : '')}>
                  <label>Phone</label>
                  <input
                    {...register('phone', {
                      required: 'Required',
                      validate: (v) => v.replace(/\D/g, '').length >= 7 || 'Valid phone needed',
                    })}
                    placeholder="(555) 010-2233"
                  />
                  {errors.phone && <div className="msg">{errors.phone.message}</div>}
                </div>
              </div>
              <div className={'field' + (errors.email ? ' err' : '')}>
                <label>Email</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Required',
                    pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Valid email needed' },
                  })}
                  placeholder="jane@email.com"
                />
                {errors.email && <div className="msg">{errors.email.message}</div>}
              </div>
              <div className={'field' + (errors.address ? ' err' : '')}>
                <label>Address</label>
                <input
                  {...register('address', { required: 'Required' })}
                  placeholder="123 Maple Ave, Apt 4"
                />
                {errors.address && <div className="msg">{errors.address.message}</div>}
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="success">
              <div className="sk"><Icon name="check" size={34} /></div>
              <h3 style={{ margin: '0 0 6px', fontSize: 22 }}>
                Thanks, {nameVal.split(' ')[0] || 'friend'}!
              </h3>
              <p className="lead" style={{ marginBottom: 18 }}>
                We&apos;ve received your request. NG Clean will confirm your booking and free quote by phone shortly.
              </p>
              <div className="summary" style={{ textAlign: 'left' }}>
                <div className="sr"><span>Service</span><b>{svc ? svc.title : '—'}</b></div>
                <div className="sr"><span>Size</span><b>{size || '—'}</b></div>
                <div className="sr"><span>Date &amp; time</span><b>{date || '—'} · {time || '—'}</b></div>
                <div className="sr"><span>Quote</span><b>Free · confirmed by phone</b></div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>Done</button>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="modal-body" style={{ paddingTop: 0 }}>
            <div className="modal-foot">
              {step > 0
                ? <button className="btn btn-ghost" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                    <Icon name="arrowL" size={16} /> Back
                  </button>
                : <span />
              }
              {step === 2 ? (
                <button className="btn btn-primary" form="booking-form" type="submit" disabled={submitting}>
                  {submitting ? 'Confirming…' : 'Confirm booking'} <Icon name="arrow" size={16} className="arr" />
                </button>
              ) : (
                <button className="btn btn-primary" onClick={nextStep}>
                  Continue <Icon name="arrow" size={16} className="arr" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
