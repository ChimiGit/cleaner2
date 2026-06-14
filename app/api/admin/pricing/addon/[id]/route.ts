import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pricingConfig } from '@/lib/schema';
import { DEFAULT_PRICING } from '@/lib/pricing';
import { isAdminAuthed } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json() as { status: 'active' | 'inactive' };

  try {
    const rows = await db.select().from(pricingConfig).limit(1);
    const current = rows[0]?.config ?? DEFAULT_PRICING;

    const updated = {
      ...current,
      addons: current.addons.map(a => a.id === id ? { ...a, status } : a),
    };

    if (rows.length === 0) {
      await db.insert(pricingConfig).values({ config: updated });
    } else {
      await db.update(pricingConfig).set({ config: updated, updatedAt: new Date() });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
