import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pricingConfig } from '@/lib/schema';
import { DEFAULT_PRICING } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await db.select().from(pricingConfig).limit(1);
    return NextResponse.json(rows[0]?.config ?? DEFAULT_PRICING);
  } catch {
    return NextResponse.json(DEFAULT_PRICING);
  }
}
