import type { Metadata } from 'next';
import { DM_Serif_Display, Hanken_Grotesk } from 'next/font/google';
import './globals.css';

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ngclean.com.au'),
  title: {
    default: 'NG Clean — Professional Cleaning Services in Perth',
    template: '%s | NG Clean Perth',
  },
  description: 'Reliable, detail-focused cleaning for homes and businesses across Perth. End of lease, deep cleaning, carpet steam clean, oven, window cleaning and more. Get a free quote today.',
  keywords: [
    'cleaning services Perth', 'house cleaning Perth', 'end of lease cleaning Perth',
    'bond cleaning Perth', 'deep cleaning Perth', 'carpet steam cleaning Perth',
    'office cleaning Perth', 'window cleaning Perth', 'oven cleaning Perth',
    'professional cleaners Perth WA',
  ],
  authors: [{ name: 'NG Clean' }],
  creator: 'NG Clean',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://ngclean.com.au' },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://ngclean.com.au',
    siteName: 'NG Clean',
    title: 'NG Clean — Professional Cleaning Services in Perth',
    description: 'Reliable, detail-focused cleaning for homes and businesses across Perth. End of lease, deep cleaning, carpet, oven & window cleaning. Free quotes.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'NG Clean — Professional Cleaning Services in Perth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NG Clean — Professional Cleaning Services in Perth',
    description: 'Reliable, detail-focused cleaning for homes and businesses across Perth. End of lease, deep cleaning, carpet, oven & window cleaning. Free quotes.',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: '/assets/logo.png',
    apple: '/assets/logo.png',
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://ngclean.com.au/#business',
  name: 'NG Clean',
  url: 'https://ngclean.com.au',
  logo: 'https://ngclean.com.au/assets/logo.png',
  image: 'https://ngclean.com.au/opengraph-image',
  description: 'Professional cleaning services in Perth WA. End of lease, deep cleaning, carpet steam clean, oven, window and regular residential cleaning.',
  telephone: '+61403711348',
  email: 'info@ngclean.com.au',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Perth',
    addressRegion: 'WA',
    addressCountry: 'AU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -31.9505,
    longitude: 115.8605,
  },
  areaServed: {
    '@type': 'City',
    name: 'Perth',
  },
  priceRange: '$$',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '07:00', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '08:00', closes: '17:00' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Cleaning Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Regular Residential Cleaning' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'End of Lease / Bond Cleaning' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Deep Cleaning' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Carpet Steam Cleaning' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Oven Cleaning' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Window Cleaning' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Office Cleaning' } },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hanken.variable} ${dmSerif.variable}`}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0242JN53PW" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-0242JN53PW');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
