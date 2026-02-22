// ============================================================
// DATABASE STORE — Uses Vercel Postgres (Neon) for persistence.
// Falls back to a file-based JSON store when POSTGRES_URL is not set
// (for local development), so data survives server restarts.
// ============================================================

import { sql } from "@vercel/postgres";
import { readFileStore, writeFileStore } from "./fileStore";

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
  updated_at?: string;
  disabled?: boolean;
  slide_ids?: string[]; // snapshot of active slide IDs at create/refresh time
  label?: string;
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

  // Migrate: add new columns to share_links if they don't exist
  await sql`ALTER TABLE share_links ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP`;
  await sql`ALTER TABLE share_links ADD COLUMN IF NOT EXISTS disabled BOOLEAN DEFAULT false`;
  await sql`ALTER TABLE share_links ADD COLUMN IF NOT EXISTS slide_ids TEXT`;
  await sql`ALTER TABLE share_links ADD COLUMN IF NOT EXISTS label TEXT`;

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

// ---- File-based fallback for local dev ----
// (data is persisted to .data/store.json so it survives server restarts)

function useDB() {
  return !!process.env.POSTGRES_URL;
}

function deserializeShareLink(row: any): ShareLink {
  return {
    ...row,
    disabled: row.disabled ?? false,
    slide_ids: row.slide_ids
      ? typeof row.slide_ids === "string"
        ? JSON.parse(row.slide_ids)
        : row.slide_ids
      : undefined,
  };
}

// ---- Comments ----
export async function getComments(slideId?: string): Promise<Comment[]> {
  if (!useDB()) {
    const { comments } = readFileStore();
    if (slideId) return comments.filter((c) => c.slide_id === slideId);
    return comments;
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
    writeFileStore((d) => ({ ...d, comments: [...d.comments, comment] }));
    return comment;
  }
  await initDB();
  await sql`INSERT INTO comments (id, slide_id, author, text, created_at) VALUES (${comment.id}, ${comment.slide_id}, ${comment.author}, ${comment.text}, ${comment.created_at})`;
  return comment;
}

// ---- Share Links ----
export async function getShareLink(id: string): Promise<ShareLink | null> {
  if (!useDB()) {
    const { shareLinks } = readFileStore();
    const link = shareLinks.find((l) => l.id === id);
    return link ? deserializeShareLink(link) : null;
  }
  await initDB();
  const { rows } = await sql`SELECT * FROM share_links WHERE id = ${id}`;
  return rows[0] ? deserializeShareLink(rows[0]) : null;
}

export async function getAllShareLinks(): Promise<ShareLink[]> {
  if (!useDB()) {
    return readFileStore().shareLinks.map(deserializeShareLink);
  }
  await initDB();
  const { rows } = await sql`SELECT * FROM share_links ORDER BY created_at DESC`;
  return rows.map(deserializeShareLink);
}

export async function createShareLink(link: ShareLink): Promise<ShareLink> {
  const slideIdsJson = link.slide_ids ? JSON.stringify(link.slide_ids) : null;
  if (!useDB()) {
    writeFileStore((d) => {
      if (d.shareLinks.find((l) => l.id === link.id)) return d;
      return { ...d, shareLinks: [...d.shareLinks, link] };
    });
    return link;
  }
  await initDB();
  await sql`
    INSERT INTO share_links (id, created_at, updated_at, disabled, slide_ids, label)
    VALUES (${link.id}, ${link.created_at}, ${link.updated_at ?? null}, ${link.disabled ?? false}, ${slideIdsJson}, ${link.label ?? null})
    ON CONFLICT (id) DO NOTHING
  `;
  return link;
}

export async function updateShareLink(
  id: string,
  updates: { disabled?: boolean; slide_ids?: string[]; label?: string }
): Promise<ShareLink | null> {
  const now = new Date().toISOString();
  if (!useDB()) {
    let updated: ShareLink | null = null;
    writeFileStore((d) => {
      const idx = d.shareLinks.findIndex((l) => l.id === id);
      if (idx < 0) return d;
      const next = [...d.shareLinks];
      next[idx] = { ...next[idx], ...updates, updated_at: now };
      updated = deserializeShareLink(next[idx]);
      return { ...d, shareLinks: next };
    });
    return updated;
  }
  await initDB();
  const slideIdsJson = updates.slide_ids !== undefined ? JSON.stringify(updates.slide_ids) : undefined;

  if (updates.disabled !== undefined && slideIdsJson !== undefined) {
    const { rows } = await sql`
      UPDATE share_links SET disabled = ${updates.disabled}, slide_ids = ${slideIdsJson}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    return rows[0] ? deserializeShareLink(rows[0]) : null;
  } else if (updates.disabled !== undefined) {
    const { rows } = await sql`
      UPDATE share_links SET disabled = ${updates.disabled}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    return rows[0] ? deserializeShareLink(rows[0]) : null;
  } else if (slideIdsJson !== undefined) {
    const { rows } = await sql`
      UPDATE share_links SET slide_ids = ${slideIdsJson}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    return rows[0] ? deserializeShareLink(rows[0]) : null;
  }
  return getShareLink(id);
}

// ---- View Events ----
export async function trackView(event: ViewEvent): Promise<void> {
  if (!useDB()) {
    writeFileStore((d) => ({ ...d, viewEvents: [...d.viewEvents, event] }));
    return;
  }
  await initDB();
  await sql`INSERT INTO view_events (link_id, email, slide_id, duration, timestamp) VALUES (${event.link_id}, ${event.email}, ${event.slide_id}, ${event.duration}, ${event.timestamp})`;
}

export async function getViewEvents(linkId?: string): Promise<ViewEvent[]> {
  if (!useDB()) {
    const { viewEvents } = readFileStore();
    if (linkId) return viewEvents.filter((e) => e.link_id === linkId);
    return viewEvents;
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
    return readFileStore().slideEdits;
  }
  await initDB();
  const { rows } = await sql`SELECT * FROM slide_edits ORDER BY updated_at ASC`;
  return rows as SlideEdit[];
}

export async function saveSlideEdit(slideId: string, field: string, value: string): Promise<void> {
  if (!useDB()) {
    writeFileStore((d) => {
      const idx = d.slideEdits.findIndex((e) => e.slide_id === slideId && e.field === field);
      const edit: SlideEdit = { slide_id: slideId, field, value, updated_at: new Date().toISOString() };
      const next = [...d.slideEdits];
      if (idx >= 0) next[idx] = edit;
      else next.push(edit);
      return { ...d, slideEdits: next };
    });
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
    return readFileStore().slideOrder;
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
    writeFileStore((d) => ({
      ...d,
      slideOrder: { slide_ids: slideIds, graveyard_index: graveyardIndex, updated_at: new Date().toISOString() },
    }));
    return;
  }
  await initDB();
  await sql`
    INSERT INTO slide_order (id, slide_ids, graveyard_index, updated_at)
    VALUES ('default', ${json}, ${graveyardIndex}, NOW())
    ON CONFLICT (id) DO UPDATE SET slide_ids = ${json}, graveyard_index = ${graveyardIndex}, updated_at = NOW()
  `;
}
