'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from './Icon';
import { NG } from '@/lib/data';

interface NavProps {
  active?: string;
  onBook: () => void;
  base?: string;
}

export function Nav({ active, onBook, base = '' }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    h();
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <header className={'nav' + (scrolled ? ' scrolled' : '')}>
        <div className="wrap">
          <div className="nav-inner">
            <Link href={base + '#home'} className="brand">
              <Image className="brand-logo" src="/assets/logo.jpg" alt="NG Clean logo" width={40} height={40} />
              <span className="brand-name">NG&nbsp;Clean</span>
            </Link>
            <nav className="nav-links">
              {NG.nav.map((n) => (
                <a key={n.id} href={base + '#' + n.id} className={active === n.id ? 'active' : ''}>
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="nav-right">
              <a className="nav-phone" href={'tel:' + NG.biz.phoneRaw}>
                <Icon name="phone" size={16} /> {NG.biz.phone}
              </a>
              <button className="btn btn-primary btn-book" onClick={onBook}>Book now</button>
              <button className="nav-burger" aria-label="Menu" onClick={() => setOpen(true)}>
                <Icon name="menu" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={'mobile-menu' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
        <div className="mobile-panel" onClick={(e) => e.stopPropagation()}>
          {NG.nav.map((n) => (
            <a key={n.id} href={base + '#' + n.id} onClick={() => setOpen(false)}>
              {n.label}
            </a>
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
