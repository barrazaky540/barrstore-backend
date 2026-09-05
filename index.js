const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// =========================
// HOME
// =========================
app.get("/", (req, res) => {
  res.send("Halo, ini backend BarrStore!");
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
app.get("/api/users", (req, res) => {
  try {
    const users = db
      .prepare(`
        SELECT id, username, created_at
        FROM users
        ORDER BY id DESC
      `)
      .all();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data user"
    });
  }
});

// =========================
// USERS - REGISTER
// =========================
app.post("/api/users", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi"
      });
    }

    const result = db
      .prepare(`
        INSERT INTO users (username, password)
        VALUES (?, ?)
      `)
      .run(username, password);

    res.status(201).json({
      message: "User berhasil dibuat",
      userId: result.lastInsertRowid
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        message: "Username sudah digunakan"
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Gagal membuat user"
    });
  }
});

// =========================
// ORDER - BUAT ORDER
// =========================
app.post("/api/orders", (req, res) => {
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
        message: "Service dan game wajib diisi"
      });
    }

    const result = db
      .prepare(`
        INSERT INTO orders
        (username, service, game, nominal, price)
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        username || null,
        service,
        game,
        nominal || null,
        price || 0
      );

    res.status(201).json({
      message: "Order berhasil dibuat",
      orderId: result.lastInsertRowid
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal membuat order"
    });
  }
});

// =========================
// ORDER - LIHAT ORDER
// =========================
app.get("/api/orders", (req, res) => {
  try {
    const orders = db
      .prepare(`
        SELECT *
        FROM orders
        ORDER BY id DESC
      `)
      .all();

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data order"
    });
  }
});

// =========================
// START SERVER
// =========================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server jalan di port ${PORT}`);
});