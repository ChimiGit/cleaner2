import { pgTable, serial, jsonb, timestamp } from 'drizzle-orm/pg-core';
import type { PricingConfig } from './pricing';

export const pricingConfig = pgTable('pricing_config', {
  id: serial('id').primaryKey(),
  config: jsonb('config').$type<PricingConfig>().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
