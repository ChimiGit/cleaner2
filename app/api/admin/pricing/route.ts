import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pricingConfig } from '@/lib/schema';
import { DEFAULT_PRICING, type PricingConfig } from '@/lib/pricing';
import { isAdminAuthed } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const rows = await db.select().from(pricingConfig).limit(1);
    return NextResponse.json(rows[0]?.config ?? DEFAULT_PRICING);
  } catch {
    return NextResponse.json(DEFAULT_PRICING);
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: PricingConfig = await req.json();

  try {
    const rows = await db.select().from(pricingConfig).limit(1);
    if (rows.length === 0) {
      await db.insert(pricingConfig).values({ config: body });
    } else {
      await db
        .update(pricingConfig)
        .set({ config: body, updatedAt: new Date() });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
