import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ServiceClient } from '@/components/ServiceClient';
import { NG } from '@/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return NG.services.map((s) => ({ slug: s.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const svc = NG.services.find((s) => s.key === slug);
  if (!svc) return {};
  const det = NG.details[slug];
  const description = det.tagline + '. ' + det.intro.slice(0, 120) + '…';
  return {
    title: `${svc.title} in Perth`,
    description,
    alternates: { canonical: `https://ngclean.com.au/services/${slug}` },
    openGraph: {
      title: `${svc.title} — NG Clean Perth`,
      description,
      url: `https://ngclean.com.au/services/${slug}`,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const valid = NG.services.some((s) => s.key === slug);
  if (!valid) notFound();
  return <ServiceClient serviceKey={slug} />;
}
