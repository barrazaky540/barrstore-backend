const express = require("express");
const cors = require("cors");
const { db, initDatabase } = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// ADMIN AUTH
// ==========================================

function checkAdmin(req, res, next) {
  const adminKey = req.headers["x-admin-key"];

  if (!process.env.ADMIN_KEY) {
    return res.status(500).json({
      success: false,
      message: "ADMIN_KEY belum diatur di Vercel",
    });
  }

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({
      success: false,
      message: "Password admin salah",
    });
  }

  next();
}

// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Halo, ini backend BarrStore!",
  });
});

// ==========================================
// CHECK ADMIN
// ==========================================

app.get("/api/check-admin", (req, res) => {
  res.json({
    adminKeyExists: !!process.env.ADMIN_KEY,
    adminKeyLength: process.env.ADMIN_KEY
      ? process.env.ADMIN_KEY.length
      : 0,
  });
});

// ==========================================
// GAMES
// ==========================================

app.get("/api/games", (req, res) => {
  const games = [
    {
      id: "ml",
      name: "Mobile Legends",
      icon: "⚔️",
    },
    {
      id: "ff",
      name: "Free Fire",
      icon: "🔥",
    },
    {
      id: "pubg",
      name: "PUBG Mobile",
      icon: "🎯",
    },
    {
      id: "valo",
      name: "Valorant",
      icon: "🎮",
    },
    {
      id: "genshin",
      name: "Genshin Impact",
      icon: "✨",
    },
    {
      id: "codm",
      name: "Call of Duty Mobile",
      icon: "🪖",
    },
    {
      id: "hok",
      name: "Honor of Kings",
      icon: "👑",
    },
    {
      id: "aov",
      name: "Arena of Valor",
      icon: "🏹",
    },
  ];

  res.json(games);
});

// ==========================================
// JOKI GAMES
// ==========================================

app.get("/api/joki-games", (req, res) => {
  const jokiGames = [
    {
      id: "ml",
      name: "Mobile Legends",
      ranks: [
        "Warrior",
        "Elite",
        "Master",
        "Grandmaster",
        "Epic",
        "Legend",
        "Mythic",
        "Mythical Honor",
        "Mythical Glory",
      ],
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
        "Grandmaster",
      ],
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
        "Ace",
        "Ace Master",
        "Ace Dominator",
      ],
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
        "Radiant",
      ],
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
        "AR 51-55",
        "AR 56-60",
      ],
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
        "Grandmaster",
        "Legendary",
      ],
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
        "Grandmaster",
        "King",
      ],
    },
    {
      id: "aov",
      name: "Arena of Valor",
      ranks: [
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
        "Diamond",
        "Veteran",
        "Master",
        "Conqueror",
      ],
    },
  ];

  res.json(jokiGames);
});

// ==========================================
// AKUN
// ==========================================

app.get("/api/akun", (req, res) => {
  const akunList = [
    {
      id: 1,
      game: "Mobile Legends",
      rank: "Mythic 3",
      level: 62,
      price: 349000,
      note: "40+ skin, 12 hero epic.",
    },
    {
      id: 2,
      game: "Free Fire",
      rank: "Heroic",
      level: 71,
      price: 299000,
      note: "Bundle langka, 8 karakter max level.",
    },
    {
      id: 3,
      game: "Mobile Legends",
      rank: "Legend",
      level: 44,
      price: 189000,
      note: "Cocok pemula, semua hero terbuka.",
    },
    {
      id: 4,
      game: "PUBG Mobile",
      rank: "Ace",
      level: 55,
      price: 459000,
      note: "Outfit season 1, RP tier 90+.",
    },
    {
      id: 5,
      game: "PUBG Mobile",
      rank: "Crown",
      level: 38,
      price: 259000,
      note: "Cocok naik rank cepat, skin senjata lengkap.",
    },
    {
      id: 6,
      game: "Free Fire",
      rank: "Grandmaster",
      level: 65,
      price: 379000,
      note: "Bundle eksklusif, karakter max evolusi.",
    },
    {
      id: 7,
      game: "Mobile Legends",
      rank: "Epic",
      level: 35,
      price: 149000,
      note: "Winrate tinggi, akun jarang dipakai.",
    },
    {
      id: 8,
      game: "Free Fire",
      rank: "Platinum",
      level: 40,
      price: 179000,
      note: "Skin gun langka, elite pass lengkap.",
    },
    {
      id: 9,
      game: "Valorant",
      rank: "Immortal 1",
      level: 140,
      price: 899000,
      note: "15 skin senjata premium, semua agent terbuka.",
    },
    {
      id: 10,
      game: "Valorant",
      rank: "Diamond 2",
      level: 78,
      price: 449000,
      note: "Battle pass lengkap, skin Vandal langka.",
    },
    {
      id: 11,
      game: "Genshin Impact",
      rank: "AR 58",
      level: 58,
      price: 649000,
      note: "5 karakter 5★ + weapon signature.",
    },
    {
      id: 12,
      game: "Genshin Impact",
      rank: "AR 45",
      level: 45,
      price: 349000,
      note: "3 karakter 5★, cocok lanjut progress.",
    },
    {
      id: 13,
      game: "Call of Duty Mobile",
      rank: "Legendary",
      level: 90,
      price: 399000,
      note: "Skin senjata mistic lengkap.",
    },
    {
      id: 14,
      game: "Honor of Kings",
      rank: "King",
      level: 60,
      price: 379000,
      note: "Hero pool lengkap, skin epic banyak.",
    },
    {
      id: 15,
      game: "Arena of Valor",
      rank: "Legend",
      level: 55,
      price: 229000,
      note: "Skin langka, hero pool lengkap.",
    },
  ];

  res.json(akunList);
});

// ==========================================
// USERS
// ==========================================

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
      message: "Gagal mengambil data user",
    });
  }
});

// ==========================================
// REGISTER USER
// ==========================================

app.post("/api/users", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi",
      });
    }

    const result = await db.execute({
      sql: `
        INSERT INTO users (username, password)
        VALUES (?, ?)
      `,
      args: [username.trim(), password],
    });

    res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      userId: Number(result.lastInsertRowid),
    });
  } catch (error) {
    if (
      error.message &&
      error.message.includes("UNIQUE")
    ) {
      return res.status(409).json({
        success: false,
        message: "Username sudah digunakan",
      });
    }

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Gagal membuat user",
      error: error.message,
    });
  }
});

// ==========================================
// LOGIN USER
// ==========================================

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi",
      });
    }

    const result = await db.execute({
      sql: `
        SELECT id, username, created_at
        FROM users
        WHERE username = ? AND password = ?
        LIMIT 1
      `,
      args: [username.trim(), password],
    });

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: Number(user.id),
        username: user.username,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Gagal melakukan login",
    });
  }
});

// ==========================================
// VOUCHER - CHECK USER
// ==========================================

app.post("/api/vouchers/check", async (req, res) => {
  try {
    const { code, price } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Kode voucher wajib diisi",
      });
    }

    const originalPrice = Number(price);

    if (
      !Number.isFinite(originalPrice) ||
      originalPrice <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Harga tidak valid",
      });
    }

    const voucherCode = String(code)
      .trim()
      .toUpperCase();

    const result = await db.execute({
      sql: `
        SELECT *
        FROM vouchers
        WHERE code = ?
        LIMIT 1
      `,
      args: [voucherCode],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kode voucher tidak ditemukan",
      });
    }

    const voucher = result.rows[0];

    if (Number(voucher.active) !== 1) {
      return res.status(400).json({
        success: false,
        message: "Voucher sudah tidak aktif",
      });
    }

    if (
      voucher.max_uses !== null &&
      voucher.max_uses !== undefined &&
      Number(voucher.used_count) >=
        Number(voucher.max_uses)
    ) {
      return res.status(400).json({
        success: false,
        message: "Kuota voucher sudah habis",
      });
    }

    if (voucher.expires_at) {
      const expiry = new Date(
        voucher.expires_at
      );

      if (
        !Number.isNaN(expiry.getTime()) &&
        expiry.getTime() <= Date.now()
      ) {
        return res.status(400).json({
          success: false,
          message: "Voucher sudah kedaluwarsa",
        });
      }
    }

    let discount = 0;

    if (voucher.type === "percent") {
      discount = Math.floor(
        originalPrice *
          (Number(voucher.value) / 100)
      );
    } else if (voucher.type === "nominal") {
      discount = Number(voucher.value);
    }

    discount = Math.max(
      0,
      Math.min(discount, originalPrice)
    );

    const finalPrice =
      originalPrice - discount;

    res.json({
      success: true,
      voucher: {
        id: Number(voucher.id),
        code: voucher.code,
        type: voucher.type,
        value: Number(voucher.value),
      },
      originalPrice,
      discount,
      finalPrice,
    });
  } catch (error) {
    console.error(
      "CHECK VOUCHER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Gagal memeriksa voucher",
    });
  }
});

// ==========================================
// VOUCHER - ADMIN GET
// ==========================================

app.get(
  "/api/admin/vouchers",
  checkAdmin,
  async (req, res) => {
    try {
      const result = await db.execute(`
        SELECT
          id,
          code,
          type,
          value,
          max_uses,
          used_count,
          active,
          expires_at,
          created_at
        FROM vouchers
        ORDER BY id DESC
      `);

      res.json({
        success: true,
        vouchers: result.rows,
      });
    } catch (error) {
      console.error(
        "GET VOUCHERS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Gagal mengambil voucher",
      });
    }
  }
);

// ==========================================
// VOUCHER - ADMIN CREATE
// ==========================================

app.post(
  "/api/admin/vouchers",
  checkAdmin,
  async (req, res) => {
    try {
      let {
        code,
        type,
        value,
        maxUses,
        expiresAt,
      } = req.body;

      code = String(code || "")
        .trim()
        .toUpperCase();

      type = String(type || "")
        .trim()
        .toLowerCase();

      value = Number(value);

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Kode voucher wajib diisi",
        });
      }

      if (!["percent", "nominal"].includes(type)) {
        return res.status(400).json({
          success: false,
          message:
            "Tipe voucher harus percent atau nominal",
        });
      }

      if (
        !Number.isInteger(value) ||
        value <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Nilai voucher tidak valid",
        });
      }

      if (
        type === "percent" &&
        value > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Diskon persentase maksimal 100%",
        });
      }

      let parsedMaxUses = null;

      if (
        maxUses !== null &&
        maxUses !== undefined &&
        maxUses !== ""
      ) {
        parsedMaxUses = Number(maxUses);

        if (
          !Number.isInteger(parsedMaxUses) ||
          parsedMaxUses <= 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Batas penggunaan voucher tidak valid",
          });
        }
      }

      let parsedExpiresAt = null;

      if (expiresAt) {
        const expiry = new Date(expiresAt);

        if (Number.isNaN(expiry.getTime())) {
          return res.status(400).json({
            success: false,
            message:
              "Tanggal kedaluwarsa tidak valid",
          });
        }

        parsedExpiresAt = expiry.toISOString();
      }

      const result = await db.execute({
        sql: `
          INSERT INTO vouchers
          (
            code,
            type,
            value,
            max_uses,
            used_count,
            active,
            expires_at
          )
          VALUES (?, ?, ?, ?, 0, 1, ?)
        `,
        args: [
          code,
          type,
          value,
          parsedMaxUses,
          parsedExpiresAt,
        ],
      });

      res.status(201).json({
        success: true,
        message: "Voucher berhasil dibuat",
        voucherId: Number(
          result.lastInsertRowid
        ),
      });
    } catch (error) {
      if (
        error.message &&
        error.message.toLowerCase().includes("unique")
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Kode voucher sudah digunakan",
        });
      }

      console.error(
        "CREATE VOUCHER ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Gagal membuat voucher",
        error: error.message,
      });
    }
  }
);

// ==========================================
// VOUCHER - ADMIN ACTIVE / NONACTIVE
// ==========================================

app.patch(
  "/api/admin/vouchers/:id",
  checkAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { active } = req.body;

      const activeValue =
        active === true || active === 1
          ? 1
          : 0;

      const result = await db.execute({
        sql: `
          UPDATE vouchers
          SET active = ?
          WHERE id = ?
        `,
        args: [activeValue, id],
      });

      if (result.rowsAffected === 0) {
        return res.status(404).json({
          success: false,
          message: "Voucher tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message: activeValue
          ? "Voucher berhasil diaktifkan"
          : "Voucher berhasil dinonaktifkan",
        active: Boolean(activeValue),
      });
    } catch (error) {
      console.error(
        "UPDATE VOUCHER ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Gagal mengubah status voucher",
      });
    }
  }
);

// ==========================================
// CREATE ORDER
// ==========================================

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
      price,
      nickname,
      userId,
      serverId,
      whatsapp,
      note,
      voucherCode,
    } = req.body;

    if (!service || !game) {
      return res.status(400).json({
        success: false,
        message: "Service dan game wajib diisi",
      });
    }

    const originalPrice = Number(price);

    if (
      !Number.isFinite(originalPrice) ||
      originalPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Harga tidak valid",
      });
    }

    let finalPrice = originalPrice;
    let discount = 0;
    let appliedVoucherCode = null;

    // ==========================================
    // VALIDASI VOUCHER
    // ==========================================

    if (voucherCode) {
      const normalizedVoucherCode =
        String(voucherCode)
          .trim()
          .toUpperCase();

      const voucherResult = await db.execute({
        sql: `
          SELECT *
          FROM vouchers
          WHERE code = ?
          LIMIT 1
        `,
        args: [normalizedVoucherCode],
      });

      if (voucherResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "Kode voucher tidak ditemukan",
        });
      }

      const voucher =
        voucherResult.rows[0];

      if (Number(voucher.active) !== 1) {
        return res.status(400).json({
          success: false,
          message:
            "Voucher sudah tidak aktif",
        });
      }

      if (
        voucher.max_uses !== null &&
        voucher.max_uses !== undefined &&
        Number(voucher.used_count) >=
          Number(voucher.max_uses)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Kuota voucher sudah habis",
        });
      }

      if (voucher.expires_at) {
        const expiry = new Date(
          voucher.expires_at
        );

        if (
          !Number.isNaN(expiry.getTime()) &&
          expiry.getTime() <= Date.now()
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Voucher sudah kedaluwarsa",
          });
        }
      }

      if (voucher.type === "percent") {
        discount = Math.floor(
          originalPrice *
            (Number(voucher.value) / 100)
        );
      } else if (
        voucher.type === "nominal"
      ) {
        discount = Number(voucher.value);
      }

      discount = Math.max(
        0,
        Math.min(
          discount,
          originalPrice
        )
      );

      finalPrice =
        originalPrice - discount;

      appliedVoucherCode =
        voucher.code;

      // Tambahkan jumlah pemakaian
      await db.execute({
        sql: `
          UPDATE vouchers
          SET used_count = used_count + 1
          WHERE id = ?
        `,
        args: [voucher.id],
      });
    }

    // ==========================================
    // SIMPAN ORDER
    // ==========================================

    const result = await db.execute({
      sql: `
        INSERT INTO orders
        (
          username,
          service,
          game,
          nominal,
          price,
          nickname,
          user_id,
          server_id,
          whatsapp,
          note,
          voucher_code,
          discount
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        username || null,
        service,
        game,
        nominal || null,
        finalPrice,
        nickname || null,
        userId || null,
        serverId || null,
        whatsapp || null,
        note || null,
        appliedVoucherCode,
        discount,
      ],
    });

    const orderId = Number(
      result.lastInsertRowid
    );

    console.log(
      "ORDER BERHASIL:",
      orderId
    );

    return res.status(201).json({
      success: true,
      message: "Order berhasil dibuat",
      orderId,
      originalPrice,
      discount,
      finalPrice,
      voucherCode: appliedVoucherCode,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal membuat order",
      error: error.message,
    });
  }
});

// ==========================================
// RIWAYAT PESANAN USER
// ==========================================

app.get(
  "/api/users/:username/orders",
  async (req, res) => {
    try {
      const { username } = req.params;

      const result = await db.execute({
        sql: `
          SELECT
            id,
            username,
            service,
            game,
            nominal,
            price,
            nickname,
            user_id,
            server_id,
            whatsapp,
            note,
            voucher_code,
            discount,
            status,
            created_at
          FROM orders
          WHERE username = ?
          ORDER BY id DESC
        `,
        args: [username],
      });

      res.json({
        success: true,
        orders: result.rows,
      });
    } catch (error) {
      console.error(
        "USER ORDERS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Gagal mengambil riwayat pesanan",
      });
    }
  }
);

// ==========================================
// ADMIN STATISTICS
// ==========================================

app.get(
  "/api/admin/stats",
  checkAdmin,
  async (req, res) => {
    try {
      const totalOrders = await db.execute(`
        SELECT COUNT(*) AS total
        FROM orders
      `);

      const totalUsers = await db.execute(`
        SELECT COUNT(*) AS total
        FROM users
      `);

      const totalOmzet = await db.execute(`
        SELECT COALESCE(SUM(price), 0) AS total
        FROM orders
        WHERE status = 'selesai'
      `);

      const pending = await db.execute(`
        SELECT COUNT(*) AS total
        FROM orders
        WHERE status = 'pending'
      `);

      const diproses = await db.execute(`
        SELECT COUNT(*) AS total
        FROM orders
        WHERE status = 'diproses'
      `);

      const selesai = await db.execute(`
        SELECT COUNT(*) AS total
        FROM orders
        WHERE status = 'selesai'
      `);

      const dibatalkan = await db.execute(`
        SELECT COUNT(*) AS total
        FROM orders
        WHERE status = 'dibatalkan'
      `);

      res.json({
        success: true,
        stats: {
          totalOrders: Number(
            totalOrders.rows[0].total
          ),
          totalUsers: Number(
            totalUsers.rows[0].total
          ),
          totalOmzet: Number(
            totalOmzet.rows[0].total
          ),
          pending: Number(
            pending.rows[0].total
          ),
          diproses: Number(
            diproses.rows[0].total
          ),
          selesai: Number(
            selesai.rows[0].total
          ),
          dibatalkan: Number(
            dibatalkan.rows[0].total
          ),
        },
      });
    } catch (error) {
      console.error(
        "ADMIN STATS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Gagal mengambil statistik admin",
      });
    }
  }
);

// ==========================================
// GET ORDERS ADMIN
// ==========================================

app.get(
  "/api/orders",
  checkAdmin,
  async (req, res) => {
    try {
      const result = await db.execute(`
        SELECT *
        FROM orders
        ORDER BY id DESC
      `);

      res.json(result.rows);
    } catch (error) {
      console.error(
        "GET ORDERS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Gagal mengambil data order",
      });
    }
  }
);

// ==========================================
// UPDATE STATUS ORDER
// ==========================================

app.patch(
  "/api/orders/:id/status",
  checkAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatus = [
        "pending",
        "diproses",
        "selesai",
        "dibatalkan",
      ];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status tidak valid",
          allowedStatus,
        });
      }

      const result = await db.execute({
        sql: `
          UPDATE orders
          SET status = ?
          WHERE id = ?
        `,
        args: [status, id],
      });

      if (result.rowsAffected === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Pesanan tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message:
          "Status pesanan berhasil diperbarui",
        orderId: Number(id),
        status,
      });
    } catch (error) {
      console.error(
        "UPDATE STATUS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Gagal memperbarui status pesanan",
        error: error.message,
      });
    }
  }
);

// ==========================================
// START SERVER
// ==========================================

async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server jalan di port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Gagal menjalankan database:",
      error
    );

    process.exit(1);
  }
}

startServer();