'use client';

import { useState } from 'react';
import { Nav } from './Nav';
import { Gallery } from './Gallery';
import { Footer } from './Footer';
import { BookingModal } from './BookingModal';
import { DEFAULT_PRICING } from '@/lib/pricing';

export function GalleryPageClient() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <Nav onBook={() => setBookingOpen(true)} base="/" />
      <main style={{ paddingTop: 80 }}>
        <Gallery />
      </main>
      <Footer onBook={() => setBookingOpen(true)} base="/" />
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        pricing={DEFAULT_PRICING}
      />
    </>
  );
}
