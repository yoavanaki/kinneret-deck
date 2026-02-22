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

export interface SlideEdit {
  slide_id: string;
  field: string;
  value: string;
  updated_at: string;
}

export interface SlideOrder {
  /** Ordered array of slide IDs; slides after graveyardIndex are hidden from viewers */
  slide_ids: string[];
  /** Index of the graveyard divider (-1 means no graveyard) */
  graveyard_index: number;
  updated_at: string;
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

  await sql`
    CREATE TABLE IF NOT EXISTS slide_edits (
      slide_id TEXT NOT NULL,
      field TEXT NOT NULL,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (slide_id, field)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS slide_order (
      id TEXT PRIMARY KEY DEFAULT 'default',
      slide_ids TEXT NOT NULL,
      graveyard_index INTEGER NOT NULL DEFAULT -1,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

// ---- In-memory fallback for local dev ----
const globalAny = globalThis as any;
if (!globalAny.__mem_comments) globalAny.__mem_comments = [];
if (!globalAny.__mem_shareLinks) globalAny.__mem_shareLinks = [];
if (!globalAny.__mem_viewEvents) globalAny.__mem_viewEvents = [];
if (!globalAny.__mem_slideEdits) globalAny.__mem_slideEdits = [];
if (!globalAny.__mem_slideOrder) globalAny.__mem_slideOrder = null;

const mem = {
  get comments(): Comment[] { return globalAny.__mem_comments; },
  get shareLinks(): ShareLink[] { return globalAny.__mem_shareLinks; },
  get viewEvents(): ViewEvent[] { return globalAny.__mem_viewEvents; },
  get slideEdits(): SlideEdit[] { return globalAny.__mem_slideEdits; },
  get slideOrder(): SlideOrder | null { return globalAny.__mem_slideOrder; },
  set slideOrder(v: SlideOrder | null) { globalAny.__mem_slideOrder = v; },
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

// ---- Slide Edits ----
export async function getSlideEdits(): Promise<SlideEdit[]> {
  if (!useDB()) {
    return mem.slideEdits;
  }
  await initDB();
  const { rows } = await sql`SELECT * FROM slide_edits ORDER BY updated_at ASC`;
  return rows as SlideEdit[];
}

export async function saveSlideEdit(slideId: string, field: string, value: string): Promise<void> {
  if (!useDB()) {
    const idx = mem.slideEdits.findIndex((e) => e.slide_id === slideId && e.field === field);
    const edit: SlideEdit = { slide_id: slideId, field, value, updated_at: new Date().toISOString() };
    if (idx >= 0) mem.slideEdits[idx] = edit;
    else mem.slideEdits.push(edit);
    return;
  }
  await initDB();
  await sql`
    INSERT INTO slide_edits (slide_id, field, value, updated_at)
    VALUES (${slideId}, ${field}, ${value}, NOW())
    ON CONFLICT (slide_id, field) DO UPDATE SET value = ${value}, updated_at = NOW()
  `;
}

// ---- Slide Order ----
export async function getSlideOrder(): Promise<SlideOrder | null> {
  if (!useDB()) {
    return mem.slideOrder;
  }
  await initDB();
  const { rows } = await sql`SELECT * FROM slide_order WHERE id = 'default'`;
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    slide_ids: JSON.parse(row.slide_ids as string),
    graveyard_index: row.graveyard_index as number,
    updated_at: row.updated_at as string,
  };
}

export async function saveSlideOrder(slideIds: string[], graveyardIndex: number): Promise<void> {
  const json = JSON.stringify(slideIds);
  if (!useDB()) {
    mem.slideOrder = { slide_ids: slideIds, graveyard_index: graveyardIndex, updated_at: new Date().toISOString() };
    return;
  }
  await initDB();
  await sql`
    INSERT INTO slide_order (id, slide_ids, graveyard_index, updated_at)
    VALUES ('default', ${json}, ${graveyardIndex}, NOW())
    ON CONFLICT (id) DO UPDATE SET slide_ids = ${json}, graveyard_index = ${graveyardIndex}, updated_at = NOW()
  `;
}
