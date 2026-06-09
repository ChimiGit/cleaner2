import type { MetadataRoute } from 'next';

const BASE = 'https://ngclean.com.au';

const serviceKeys = ['bond', 'deep', 'carpet', 'oven', 'window', 'regular', 'office', 'airbnb', 'school'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const serviceUrls = serviceKeys.map(key => ({
    url: `${BASE}/services/${key}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/gallery`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ...serviceUrls,
  ];
}
