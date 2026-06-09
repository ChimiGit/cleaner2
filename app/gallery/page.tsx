import { GalleryPageClient } from '@/components/GalleryPageClient';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery — Our Cleaning Work in Perth',
  description: 'See before-and-after photos from NG Clean jobs across Perth. End of lease, deep cleans, carpet steam cleaning and more.',
  alternates: { canonical: 'https://ngclean.com.au/gallery' },
  openGraph: {
    title: 'Gallery — NG Clean Perth',
    description: 'Browse our cleaning work across Perth homes and offices.',
    url: 'https://ngclean.com.au/gallery',
  },
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
