const express = require("express");
const cors = require("cors");
const { db, initDatabase } = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());

// =========================
// ADMIN AUTHENTICATION
// =========================
function checkAdmin(req, res, next) {
  const adminKey = req.headers["x-admin-key"];

  if (!process.env.ADMIN_KEY) {
    return res.status(500).json({
      success: false,
      message: "ADMIN_KEY belum diatur di Vercel"
    });
  }

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({
      success: false,
      message: "Password admin salah"
    });
  }

  next();
}

// =========================
// HOME
// =========================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Halo, ini backend BarrStore!"
  });
});

// =========================
// CEK ADMIN KEY
// =========================
app.get("/api/check-admin", (req, res) => {
  res.json({
    adminKeyExists: !!process.env.ADMIN_KEY,
    adminKeyLength: process.env.ADMIN_KEY
      ? process.env.ADMIN_KEY.length
      : 0
  });
});

// =========================
// DATA GAME
// =========================
app.get("/api/games", (req, res) => {
  const games = [
    { id: "ml", name: "Mobile Legends", icon: "⚔️" },
    { id: "ff", name: "Free Fire", icon: "🔥" },
    { id: "pubg", name: "PUBG Mobile", icon: "🎯" },
    { id: "valo", name: "Valorant", icon: "🎮" },
    { id: "genshin", name: "Genshin Impact", icon: "✨" },
    { id: "codm", name: "Call of Duty Mobile", icon: "🪖" },
    { id: "hok", name: "Honor of Kings", icon: "👑" },
    { id: "aov", name: "Arena of Valor", icon: "🏹" }
  ];

  res.json(games);
});

// =========================
// DATA JOKI GAME
// =========================
app.get("/api/joki-games", (req, res) => {
  const jokiGames = [
    {
      id: "ml",
      name: "Mobile Legends",
      ranks: [
        "Warrior",
        "Elite",
        "Master",
        "Epic",
        "Legend",
        "Mythic",
        "Immortal"
      ]
    },
    {
      id: "ff",
      name: "Free Fire",
      ranks: [
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
        "Diamond",
        "Heroic",
        "Elite Heroic",
        "Master",
        "Grandmaster"
      ]
    },
    {
      id: "pubg",
      name: "PUBG Mobile",
      ranks: [
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
        "Diamond",
        "Crown",
        "Ace"
      ]
    },
    {
      id: "valo",
      name: "Valorant",
      ranks: [
        "Iron",
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
        "Diamond",
        "Ascendant",
        "Immortal",
        "Radiant"
      ]
    },
    {
      id: "genshin",
      name: "Genshin Impact",
      ranks: [
        "AR 1-10",
        "AR 11-20",
        "AR 21-30",
        "AR 31-40",
        "AR 41-50",
        "AR 51-60"
      ]
    },
    {
      id: "codm",
      name: "Call of Duty Mobile",
      ranks: [
        "Rookie",
        "Veteran",
        "Elite",
        "Pro",
        "Master",
        "Legendary"
      ]
    },
    {
      id: "hok",
      name: "Honor of Kings",
      ranks: [
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
        "Diamond",
        "Master",
        "King"
      ]
    },
    {
      id: "aov",
      name: "Arena of Valor",
      ranks: [
        "Rookie",
        "Elite",
        "Master",
        "Grandmaster",
        "Legend",
        "King"
      ]
    }
  ];

  res.json(jokiGames);
});

// =========================
// DATA AKUN
// =========================
app.get("/api/akun", (req, res) => {
  const akunList = [
    {
      id: 1,
      game: "Mobile Legends",
      rank: "Mythic 3",
      level: 62,
      price: 349000,
      note: "40+ skin, 12 hero epic."
    },
    {
      id: 2,
      game: "Free Fire",
      rank: "Heroic",
      level: 71,
      price: 299000,
      note: "Bundle langka, 8 karakter max level."
    },
    {
      id: 3,
      game: "Mobile Legends",
      rank: "Legend",
      level: 44,
      price: 189000,
      note: "Cocok pemula, semua hero terbuka."
    },
    {
      id: 4,
      game: "PUBG Mobile",
      rank: "Ace",
      level: 55,
      price: 459000,
      note: "Outfit season 1, RP tier 90+."
    },
    {
      id: 5,
      game: "PUBG Mobile",
      rank: "Crown",
      level: 38,
      price: 259000,
      note: "Cocok naik rank cepat, skin senjata lengkap."
    },
    {
      id: 6,
      game: "Free Fire",
      rank: "Grandmaster",
      level: 65,
      price: 379000,
      note: "Bundle eksklusif, karakter max evolusi."
    },
    {
      id: 7,
      game: "Mobile Legends",
      rank: "Epic",
      level: 35,
      price: 149000,
      note: "Winrate tinggi, akun jarang dipakai."
    },
    {
      id: 8,
      game: "Free Fire",
      rank: "Platinum",
      level: 40,
      price: 179000,
      note: "Skin gun langka, elite pass lengkap."
    },
    {
      id: 9,
      game: "Valorant",
      rank: "Immortal 1",
      level: 140,
      price: 899000,
      note: "15 skin senjata premium, semua agent terbuka."
    },
    {
      id: 10,
      game: "Valorant",
      rank: "Diamond 2",
      level: 78,
      price: 449000,
      note: "Battle pass lengkap, skin Vandal langka."
    },
    {
      id: 11,
      game: "Genshin Impact",
      rank: "AR 58",
      level: 58,
      price: 649000,
      note: "5 karakter 5★ + weapon signature."
    },
    {
      id: 12,
      game: "Genshin Impact",
      rank: "AR 45",
      level: 45,
      price: 349000,
      note: "3 karakter 5★, cocok lanjut progress."
    },
    {
      id: 13,
      game: "Call of Duty Mobile",
      rank: "Legendary",
      level: 90,
      price: 399000,
      note: "Skin senjata mistic lengkap."
    },
    {
      id: 14,
      game: "Honor of Kings",
      rank: "King",
      level: 60,
      price: 379000,
      note: "Hero pool lengkap, skin epic banyak."
    },
    {
      id: 15,
      game: "Arena of Valor",
      rank: "Legend",
      level: 55,
      price: 229000,
      note: "Skin langka, hero pool lengkap."
    }
  ];

  res.json(akunList);
});

// =========================
// USERS - LIHAT USER
// =========================
app.get("/api/users", async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT id, username, created_at
      FROM users
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data user"
    });
  }
});

// =========================
// USERS - REGISTER
// =========================
app.post("/api/users", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi"
      });
    }

    const result = await db.execute({
      sql: `
        INSERT INTO users (username, password)
        VALUES (?, ?)
      `,
      args: [username, password]
    });

    res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      userId: Number(result.lastInsertRowid)
    });

  } catch (error) {
    if (error.message && error.message.includes("UNIQUE")) {
      return res.status(409).json({
        success: false,
        message: "Username sudah digunakan"
      });
    }

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Gagal membuat user",
      error: error.message
    });
  }
});

// =========================
// ORDER - BUAT ORDER
// =========================
app.post("/api/orders", async (req, res) => {
  console.log("=================================");
  console.log("ORDER MASUK");
  console.log("BODY:", req.body);
  console.log("=================================");

  try {
    const {
      username,
      service,
      game,
      nominal,
      price
    } = req.body;

    if (!service || !game) {
      return res.status(400).json({
        success: false,
        message: "Service dan game wajib diisi"
      });
    }

    const result = await db.execute({
      sql: `
        INSERT INTO orders
        (username, service, game, nominal, price)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [
        username || null,
        service,
        game,
        nominal || null,
        Number(price) || 0
      ]
    });

    console.log("ORDER BERHASIL:", result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: "Order berhasil dibuat",
      orderId: Number(result.lastInsertRowid)
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal membuat order",
      error: error.message
    });
  }
});

// =========================
// ADMIN - LIHAT SEMUA ORDER
// =========================
app.get("/api/orders", checkAdmin, async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT *
      FROM orders
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data order"
    });
  }
});

// =========================
// ADMIN - UBAH STATUS ORDER
// =========================
app.patch("/api/orders/:id/status", checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "diproses",
      "selesai",
      "dibatalkan"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid",
        allowedStatus
      });
    }

    const result = await db.execute({
      sql: `
        UPDATE orders
        SET status = ?
        WHERE id = ?
      `,
      args: [status, id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: "Pesanan tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Status pesanan berhasil diperbarui",
      orderId: Number(id),
      status
    });

  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Gagal memperbarui status pesanan",
      error: error.message
    });
  }
});

// =========================
// START SERVER
// =========================
async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server jalan di port ${PORT}`);
    });

  } catch (error) {
    console.error("Gagal menjalankan database:", error);
    process.exit(1);
  }
}

startServer();