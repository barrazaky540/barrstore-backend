require("dotenv").config();

const { createClient } = require("@libsql/client");

// ==========================================
// CEK ENV TURSO
// ==========================================

if (!process.env.TURSO_DATABASE_URL) {
  console.error("ERROR: TURSO_DATABASE_URL belum diatur.");
}

if (!process.env.TURSO_AUTH_TOKEN) {
  console.error("ERROR: TURSO_AUTH_TOKEN belum diatur.");
}

// ==========================================
// KONEKSI TURSO
// ==========================================

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ==========================================
// INIT DATABASE
// ==========================================

async function initDatabase() {
  console.log("Menghubungkan ke Turso...");

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

  console.log("Tabel users siap.");

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
      voucher_code TEXT,
      discount INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      rating INTEGER,
      review TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Tabel orders siap.");

  // ==========================================
  // MIGRASI KOLOM ORDERS
  // Untuk database lama
  // ==========================================

  const orderColumns = [
    ["username", "TEXT"],
    ["service", "TEXT"],
    ["game", "TEXT"],
    ["nominal", "TEXT"],
    ["price", "INTEGER"],
    ["nickname", "TEXT"],
    ["user_id", "TEXT"],
    ["server_id", "TEXT"],
    ["whatsapp", "TEXT"],
    ["note", "TEXT"],
    ["voucher_code", "TEXT"],
    ["discount", "INTEGER DEFAULT 0"],
    ["status", "TEXT DEFAULT 'pending'"],
    ["rating", "INTEGER"],
    ["review", "TEXT"],
  ];

  for (const [column, type] of orderColumns) {
    try {
      await db.execute(`
        ALTER TABLE orders
        ADD COLUMN ${column} ${type}
      `);

      console.log(`Kolom ${column} berhasil ditambahkan.`);
    } catch (error) {
      const message = String(error.message || "").toLowerCase();

      // Kalau kolom memang sudah ada, abaikan.
      if (
        message.includes("duplicate") ||
        message.includes("already exists") ||
        message.includes("duplicate column")
      ) {
        continue;
      }

      console.log(
        `Kolom ${column} tidak ditambahkan: ${error.message}`
      );
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

  console.log("Tabel vouchers siap.");

  // ==========================================
  // CEK ULANG DATABASE
  // ==========================================

  try {
    await db.execute(`SELECT 1 FROM users LIMIT 1`);
    await db.execute(`SELECT 1 FROM orders LIMIT 1`);
    await db.execute(`SELECT 1 FROM vouchers LIMIT 1`);

    console.log("=================================");
    console.log("TURSO DATABASE SIAP!");
    console.log("=================================");
  } catch (error) {
    console.error("Gagal mengecek tabel database:");
    console.error(error);
    throw error;
  }
}

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  db,
  initDatabase,
};
