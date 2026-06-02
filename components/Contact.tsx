'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Icon } from './Icon';
import { NG } from '@/lib/data';

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

export function Contact() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactForm>();

  const nameVal = watch('name', '');

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="contact-card">
          <div className="contact-info">
            <span className="eyebrow dark"><span className="dot"></span>Get in touch</span>
            <h2 className="h-section" style={{ color: '#fff', marginTop: 16 }}>
              Let&apos;s make your space fresh &amp; stress-free
            </h2>
            <p className="ci-lead">{NG.contactBlurbs[0]}</p>

            <div className="ci-rows">
              <a className="ci-row" href={'tel:' + NG.biz.phoneRaw}>
                <span className="ci-ic"><Icon name="phone" size={18} /></span>
                <span><b>{NG.biz.phone}</b><em>Call or text to book</em></span>
              </a>
              <div className="ci-row">
                <span className="ci-ic"><Icon name="clock" size={18} /></span>
                <span>
                  {NG.biz.hours.map((h, i) => (
                    <b key={i} style={{ display: 'block', fontWeight: 600 }}>
                      {h.d}: <span style={{ color: 'rgba(255,255,255,.72)', fontWeight: 400 }}>{h.t}</span>
                    </b>
                  ))}
                </span>
              </div>
              <div className="ci-row">
                <span className="ci-ic"><Icon name="shield" size={18} /></span>
                <span><b>ABN {NG.biz.abn}</b><em>Locally owned &amp; operated in Perth</em></span>
              </div>
            </div>
          </div>

          <div className="contact-form">
            {done ? (
              <div className="success" style={{ padding: '40px 10px' }}>
                <div className="sk"><Icon name="check" size={34} /></div>
                <h3 style={{ margin: '0 0 6px', fontSize: 22 }}>
                  Thanks, {nameVal.split(' ')[0] || 'there'}!
                </h3>
                <p className="lead">We&apos;ve got your message and will be in touch shortly with your free quote.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <h3 className="cf-title">Request a free quote</h3>
                <div className="f-row">
                  <div className={'field' + (errors.name ? ' err' : '')}>
                    <label>Name</label>
                    <input
                      {...register('name', { required: 'Required' })}
                      placeholder="Your name"
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
                      placeholder="04xx xxx xxx"
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
                    placeholder="you@email.com"
                  />
                  {errors.email && <div className="msg">{errors.email.message}</div>}
                </div>
                <div className="field">
                  <label>Service</label>
                  <select {...register('service')}>
                    <option value="">Select a service…</option>
                    {NG.services.map((s) => (
                      <option key={s.key} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Message <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>(optional)</span></label>
                  <textarea rows={3} {...register('message')} placeholder="Tell us about your space…"></textarea>
                </div>
                <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send request'} <Icon name="arrow" size={16} className="arr" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
