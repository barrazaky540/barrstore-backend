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

      console.log(`Kolom ${column} berhasil ditambahkan.`);
    } catch (error) {
      const message = error.message?.toLowerCase() || "";

      if (
        !message.includes("duplicate") &&
        !message.includes("already exists")
      ) {
        console.log(`Kolom ${column} kemungkinan sudah ada.`);
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

  // ==========================================
  // WORKERS
  // ==========================================
  // Menyimpan data worker joki.
  //
  // Contoh:
  // id       = 1
  // name     = "Worker Barr"
  // whatsapp = "628xxxxxxxxxx"
  // active   = 1
  //
  // Nomor WhatsApp worker nantinya hanya
  // diberikan ke pelanggan setelah worker
  // ditugaskan oleh admin.
  // ==========================================

  await db.execute(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ==========================================
  // JOKI TICKETS
  // ==========================================
  //
  // Setiap order Joki akan mempunyai 1 tiket.
  //
  // Contoh:
  // ticket_code = BR-JOKI-0001
  //
  // worker_id:
  // NULL = belum ada worker
  //
  // status:
  // menunggu_worker
  // diproses
  // selesai
  // dibatalkan
  //
  // progress:
  // 0 - 100
  // ==========================================

  await db.execute(`
    CREATE TABLE IF NOT EXISTS joki_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_code TEXT NOT NULL UNIQUE,
      order_id INTEGER NOT NULL UNIQUE,
      worker_id INTEGER,
      status TEXT DEFAULT 'menunggu_worker',
      progress INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ==========================================
  // TAMBAHKAN KOLOM TICKETS LAMA
  // ==========================================
  //
  // Bagian ini untuk jaga-jaga kalau nanti
  // tabel sudah pernah dibuat dengan struktur
  // yang berbeda.
  // ==========================================

  const ticketColumns = [
    ["worker_id", "INTEGER"],
    ["status", "TEXT DEFAULT 'menunggu_worker'"],
    ["progress", "INTEGER DEFAULT 0"],
    ["updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP"],
  ];

  for (const [column, type] of ticketColumns) {
    try {
      await db.execute(`
        ALTER TABLE joki_tickets
        ADD COLUMN ${column} ${type}
      `);

      console.log(`Kolom tiket ${column} berhasil ditambahkan.`);
    } catch (error) {
      const message = error.message?.toLowerCase() || "";

      if (
        !message.includes("duplicate") &&
        !message.includes("already exists")
      ) {
        console.log(
          `Kolom tiket ${column} kemungkinan sudah ada.`
        );
      }
    }
  }

  // ==========================================
  // TAMBAHKAN RATING & REVIEW
  // ==========================================

  try {
    await db.execute(`
      ALTER TABLE orders
      ADD COLUMN rating INTEGER
    `);

    console.log("Kolom rating berhasil ditambahkan.");
  } catch (error) {
    const message = error.message?.toLowerCase() || "";

    if (
      !message.includes("duplicate") &&
      !message.includes("already exists")
    ) {
      console.log("Kolom rating kemungkinan sudah ada.");
    }
  }

  try {
    await db.execute(`
      ALTER TABLE orders
      ADD COLUMN review TEXT
    `);

    console.log("Kolom review berhasil ditambahkan.");
  } catch (error) {
    const message = error.message?.toLowerCase() || "";

    if (
      !message.includes("duplicate") &&
      !message.includes("already exists")
    ) {
      console.log("Kolom review kemungkinan sudah ada.");
    }
  }

  // ==========================================
  // SELESAI
  // ==========================================

  console.log("Turso database siap!");
}

module.exports = {
  db,
  initDatabase,
};