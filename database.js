const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Kalau di hosting (Render), database akan disimpan di /var/data
// Kalau di komputer sendiri, database disimpan di folder backend
const dataDir = process.env.RENDER
  ? "/var/data"
  : __dirname;

// Pastikan folder database tersedia
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "barrstore.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    service TEXT NOT NULL,
    game TEXT NOT NULL,
    nominal TEXT,
    price INTEGER,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log("SQLite database siap!");
console.log("Lokasi database:", dbPath);

module.exports = db;