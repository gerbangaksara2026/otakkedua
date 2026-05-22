import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use a data directory to ensure it can be mounted via Docker volumes if needed.
let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'ingetin.db');
    dbInstance = new Database(dbPath);

    dbInstance.pragma('journal_mode = WAL');

    // Initialize schema
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'USER',
        isActive INTEGER NOT NULL DEFAULT 0,
        createdAt INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        text TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        createdAt INTEGER NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
  }
  return dbInstance;
}

/**
 * Ensures that if no users exist, the next registered user will be an ADMIN.
 */
export const isFirstUser = (): boolean => {
  const row = getDb().prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  return row.count === 0;
};

export default getDb; // kept for backward compatibility if needed, but best to use getDb()
