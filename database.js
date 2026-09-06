const { createClient } = require("@libsql/client");

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDatabase() {
  // ==========================================
  // USERS
  // ==========================================

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ==========================================
  // ORDERS
  // ==========================================

  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      service TEXT NOT NULL,
      game TEXT NOT NULL,
      nominal TEXT,
      price INTEGER,
      nickname TEXT,
      user_id TEXT,
      server_id TEXT,
      whatsapp TEXT,
      note TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ==========================================
  // TAMBAHKAN KOLOM ORDERS LAMA
  // ==========================================

  const orderColumns = [
    ["nickname", "TEXT"],
    ["user_id", "TEXT"],
    ["server_id", "TEXT"],
    ["whatsapp", "TEXT"],
    ["note", "TEXT"],
    ["voucher_code", "TEXT"],
    ["discount", "INTEGER DEFAULT 0"],
  ];

  for (const [column, type] of orderColumns) {
    try {
      await db.execute(`
        ALTER TABLE orders
        ADD COLUMN ${column} ${type}
      `);

      console.log(
        `Kolom ${column} berhasil ditambahkan.`
      );
    } catch (error) {
      const message =
        error.message?.toLowerCase() || "";

      if (
        !message.includes("duplicate") &&
        !message.includes("already exists")
      ) {
        console.log(
          `Kolom ${column} kemungkinan sudah ada.`
        );
      }
    }
  }

  // ==========================================
  // VOUCHERS
  // ==========================================

  await db.execute(`
    CREATE TABLE IF NOT EXISTS vouchers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      value INTEGER NOT NULL,
      max_uses INTEGER,
      used_count INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Turso database siap!");
}

module.exports = {
  db,
  initDatabase,
};