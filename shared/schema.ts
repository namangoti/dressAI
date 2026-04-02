import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wardrobeItems = pgTable("wardrobe_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull(),
  color: text("color"),
  brand: text("brand"),
  imageUrl: text("image_url"),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tryOnHistory = pgTable("try_on_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  wardrobeItemId: varchar("wardrobe_item_id").references(() => wardrobeItems.id),
  modelImageUrl: text("model_image_url"),
  resultImageUrl: text("result_image_url"),
  isSaved: boolean("is_saved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertWardrobeItemSchema = createInsertSchema(wardrobeItems).omit({ id: true, createdAt: true });
export const insertTryOnHistorySchema = createInsertSchema(tryOnHistory).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWardrobeItem = z.infer<typeof insertWardrobeItemSchema>;
export type WardrobeItem = typeof wardrobeItems.$inferSelect;
export type InsertTryOnHistory = z.infer<typeof insertTryOnHistorySchema>;
export type TryOnHistory = typeof tryOnHistory.$inferSelect;
