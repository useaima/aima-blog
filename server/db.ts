import { and, eq, desc, like, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, articles, authors, comments, subscribers, categories, tags, articleTags, InsertArticle, InsertAuthor, InsertComment, InsertSubscriber, Article, Author, Comment, Subscriber, Category, Tag } from "../drizzle/schema";
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
    } else if (user.openId === ENV.ownerOpenId) {
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

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ ARTICLE QUERIES ============

export async function getArticles(limit?: number, offset?: number) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(articles).where(eq(articles.status, 'published')).orderBy(desc(articles.publishedAt));
  if (limit) query = query.limit(limit);
  if (offset) query = query.offset(offset);
  return query;
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFeaturedArticles(limit: number = 5) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(articles)
    .where(and(eq(articles.status, 'published'), eq(articles.isFeatured, 1)))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function createArticle(data: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(articles).values(data);
  return result[0];
}

export async function updateArticle(id: number, data: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(articles).set(data).where(eq(articles.id, id));
}

// ============ AUTHOR QUERIES ============

export async function getAuthors(limit?: number) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(authors).orderBy(desc(authors.createdAt));
  if (limit) query = query.limit(limit);
  return query;
}

export async function getAuthorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(authors).where(eq(authors.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAuthor(data: InsertAuthor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(authors).values(data);
  return result[0];
}

export async function updateAuthor(id: number, data: Partial<InsertAuthor>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(authors).set(data).where(eq(authors.id, id));
}

// ============ COMMENT QUERIES ============

export async function getArticleComments(articleId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(comments)
    .where(and(eq(comments.articleId, articleId), eq(comments.status, 'approved'), isNull(comments.parentCommentId)))
    .orderBy(desc(comments.createdAt));
}

export async function createComment(data: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(comments).values(data);
  return result[0];
}

export async function approveComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(comments).set({ status: 'approved' }).where(eq(comments.id, id));
}

// ============ SUBSCRIBER QUERIES ============

export async function getSubscriber(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSubscriber(data: InsertSubscriber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscribers).values(data);
  return result[0];
}

export async function updateSubscriber(id: number, data: Partial<InsertSubscriber>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(subscribers).set(data).where(eq(subscribers.id, id));
}

export async function getSubscriberCount() {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select({ count: sql`COUNT(*)` }).from(subscribers).where(eq(subscribers.status, 'subscribed'));
  return result[0]?.count as number || 0;
}

// ============ CATEGORY QUERIES ============

export async function getCategories() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ TAG QUERIES ============

export async function getTags() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(tags).orderBy(tags.name);
}

export async function getTagBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
