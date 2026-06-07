'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from './Icon';
import { NG } from '@/lib/data';

const SERVICES_DROPDOWN = [
  {
    group: 'Residential',
    items: [
      { key: 'regular', label: 'Regular Cleaning' },
      { key: 'bond',    label: 'End of Lease / Bond' },
      { key: 'deep',    label: 'Deep Cleaning' },
      { key: 'carpet',  label: 'Carpet Cleaning' },
      { key: 'oven',    label: 'Oven Cleaning' },
      { key: 'window',  label: 'Window Cleaning' },
    ],
  },
  {
    group: 'Commercial',
    items: [
      { key: 'office', label: 'Office Cleaning' },
      { key: 'airbnb', label: 'Airbnb Cleaning' },
      { key: 'school', label: 'School / Childcare Cleaning' },
    ],
  },
];

interface NavProps {
  active?: string;
  onBook: () => void;
  base?: string;
}

export function Nav({ active, onBook, base = '' }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    h();
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (!ddOpen) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.nav-dd-wrap')) setDdOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [ddOpen]);

  return (
    <>
      <header className={'nav' + (scrolled ? ' scrolled' : '')}>
        <div className="wrap">
          <div className="nav-inner">
            <Link href={base || '/'} className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Image className="brand-logo" src="/assets/logo.png" alt="NG Clean logo" width={40} height={40} />
              <span className="brand-name">NG&nbsp;Clean</span>
            </Link>
            <nav className="nav-links">
              {/* Services dropdown */}
              <div className="nav-dd-wrap">
                <button
                  className={'nav-dd-trigger' + (active === 'services' || ddOpen ? ' active' : '')}
                  onClick={() => setDdOpen(!ddOpen)}
                  aria-expanded={ddOpen}
                >
                  Services
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className={'nav-dd-chevron' + (ddOpen ? ' open' : '')}>
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {ddOpen && (
                  <div className="nav-dd">
                    <div className="nav-dd-inner">
                      {SERVICES_DROPDOWN.map((group) => (
                        <div key={group.group} className="nav-dd-group">
                          <div className="nav-dd-group-label">{group.group}</div>
                          {group.items.map((item) => (
                            <Link key={item.key} href={'/services/' + item.key} className="nav-dd-item" onClick={() => setDdOpen(false)}>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Other nav links */}
              {NG.nav.filter((n) => n.id !== 'services').map((n) => (
                n.id === 'gallery'
                  ? <a key={n.id} href="/gallery" className={active === n.id ? 'active' : ''}>{n.label}</a>
                  : <a key={n.id} href={base + '#' + n.id} className={active === n.id ? 'active' : ''}>{n.label}</a>
              ))}
            </nav>
            <div className="nav-right">
              <a className="nav-phone" href={'tel:' + NG.biz.phoneRaw}>
                <Icon name="phone" size={16} /> {NG.biz.phone}
              </a>
              <button className="btn btn-primary btn-book" onClick={onBook}>Book now</button>
              <button className="nav-burger" aria-label={open ? 'Close menu' : 'Menu'} onClick={() => setOpen(!open)}>
                <Icon name={open ? 'x' : 'menu'} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={'mobile-menu' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
        <div className="mobile-panel" onClick={(e) => e.stopPropagation()}>
          {/* Services accordion */}
          <button className="mobile-svc-toggle" onClick={() => setSvcOpen(!svcOpen)}>
            Services
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform .2s', transform: svcOpen ? 'rotate(180deg)' : 'none' }}>
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {svcOpen && (
            <div className="mobile-svc-list">
              {SERVICES_DROPDOWN.map((group) => (
                <div key={group.group}>
                  <div className="mobile-svc-group">{group.group}</div>
                  {group.items.map((item) => (
                    <Link key={item.key} href={'/services/' + item.key} className="mobile-svc-item" onClick={() => setOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
          {NG.nav.filter((n) => n.id !== 'services').map((n) => (
            n.id === 'gallery'
              ? <a key={n.id} href="/gallery" onClick={() => setOpen(false)}>{n.label}</a>
              : <a key={n.id} href={base + '#' + n.id} onClick={() => setOpen(false)}>{n.label}</a>
          ))}
          <a className="btn btn-dark" href={'tel:' + NG.biz.phoneRaw}>
            <Icon name="phone" size={16} /> {NG.biz.phone}
          </a>
          <button className="btn btn-primary" onClick={() => { setOpen(false); onBook(); }}>Book now</button>
        </div>
      </div>
    </>
  );
}
