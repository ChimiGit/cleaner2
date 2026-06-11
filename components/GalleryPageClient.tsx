'use client';

import { useState } from 'react';
import { Nav } from './Nav';
import { Gallery, type GalleryImage } from './Gallery';
import { Footer } from './Footer';
import { BookingModal } from './BookingModal';
import { DEFAULT_PRICING } from '@/lib/pricing';

export function GalleryPageClient({ initialImages, total }: { initialImages?: GalleryImage[]; total?: number }) {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <Nav onBook={() => setBookingOpen(true)} base="/" />
      <main style={{ paddingTop: 80 }}>
        <Gallery initialImages={initialImages} total={total} />
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
