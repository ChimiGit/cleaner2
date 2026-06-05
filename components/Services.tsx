'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from './Icon';
import { Reveal } from './Reveal';
import { NG } from '@/lib/data';

interface ServicesProps {
  onBook: (key: string) => void;
}

export function Services({ onBook }: ServicesProps) {
  const [filter, setFilter] = useState('All');
  const cats = ['All', 'Residential', 'Commercial'];
  const items = filter === 'All' ? NG.services : NG.services.filter((s) => s.cat === filter);

  return (
    <section className="services" id="services">
      <div className="wrap">
        <Reveal className="sec-head center">
          <span className="eyebrow"><span className="dot"></span>Our services</span>
          <h2 className="h-section">Cleaning for every space &amp; need</h2>
          <p className="lead">From routine home upkeep to full bond cleans and commercial work — choose a service and book in minutes.</p>
        </Reveal>

        <div className="svc-filter">
          {cats.map((c) => (
            <button key={c} className={'sf' + (filter === c ? ' on' : '')} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>

        <div className="svc-grid">
          {items.map((s) => (
            <Reveal className="scard" key={s.key}>
              <Link className="scard-photo" href={'/services/' + s.key} aria-label={s.title + ' details'}>
                <Image src={NG.IMG.svc[s.img]} alt={s.title} fill sizes="(max-width: 680px) 100vw, (max-width: 920px) 50vw, 33vw" style={{ objectFit: 'cover' }} loading="lazy" />
                <span className="scard-cat"><Icon name={s.icon} size={13} />{s.cat}</span>
              </Link>
              <div className="scard-body">
                <h3><Link href={'/services/' + s.key}>{s.title}</Link></h3>
                <p>{s.desc}</p>
                <div className="scard-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => onBook(s.key)}>Book now</button>
                  <Link className="btn btn-ghost btn-sm" href={'/services/' + s.key}>View details</Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
