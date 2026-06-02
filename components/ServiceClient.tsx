'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { BookingModal } from './BookingModal';
import { Icon } from './Icon';
import { NG } from '@/lib/data';

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={'faq' + (open ? ' open' : '')}>
      <button className="faq-q" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{q}</span>
        <span className="faq-ic"><Icon name={open ? 'close' : 'arrow'} size={16} /></span>
      </button>
      <div className="faq-a"><p>{a}</p></div>
    </div>
  );
}

export function ServiceClient({ serviceKey }: { serviceKey: string }) {
  const svc = NG.services.find((s) => s.key === serviceKey) || NG.services[0];
  const det = NG.details[svc.key];
  const related = NG.services.filter((s) => s.key !== svc.key).slice(0, 4);

  const [booking, setBooking] = useState<{ open: boolean; service: string | null }>({ open: false, service: null });
  const openBooking = (k?: string) => setBooking({ open: true, service: typeof k === 'string' ? k : svc.key });
  const closeBooking = () => setBooking((b) => ({ ...b, open: false }));

  useEffect(() => {
    document.body.style.overflow = booking.open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [booking.open]);

  return (
    <>
      <Nav active="services" onBook={() => openBooking()} base="/" />
      <main>
        {/* HERO */}
        <section className="sv-hero">
          <div className="wrap">
            <nav className="crumb">
              <Link href="/#home">Home</Link><span>/</span>
              <Link href="/#services">Services</Link><span>/</span>
              <b>{svc.title}</b>
            </nav>
            <div className="sv-hero-grid">
              <div className="sv-hero-tx">
                <span className="eyebrow"><span className="dot"></span>{svc.cat} cleaning</span>
                <h1 className="h-display">{svc.title}</h1>
                <p className="sv-tagline">{det.tagline}</p>
                <p className="lead">{det.intro}</p>
                <div className="sv-hero-cta">
                  <button className="btn btn-primary" onClick={() => openBooking()}>
                    Book this service <Icon name="arrow" size={16} className="arr" />
                  </button>
                  <a className="btn btn-ghost" href={'tel:' + NG.biz.phoneRaw}>
                    <Icon name="phone" size={16} /> {NG.biz.phone}
                  </a>
                </div>
              </div>
              <div className="sv-hero-media">
                <div className="pic" style={{ borderRadius: 'var(--r-xl)', aspectRatio: '5/4.4', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
                  <Image src={NG.IMG.svc[svc.img]} alt={svc.title} fill style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
            <div className="sv-facts">
              {det.facts.map((f, i) => (
                <div className="sv-fact" key={i}>
                  <span className="sv-fact-ic"><Icon name={f.ic} size={20} /></span>
                  <div>
                    <span className="sv-fact-lbl">{f.label}</span>
                    <b>{f.value}</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INCLUDED */}
        <section className="sv-inc">
          <div className="wrap">
            <div className="sv-inc-grid">
              <div>
                <span className="eyebrow"><span className="dot"></span>What&apos;s included</span>
                <h2 className="h-section" style={{ marginTop: 16 }}>
                  Everything in a {svc.title.toLowerCase()}
                </h2>
                <p className="lead" style={{ marginTop: 12, maxWidth: 520 }}>
                  A clear scope, every visit — here&apos;s exactly what our team takes care of.
                </p>
                <div className="inc-grid">
                  {det.includes.map((item, i) => (
                    <div className="inc-item" key={i}>
                      <span className="inc-ck"><Icon name="check" size={14} /></span>{item}
                    </div>
                  ))}
                </div>
                {svc.checklist && (
                  <Link className="inc-link" href="/#checklist">
                    Compare this against our other packages <Icon name="arrow" size={15} className="arr" />
                  </Link>
                )}
              </div>

              <aside className="quote-card">
                <div className="qc-top">
                  <span className="qc-badge"><Icon name={svc.icon} size={22} /></span>
                  <div>
                    <span className="qc-kicker">{svc.cat}</span>
                    <h3>{svc.title}</h3>
                  </div>
                </div>
                <div className="qc-price"><b>Free</b> no-obligation quote</div>
                <p className="qc-note">Tell us about your space and we&apos;ll give you a clear, fair price — no surprises.</p>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => openBooking()}>
                  Book now <Icon name="arrow" size={16} className="arr" />
                </button>
                <a className="btn btn-dark" style={{ width: '100%', marginTop: 10 }} href={'tel:' + NG.biz.phoneRaw}>
                  <Icon name="phone" size={16} /> Call {NG.biz.phone}
                </a>
                <div className="qc-rows">
                  <div className="qc-row"><Icon name="clock" size={16} /><span>Mon–Fri 8am–5pm · Sat–Sun 9am–5pm</span></div>
                  <div className="qc-row"><Icon name="pin" size={16} /><span>Servicing greater Perth</span></div>
                  <div className="qc-row"><Icon name="shield" size={16} /><span>Locally owned · ABN {NG.biz.abn}</span></div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="sv-why">
          <div className="wrap">
            <div className="sec-head center">
              <span className="eyebrow"><span className="dot"></span>Why NG Clean</span>
              <h2 className="h-section">Why choose us for your {svc.title.toLowerCase()}</h2>
            </div>
            <div className="why-grid">
              {NG.why.map((w, i) => (
                <div className="why-card" key={i}>
                  <span className="why-ic"><Icon name={w.icon} size={22} /></span>
                  <h3>{w.t}</h3>
                  <p>{w.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="sv-process">
          <div className="wrap">
            <div className="sec-head center">
              <span className="eyebrow"><span className="dot"></span>How it works</span>
              <h2 className="h-section">Simple from quote to spotless</h2>
            </div>
            <div className="proc-grid">
              {NG.steps.map((s, i) => (
                <div className="proc-step" key={i}>
                  <div className="proc-n">{i + 1}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="sv-faq">
          <div className="wrap">
            <div className="sv-faq-grid">
              <div className="sv-faq-head">
                <span className="eyebrow"><span className="dot"></span>FAQs</span>
                <h2 className="h-section" style={{ marginTop: 16 }}>Good to know</h2>
                <p className="lead" style={{ marginTop: 12 }}>Still have a question? Give us a call — we&apos;re happy to help.</p>
                <a className="btn btn-dark" href={'tel:' + NG.biz.phoneRaw} style={{ marginTop: 20 }}>
                  <Icon name="phone" size={16} /> {NG.biz.phone}
                </a>
              </div>
              <div className="sv-faq-list">
                {det.faqs.map((f, i) => <Faq key={i} q={f.q} a={f.a} />)}
              </div>
            </div>
          </div>
        </section>

        {/* RELATED */}
        <section className="sv-related">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow"><span className="dot"></span>More services</span>
              <h2 className="h-section" style={{ marginTop: 16 }}>Explore other cleaning services</h2>
            </div>
            <div className="rel-grid">
              {related.map((r) => (
                <Link className="rel-card" key={r.key} href={'/services/' + r.key}>
                  <div className="rel-photo" style={{ position: 'relative' }}>
                    <Image src={NG.IMG.svc[r.img]} alt={r.title} fill style={{ objectFit: 'cover' }} loading="lazy" />
                  </div>
                  <div className="rel-body">
                    <span className="rel-cat"><Icon name={r.icon} size={13} />{r.cat}</span>
                    <h3>{r.title}</h3>
                    <span className="rel-go">View details <Icon name="arrow" size={15} className="arr" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="sv-cta">
          <div className="wrap">
            <div className="sv-cta-card">
              <div>
                <h2>Ready for a spotless space?</h2>
                <p>Book your {svc.title.toLowerCase()} today, or call us for a free, no-obligation quote.</p>
              </div>
              <div className="sv-cta-btns">
                <button className="btn btn-primary" onClick={() => openBooking()}>
                  Book now <Icon name="arrow" size={16} className="arr" />
                </button>
                <a className="btn btn-light" href={'tel:' + NG.biz.phoneRaw}>
                  <Icon name="phone" size={16} /> {NG.biz.phone}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onBook={() => openBooking()} base="/" />
      <BookingModal open={booking.open} onClose={closeBooking} initialService={booking.service} />
    </>
  );
}
