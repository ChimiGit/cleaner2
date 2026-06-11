import { GalleryPageClient } from '@/components/GalleryPageClient';
import { db } from '@/lib/db';
import { galleryImages } from '@/lib/schema';
import { asc, count } from 'drizzle-orm';

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

const PAGE_SIZE = 10;

export default async function GalleryPage() {
  const [images, [{ total }]] = await Promise.all([
    db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt)).limit(PAGE_SIZE).catch(() => []),
    db.select({ total: count() }).from(galleryImages).catch(() => [{ total: 0 }]),
  ]);

  return <GalleryPageClient initialImages={images} total={Number(total)} />;
}
