// File-based JSON store for local dev (used when POSTGRES_URL is not set).
// Data is persisted to .data/store.json so it survives server restarts.

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

export interface FileStoreData {
  comments: any[];
  shareLinks: any[];
  viewEvents: any[];
  slideEdits: any[];
  slideOrder: any | null;
}

function defaultData(): FileStoreData {
  return {
    comments: [],
    shareLinks: [],
    viewEvents: [],
    slideEdits: [],
    slideOrder: null,
  };
}

export function readFileStore(): FileStoreData {
  try {
    if (!fs.existsSync(DATA_FILE)) return defaultData();
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return { ...defaultData(), ...JSON.parse(raw) };
  } catch {
    return defaultData();
  }
}

export function writeFileStore(updater: (data: FileStoreData) => FileStoreData): void {
  const current = readFileStore();
  const updated = updater(current);
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
}
