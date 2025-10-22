import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, credits, reports, InsertReport } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Credits management
export async function getUserCredits(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(credits).where(eq(credits.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function initializeUserCredits(userId: number, initialCredits: number = 0) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(credits).values({
    userId,
    credits: initialCredits,
  }).onDuplicateKeyUpdate({
    set: { credits: initialCredits },
  });
}

export async function deductCredit(userId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const userCredits = await getUserCredits(userId);
  if (!userCredits || userCredits.credits <= 0) return false;
  
  await db.update(credits)
    .set({ credits: userCredits.credits - 1 })
    .where(eq(credits.userId, userId));
  
  return true;
}

export async function addCredits(userId: number, amount: number) {
  const db = await getDb();
  if (!db) return;
  
  const userCredits = await getUserCredits(userId);
  if (!userCredits) {
    await initializeUserCredits(userId, amount);
  } else {
    await db.update(credits)
      .set({ credits: userCredits.credits + amount })
      .where(eq(credits.userId, userId));
  }
}

// Reports management
export async function createReport(report: InsertReport) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(reports).values(report);
  return result;
}

export async function getUserReports(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(reports).where(eq(reports.userId, userId)).orderBy(reports.createdAt);
}

export async function getReportById(reportId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(reports)
    .where(eq(reports.id, reportId))
    .limit(1);
  
  if (result.length === 0) return null;
  if (result[0].userId !== userId) return null;
  
  return result[0];
}
