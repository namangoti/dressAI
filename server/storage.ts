import { db } from "./db";
import { users, wardrobeItems, tryOnHistory, type User, type InsertUser, type WardrobeItem, type InsertWardrobeItem, type TryOnHistory, type InsertTryOnHistory } from "@shared/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLocation(userId: string, location: string): Promise<User | undefined>;

  getWardrobeItems(userId?: string): Promise<WardrobeItem[]>;
  getWardrobeItem(id: string): Promise<WardrobeItem | undefined>;
  createWardrobeItem(item: InsertWardrobeItem): Promise<WardrobeItem>;
  updateWardrobeItem(id: string, updates: Partial<InsertWardrobeItem>): Promise<WardrobeItem | undefined>;
  deleteWardrobeItem(id: string): Promise<void>;

  getTryOnHistory(userId?: string): Promise<TryOnHistory[]>;
  createTryOnHistory(history: InsertTryOnHistory): Promise<TryOnHistory>;
  updateTryOnHistorySaved(id: string, isSaved: boolean): Promise<TryOnHistory | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserLocation(userId: string, location: string): Promise<User | undefined> {
    const [user] = await db.update(users).set({ location }).where(eq(users.id, userId)).returning();
    return user;
  }

  async getWardrobeItems(userId?: string): Promise<WardrobeItem[]> {
    if (userId) {
      return db.select().from(wardrobeItems).where(eq(wardrobeItems.userId, userId));
    }
    return db.select().from(wardrobeItems);
  }

  async getWardrobeItem(id: string): Promise<WardrobeItem | undefined> {
    const [item] = await db.select().from(wardrobeItems).where(eq(wardrobeItems.id, id));
    return item;
  }

  async createWardrobeItem(item: InsertWardrobeItem): Promise<WardrobeItem> {
    const [created] = await db.insert(wardrobeItems).values(item).returning();
    return created;
  }

  async updateWardrobeItem(id: string, updates: Partial<InsertWardrobeItem>): Promise<WardrobeItem | undefined> {
    const [updated] = await db.update(wardrobeItems).set(updates).where(eq(wardrobeItems.id, id)).returning();
    return updated;
  }

  async deleteWardrobeItem(id: string): Promise<void> {
    await db.delete(wardrobeItems).where(eq(wardrobeItems.id, id));
  }

  async getTryOnHistory(userId?: string): Promise<TryOnHistory[]> {
    if (userId) {
      return db.select().from(tryOnHistory).where(eq(tryOnHistory.userId, userId));
    }
    return db.select().from(tryOnHistory);
  }

  async createTryOnHistory(history: InsertTryOnHistory): Promise<TryOnHistory> {
    const [created] = await db.insert(tryOnHistory).values(history).returning();
    return created;
  }

  async updateTryOnHistorySaved(id: string, isSaved: boolean): Promise<TryOnHistory | undefined> {
    const [updated] = await db.update(tryOnHistory).set({ isSaved }).where(eq(tryOnHistory.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
