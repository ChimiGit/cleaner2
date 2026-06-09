'use client';

import { useState, useEffect } from 'react';
import { Nav } from './Nav';
import { Hero } from './Hero';
import type { QuoteData } from './QuoteEstimator';
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
import type { PricingConfig } from '@/lib/pricing';
import { DEFAULT_PRICING } from '@/lib/pricing';



export function HomeClient() {
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [booking, setBooking] = useState<{ open: boolean; service: string | null; pricingMode: 'size' | 'hourly'; beds: number | null; baths: number | null; hours: number | null; extraMins: number; frequency: string | null; addons: string[] | null; carpetRooms: number | null }>({ open: false, service: null, pricingMode: 'size', beds: null, baths: null, hours: null, extraMins: 0, frequency: null, addons: null, carpetRooms: null });
  const [highlight, setHighlight] = useState<string | null>(null);
  const [active, setActive] = useState('home');

  useEffect(() => {
    fetch('/api/pricing').then(r => r.json()).then(setPricing).catch(() => {});
  }, []);

  const openBooking = (service?: string) =>
    setBooking({ open: true, service: typeof service === 'string' ? service : null, pricingMode: 'size', beds: null, baths: null, hours: null, extraMins: 0, frequency: null, addons: null, carpetRooms: null });

  const openBookingFromQuote = (data: QuoteData) =>
    setBooking({
      open: true,
      service: data.svc,
      pricingMode: data.mode,
      beds: data.mode === 'size' ? data.beds : null,
      baths: data.mode === 'size' ? data.baths : null,
      hours: data.mode === 'hourly' ? data.hours : null,
      extraMins: data.mode === 'hourly' ? data.extraMins : 0,
      frequency: data.freq,
      addons: null,
      carpetRooms: null,
    });

  const closeBooking = () => setBooking((b) => ({ ...b, open: false }));

  const openChecklist = (plan?: string) => {
    setHighlight(plan || 'vacate');
    const el = document.getElementById('checklist');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const ids = ['home', 'services', 'checklist', 'about', 'reviews', 'contact'];
    const pick = () => {
      const line = 130;
      const scrollY = window.scrollY;
      const atBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) { setActive(ids[ids.length - 1]); updateHash(ids[ids.length - 1]); return; }
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
      updateHash(current);
    };
    const updateHash = (id: string) => {
      const hash = id === 'home' ? '' : `#${id}`;
      if (window.location.hash !== hash) {
        history.replaceState(null, '', hash || window.location.pathname);
      }
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
        <Hero onBook={(data) => data ? openBookingFromQuote(data) : openBooking()} pricing={pricing} />
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
      <BookingModal open={booking.open} onClose={closeBooking} pricing={pricing} initialService={booking.service} initialPricingMode={booking.pricingMode} initialBeds={booking.beds} initialBaths={booking.baths} initialHours={booking.hours} initialExtraMins={booking.extraMins} initialFrequency={booking.frequency} initialAddons={booking.addons} initialCarpetRooms={booking.carpetRooms} />
    </>
  );
}
