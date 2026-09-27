import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

export type SqliteDatabase = Database.Database

export function createDatabase(filename: string): SqliteDatabase {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true })
  const db = new Database(filename)
  db.pragma('foreign_keys = ON')
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL CHECK (length(trim(name)) > 0),
      sku TEXT NOT NULL UNIQUE CHECK (length(trim(sku)) > 0),
      category TEXT NOT NULL CHECK (length(trim(category)) > 0),
      price REAL NOT NULL CHECK (price >= 0),
      minimum_stock INTEGER NOT NULL CHECK (minimum_stock >= 0),
      active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id),
      type TEXT NOT NULL CHECK (type IN ('entry', 'exit')),
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      movement_date TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_movements_product ON movements(product_id);
  `)
  return db
}
