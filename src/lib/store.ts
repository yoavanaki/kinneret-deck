// ============================================================
// DATABASE STORE — Uses Vercel Postgres (Neon) for persistence.
// Falls back to in-memory store when POSTGRES_URL is not set
// (for local development).
// ============================================================

import { sql } from "@vercel/postgres";

export interface Comment {
  id: string;
  slide_id: string;
  author: string;
  text: string;
  created_at: string;
}

export interface ShareLink {
  id: string;
  created_at: string;
}

export interface ViewEvent {
  id?: string;
  link_id: string;
  email: string;
  slide_id: string;
  duration: number;
  timestamp: string;
}

// ---- Database initialization ----
let dbInitialized = false;

export async function initDB() {
  if (!process.env.POSTGRES_URL || dbInitialized) return;
  dbInitialized = true;

  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      slide_id TEXT NOT NULL,
      author TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS share_links (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS view_events (
      id SERIAL PRIMARY KEY,
      link_id TEXT NOT NULL,
      email TEXT NOT NULL,
      slide_id TEXT NOT NULL,
      duration REAL NOT NULL DEFAULT 0,
      timestamp TIMESTAMP DEFAULT NOW()
    )
  `;
}

// ---- In-memory fallback for local dev ----
const globalAny = globalThis as any;
if (!globalAny.__mem_comments) globalAny.__mem_comments = [];
if (!globalAny.__mem_shareLinks) globalAny.__mem_shareLinks = [];
if (!globalAny.__mem_viewEvents) globalAny.__mem_viewEvents = [];

const mem = {
  get comments(): Comment[] { return globalAny.__mem_comments; },
  get shareLinks(): ShareLink[] { return globalAny.__mem_shareLinks; },
  get viewEvents(): ViewEvent[] { return globalAny.__mem_viewEvents; },
};

function useDB() {
  return !!process.env.POSTGRES_URL;
}

// ---- Comments ----
export async function getComments(slideId?: string): Promise<Comment[]> {
  if (!useDB()) {
    if (slideId) return mem.comments.filter((c) => c.slide_id === slideId);
    return mem.comments;
  }
  await initDB();
  if (slideId) {
    const { rows } = await sql`SELECT * FROM comments WHERE slide_id = ${slideId} ORDER BY created_at ASC`;
    return rows as Comment[];
  }
  const { rows } = await sql`SELECT * FROM comments ORDER BY created_at ASC`;
  return rows as Comment[];
}

export async function addComment(comment: Comment): Promise<Comment> {
  if (!useDB()) {
    mem.comments.push(comment);
    return comment;
  }
  await initDB();
  await sql`INSERT INTO comments (id, slide_id, author, text, created_at) VALUES (${comment.id}, ${comment.slide_id}, ${comment.author}, ${comment.text}, ${comment.created_at})`;
  return comment;
}

// ---- Share Links ----
export async function getShareLink(id: string): Promise<ShareLink | null> {
  if (!useDB()) {
    return mem.shareLinks.find((l) => l.id === id) || null;
  }
  await initDB();
  const { rows } = await sql`SELECT * FROM share_links WHERE id = ${id}`;
  return (rows[0] as ShareLink) || null;
}

export async function getAllShareLinks(): Promise<ShareLink[]> {
  if (!useDB()) {
    return mem.shareLinks;
  }
  await initDB();
  const { rows } = await sql`SELECT * FROM share_links ORDER BY created_at DESC`;
  return rows as ShareLink[];
}

export async function createShareLink(link: ShareLink): Promise<ShareLink> {
  if (!useDB()) {
    const existing = mem.shareLinks.find((l) => l.id === link.id);
    if (!existing) mem.shareLinks.push(link);
    return link;
  }
  await initDB();
  await sql`INSERT INTO share_links (id, created_at) VALUES (${link.id}, ${link.created_at}) ON CONFLICT (id) DO NOTHING`;
  return link;
}

// ---- View Events ----
export async function trackView(event: ViewEvent): Promise<void> {
  if (!useDB()) {
    mem.viewEvents.push(event);
    return;
  }
  await initDB();
  await sql`INSERT INTO view_events (link_id, email, slide_id, duration, timestamp) VALUES (${event.link_id}, ${event.email}, ${event.slide_id}, ${event.duration}, ${event.timestamp})`;
}

export async function getViewEvents(linkId?: string): Promise<ViewEvent[]> {
  if (!useDB()) {
    if (linkId) return mem.viewEvents.filter((e) => e.link_id === linkId);
    return mem.viewEvents;
  }
  await initDB();
  if (linkId) {
    const { rows } = await sql`SELECT * FROM view_events WHERE link_id = ${linkId} ORDER BY timestamp ASC`;
    return rows as ViewEvent[];
  }
  const { rows } = await sql`SELECT * FROM view_events ORDER BY timestamp ASC`;
  return rows as ViewEvent[];
}
