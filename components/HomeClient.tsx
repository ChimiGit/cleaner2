'use client';

import { useState, useEffect } from 'react';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { WhyUs } from './WhyUs';
import { Services } from './Services';
import { HowItWorks } from './HowItWorks';
import { Checklist } from './Checklist';
import { About } from './About';
import { Reviews } from './Reviews';
import { Areas } from './Areas';
import { Contact } from './Contact';
import { Footer } from './Footer';
import { BookingModal } from './BookingModal';
import { NG } from '@/lib/data';

export function HomeClient() {
  const [booking, setBooking] = useState<{ open: boolean; service: string | null }>({ open: false, service: null });
  const [highlight, setHighlight] = useState<string | null>(null);
  const [active, setActive] = useState('home');

  const openBooking = (service?: string) =>
    setBooking({ open: true, service: typeof service === 'string' ? service : null });
  const closeBooking = () => setBooking((b) => ({ ...b, open: false }));

  const openChecklist = (plan?: string) => {
    setHighlight(plan || 'vacate');
    const el = document.getElementById('checklist');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const ids = ['home', 'services', 'checklist', 'about', 'reviews', 'areas', 'contact'];
    const pick = () => {
      const line = 130;
      const scrollY = window.scrollY;
      const atBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) { setActive(ids[ids.length - 1]); return; }
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    pick();
    window.addEventListener('scroll', pick, { passive: true });
    window.addEventListener('resize', pick);
    return () => {
      window.removeEventListener('scroll', pick);
      window.removeEventListener('resize', pick);
    };
  }, []);

  return (
    <>
      <Nav active={active} onBook={() => openBooking()} />
      <main>
        <Hero onBook={() => openBooking()} />
        <WhyUs />
        <Services onBook={openBooking} />
        <HowItWorks onBook={() => openBooking()} />
        <Checklist highlight={highlight} onBook={() => openBooking()} />
        <About onBook={() => openBooking()} />
        <Reviews />
        <Areas />
        <Contact />
      </main>
      <Footer onBook={() => openBooking()} />
      <BookingModal open={booking.open} onClose={closeBooking} initialService={booking.service} />
    </>
  );
}
