const { createClient } = require("@libsql/client");

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

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
  // TAMBAHKAN KOLOM KE DATABASE LAMA
  // ==========================================

  const columns = [
    ["nickname", "TEXT"],
    ["user_id", "TEXT"],
    ["server_id", "TEXT"],
    ["whatsapp", "TEXT"],
    ["note", "TEXT"],
  ];

  for (const [column, type] of columns) {
    try {
      await db.execute(`
        ALTER TABLE orders
        ADD COLUMN ${column} ${type}
      `);

      console.log(`Kolom ${column} berhasil ditambahkan.`);
    } catch (error) {
      // Kalau kolom sudah ada, abaikan error.
      if (
        !error.message ||
        !error.message.toLowerCase().includes("duplicate")
      ) {
        console.log(
          `Kolom ${column} kemungkinan sudah ada.`
        );
      }
    }
  }

  console.log("Turso database siap!");
}

module.exports = {
  db,
  initDatabase,
};