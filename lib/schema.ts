import { pgTable, serial, jsonb, timestamp, text, integer } from 'drizzle-orm/pg-core';
import type { PricingConfig } from './pricing';

export const pricingConfig = pgTable('pricing_config', {
  id: serial('id').primaryKey(),
  config: jsonb('config').$type<PricingConfig>().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const galleryImages = pgTable('gallery_images', {
  id: serial('id').primaryKey(),
  key: text('key').notNull(),
  url: text('url').notNull(),
  caption: text('caption').default(''),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
