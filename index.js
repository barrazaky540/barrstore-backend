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
// HELPER
// ==========================================

function makeTicketCode(orderId) {
  return `BR-JOKI-${String(orderId).padStart(4, "0")}`;
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
  res.json([
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
  ]);
});

// ==========================================
// JOKI GAMES
// ==========================================

app.get("/api/joki-games", (req, res) => {
  res.json([
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
  ]);
});

// ==========================================
// AKUN
// ==========================================

app.get("/api/akun", (req, res) => {
  res.json([
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
  ]);
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
// REGISTER
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

    const cleanUsername = username.trim();

    const result = await db.execute({
      sql: `
        INSERT INTO users (username, password)
        VALUES (?, ?)
      `,
      args: [cleanUsername, password],
    });

    res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      userId: Number(result.lastInsertRowid),
    });
  } catch (error) {
    if (
      error.message &&
      error.message.toLowerCase().includes("unique")
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
// LOGIN
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
// VOUCHER CHECK
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
      Number(voucher.used_count) >= Number(voucher.max_uses)
    ) {
      return res.status(400).json({
        success: false,
        message: "Kuota voucher sudah habis",
      });
    }

    if (voucher.expires_at) {
      const expiry = new Date(voucher.expires_at);

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
        originalPrice * (Number(voucher.value) / 100)
      );
    } else if (voucher.type === "nominal") {
      discount = Number(voucher.value);
    }

    discount = Math.max(
      0,
      Math.min(discount, originalPrice)
    );

    const finalPrice = originalPrice - discount;

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
    console.error("CHECK VOUCHER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Gagal memeriksa voucher",
    });
  }
});

// ==========================================
// ADMIN VOUCHERS
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
      console.error("GET VOUCHERS ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Gagal mengambil voucher",
      });
    }
  }
);

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

      if (!Number.isInteger(value) || value <= 0) {
        return res.status(400).json({
          success: false,
          message: "Nilai voucher tidak valid",
        });
      }

      if (type === "percent" && value > 100) {
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
        voucherId: Number(result.lastInsertRowid),
      });
    } catch (error) {
      if (
        error.message &&
        error.message.toLowerCase().includes("unique")
      ) {
        return res.status(409).json({
          success: false,
          message: "Kode voucher sudah digunakan",
        });
      }

      console.error("CREATE VOUCHER ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Gagal membuat voucher",
        error: error.message,
      });
    }
  }
);

app.patch(
  "/api/admin/vouchers/:id",
  checkAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { active } = req.body;

      const activeValue =
        active === true || active === 1 ? 1 : 0;

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
      console.error("UPDATE VOUCHER ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Gagal mengubah status voucher",
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
          message: "Kode voucher tidak ditemukan",
        });
      }

      const voucher = voucherResult.rows[0];

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
        const expiry = new Date(voucher.expires_at);

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

      finalPrice = originalPrice - discount;
      appliedVoucherCode = voucher.code;

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

    const orderId = Number(result.lastInsertRowid);

    // ==========================================
    // BUAT TIKET JOKI OTOMATIS
    // ==========================================

    let ticket = null;

    if (service === "joki") {
      const ticketCode = makeTicketCode(orderId);

      const ticketResult = await db.execute({
        sql: `
          INSERT INTO joki_tickets
          (
            ticket_code,
            order_id,
            worker_id,
            status,
            progress
          )
          VALUES (?, ?, NULL, 'menunggu_worker', 0)
        `,
        args: [ticketCode, orderId],
      });

      ticket = {
        id: Number(ticketResult.lastInsertRowid),
        ticketCode,
        status: "menunggu_worker",
        progress: 0,
        worker: null,
      };
    }

    console.log("ORDER BERHASIL:", orderId);

    return res.status(201).json({
      success: true,
      message: "Order berhasil dibuat",
      orderId,
      originalPrice,
      discount,
      finalPrice,
      voucherCode: appliedVoucherCode,
      ticket,
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
            o.id,
            o.username,
            o.service,
            o.game,
            o.nominal,
            o.price,
            o.nickname,
            o.user_id,
            o.server_id,
            o.whatsapp,
            o.note,
            o.voucher_code,
            o.discount,
            o.status,
            o.rating,
            o.review,
            o.created_at,

            jt.id AS ticket_id,
            jt.ticket_code,
            jt.status AS ticket_status,
            jt.progress AS ticket_progress,
            jt.worker_id,

            w.name AS worker_name,
            w.whatsapp AS worker_whatsapp

          FROM orders o

          LEFT JOIN joki_tickets jt
            ON jt.order_id = o.id

          LEFT JOIN workers w
            ON w.id = jt.worker_id

          WHERE o.username = ?

          ORDER BY o.id DESC
        `,
        args: [username],
      });

      res.json({
        success: true,
        orders: result.rows,
      });
    } catch (error) {
      console.error("USER ORDERS ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Gagal mengambil riwayat pesanan",
      });
    }
  }
);

// ==========================================
// USER JOKI TICKETS
// ==========================================

app.get(
  "/api/users/:username/joki-tickets",
  async (req, res) => {
    try {
      const { username } = req.params;

      const result = await db.execute({
        sql: `
          SELECT
            jt.id,
            jt.ticket_code,
            jt.order_id,
            jt.status,
            jt.progress,
            jt.created_at,
            jt.updated_at,

            o.game,
            o.nominal,
            o.nickname,
            o.whatsapp AS customer_whatsapp,

            w.name AS worker_name,
            w.whatsapp AS worker_whatsapp

          FROM joki_tickets jt

          INNER JOIN orders o
            ON o.id = jt.order_id

          LEFT JOIN workers w
            ON w.id = jt.worker_id

          WHERE o.username = ?

          ORDER BY jt.id DESC
        `,
        args: [username],
      });

      res.json({
        success: true,
        tickets: result.rows,
      });
    } catch (error) {
      console.error("USER TICKETS ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Gagal mengambil tiket Joki",
      });
    }
  }
);

// ==========================================
// REVIEWS
// ==========================================

app.get("/api/reviews", async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT
        id,
        username,
        game,
        service,
        rating,
        review,
        created_at
      FROM orders
      WHERE rating IS NOT NULL
      ORDER BY id DESC
    `);

    const reviews = result.rows;

    let averageRating = 0;

    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (total, item) =>
          total + Number(item.rating || 0),
        0
      );

      averageRating =
        Math.round(
          (totalRating / reviews.length) * 10
        ) / 10;
    }

    res.json({
      success: true,
      averageRating,
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil ulasan",
    });
  }
});

app.post(
  "/api/orders/:id/review",
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        username,
        rating,
        review,
      } = req.body;

      if (!username) {
        return res.status(400).json({
          success: false,
          message: "Username wajib diisi",
        });
      }

      const ratingValue = Number(rating);

      if (
        !Number.isInteger(ratingValue) ||
        ratingValue < 1 ||
        ratingValue > 5
      ) {
        return res.status(400).json({
          success: false,
          message: "Rating harus antara 1 sampai 5",
        });
      }

      const orderResult = await db.execute({
        sql: `
          SELECT
            id,
            username,
            status,
            rating
          FROM orders
          WHERE id = ?
          LIMIT 1
        `,
        args: [id],
      });

      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pesanan tidak ditemukan",
        });
      }

      const order = orderResult.rows[0];

      if (
        String(order.username) !==
        String(username)
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Pesanan ini bukan milik akun tersebut",
        });
      }

      if (order.status !== "selesai") {
        return res.status(400).json({
          success: false,
          message:
            "Rating hanya bisa diberikan setelah pesanan selesai",
        });
      }

      if (order.rating !== null) {
        return res.status(400).json({
          success: false,
          message:
            "Pesanan ini sudah diberi rating",
        });
      }

      const cleanReview =
        String(review || "").trim();

      if (cleanReview.length > 500) {
        return res.status(400).json({
          success: false,
          message:
            "Ulasan maksimal 500 karakter",
        });
      }

      await db.execute({
        sql: `
          UPDATE orders
          SET
            rating = ?,
            review = ?
          WHERE id = ?
        `,
        args: [
          ratingValue,
          cleanReview || null,
          id,
        ],
      });

      res.json({
        success: true,
        message:
          "Rating dan ulasan berhasil disimpan",
        orderId: Number(id),
        rating: ratingValue,
        review: cleanReview,
      });
    } catch (error) {
      console.error("SUBMIT REVIEW ERROR:", error);

      res.status(500).json({
        success: false,
        message:
          "Gagal menyimpan rating dan ulasan",
        error: error.message,
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
      console.error("ADMIN STATS ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Gagal mengambil statistik admin",
      });
    }
  }
);

// ==========================================
// ADMIN GET ORDERS
// ==========================================

app.get(
  "/api/orders",
  checkAdmin,
  async (req, res) => {
    try {
      const result = await db.execute(`
        SELECT
          o.*,
          jt.id AS ticket_id,
          jt.ticket_code,
          jt.status AS ticket_status,
          jt.progress AS ticket_progress,
          jt.worker_id,
          w.name AS worker_name,
          w.whatsapp AS worker_whatsapp
        FROM orders o
        LEFT JOIN joki_tickets jt
          ON jt.order_id = o.id
        LEFT JOIN workers w
          ON w.id = jt.worker_id
        ORDER BY o.id DESC
      `);

      res.json(result.rows);
    } catch (error) {
      console.error("GET ORDERS ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Gagal mengambil data order",
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
          message: "Pesanan tidak ditemukan",
        });
      }

      // Sinkronkan tiket Joki jika ada
      if (status === "selesai") {
        await db.execute({
          sql: `
            UPDATE joki_tickets
            SET
              status = 'selesai',
              progress = 100,
              updated_at = CURRENT_TIMESTAMP
            WHERE order_id = ?
          `,
          args: [id],
        });
      }

      if (status === "dibatalkan") {
        await db.execute({
          sql: `
            UPDATE joki_tickets
            SET
              status = 'dibatalkan',
              updated_at = CURRENT_TIMESTAMP
            WHERE order_id = ?
          `,
          args: [id],
        });
      }

      if (status === "diproses") {
        await db.execute({
          sql: `
            UPDATE joki_tickets
            SET
              status = 'diproses',
              updated_at = CURRENT_TIMESTAMP
            WHERE order_id = ?
          `,
          args: [id],
        });
      }

      res.json({
        success: true,
        message: "Status pesanan berhasil diperbarui",
        orderId: Number(id),
        status,
      });
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);

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
// ADMIN - GET WORKERS
// ==========================================

app.get(
  "/api/admin/workers",
  checkAdmin,
  async (req, res) => {
    try {
      const result = await db.execute(`
        SELECT
          id,
          name,
          whatsapp,
          active,
          created_at
        FROM workers
        ORDER BY id DESC
      `);

      res.json({
        success: true,
        workers: result.rows,
      });
    } catch (error) {
      console.error("GET WORKERS ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Gagal mengambil data worker",
      });
    }
  }
);

// ==========================================
// ADMIN - CREATE WORKER
// ==========================================

app.post(
  "/api/admin/workers",
  checkAdmin,
  async (req, res) => {
    try {
      let { name, whatsapp } = req.body;

      name = String(name || "").trim();
      whatsapp = String(whatsapp || "")
        .replace(/\D/g, "");

      if (!name || !whatsapp) {
        return res.status(400).json({
          success: false,
          message:
            "Nama dan nomor WhatsApp wajib diisi",
        });
      }

      // Kalau nomor dimasukkan 08xxxx
      // otomatis diubah menjadi 628xxxx
      if (whatsapp.startsWith("8")) {
        whatsapp = `62${whatsapp}`;
      }

      const result = await db.execute({
        sql: `
          INSERT INTO workers
          (
            name,
            whatsapp,
            active
          )
          VALUES (?, ?, 1)
        `,
        args: [name, whatsapp],
      });

      res.status(201).json({
        success: true,
        message: "Worker berhasil ditambahkan",
        workerId: Number(result.lastInsertRowid),
      });
    } catch (error) {
      console.error("CREATE WORKER ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Gagal menambahkan worker",
        error: error.message,
      });
    }
  }
);

// ==========================================
// ADMIN - UPDATE WORKER
// ==========================================

app.patch(
  "/api/admin/workers/:id",
  checkAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      let { name, whatsapp, active } = req.body;

      const existing = await db.execute({
        sql: `
          SELECT *
          FROM workers
          WHERE id = ?
          LIMIT 1
        `,
        args: [id],
      });

      if (existing.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Worker tidak ditemukan",
        });
      }

      const worker = existing.rows[0];

      const newName =
        name !== undefined
          ? String(name).trim()
          : worker.name;

      let newWhatsapp =
        whatsapp !== undefined
          ? String(whatsapp).replace(/\D/g, "")
          : worker.whatsapp;

      if (newWhatsapp.startsWith("8")) {
        newWhatsapp = `62${newWhatsapp}`;
      }

      const newActive =
        active === undefined
          ? Number(worker.active)
          : active === true || active === 1
            ? 1
            : 0;

      if (!newName || !newWhatsapp) {
        return res.status(400).json({
          success: false,
          message:
            "Nama dan nomor WhatsApp wajib diisi",
        });
      }

      await db.execute({
        sql: `
          UPDATE workers
          SET
            name = ?,
            whatsapp = ?,
            active = ?
          WHERE id = ?
        `,
        args: [
          newName,
          newWhatsapp,
          newActive,
          id,
        ],
      });

      res.json({
        success: true,
        message: "Worker berhasil diperbarui",
      });
    } catch (error) {
      console.error("UPDATE WORKER ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Gagal memperbarui worker",
        error: error.message,
      });
    }
  }
);

// ==========================================
// ADMIN - GET JOKI TICKETS
// ==========================================

app.get(
  "/api/admin/joki-tickets",
  checkAdmin,
  async (req, res) => {
    try {
      const result = await db.execute(`
        SELECT
          jt.id,
          jt.ticket_code,
          jt.order_id,
          jt.worker_id,
          jt.status,
          jt.progress,
          jt.created_at,
          jt.updated_at,

          o.username,
          o.game,
          o.nominal,
          o.price,
          o.nickname,
          o.user_id,
          o.server_id,
          o.whatsapp AS customer_whatsapp,
          o.note,
          o.created_at AS order_created_at,

          w.name AS worker_name,
          w.whatsapp AS worker_whatsapp

        FROM joki_tickets jt

        INNER JOIN orders o
          ON o.id = jt.order_id

        LEFT JOIN workers w
          ON w.id = jt.worker_id

        ORDER BY jt.id DESC
      `);

      res.json({
        success: true,
        tickets: result.rows,
      });
    } catch (error) {
      console.error(
        "GET JOKI TICKETS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Gagal mengambil tiket Joki",
      });
    }
  }
);

// ==========================================
// ADMIN - ASSIGN WORKER
// ==========================================

app.patch(
  "/api/admin/joki-tickets/:id/assign",
  checkAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { workerId } = req.body;

      if (!workerId) {
        return res.status(400).json({
          success: false,
          message: "Worker wajib dipilih",
        });
      }

      const workerResult = await db.execute({
        sql: `
          SELECT
            id,
            name,
            whatsapp,
            active
          FROM workers
          WHERE id = ?
          LIMIT 1
        `,
        args: [workerId],
      });

      if (workerResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Worker tidak ditemukan",
        });
      }

      const worker = workerResult.rows[0];

      if (Number(worker.active) !== 1) {
        return res.status(400).json({
          success: false,
          message: "Worker sedang tidak aktif",
        });
      }

      const ticketResult = await db.execute({
        sql: `
          SELECT
            id,
            order_id,
            status
          FROM joki_tickets
          WHERE id = ?
          LIMIT 1
        `,
        args: [id],
      });

      if (ticketResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tiket Joki tidak ditemukan",
        });
      }

      const ticket = ticketResult.rows[0];

      if (
        ticket.status === "selesai" ||
        ticket.status === "dibatalkan"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Tiket yang sudah selesai/dibatalkan tidak bisa ditugaskan lagi",
        });
      }

      await db.execute({
        sql: `
          UPDATE joki_tickets
          SET
            worker_id = ?,
            status = 'diproses',
            progress = CASE
              WHEN progress < 1 THEN 1
              ELSE progress
            END,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [workerId, id],
      });

      await db.execute({
        sql: `
          UPDATE orders
          SET status = 'diproses'
          WHERE id = ?
        `,
        args: [ticket.order_id],
      });

      res.json({
        success: true,
        message: "Worker berhasil ditugaskan",
        ticketId: Number(id),
        worker: {
          id: Number(worker.id),
          name: worker.name,
          whatsapp: worker.whatsapp,
        },
      });
    } catch (error) {
      console.error(
        "ASSIGN WORKER ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Gagal menugaskan worker",
        error: error.message,
      });
    }
  }
);

// ==========================================
// ADMIN - UPDATE TICKET STATUS
// ==========================================

app.patch(
  "/api/admin/joki-tickets/:id/status",
  checkAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatus = [
        "menunggu_worker",
        "diproses",
        "selesai",
        "dibatalkan",
      ];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status tiket tidak valid",
          allowedStatus,
        });
      }

      const ticketResult = await db.execute({
        sql: `
          SELECT order_id
          FROM joki_tickets
          WHERE id = ?
          LIMIT 1
        `,
        args: [id],
      });

      if (ticketResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tiket tidak ditemukan",
        });
      }

      const orderId =
        ticketResult.rows[0].order_id;

      let progress = null;

      if (status === "selesai") {
        progress = 100;
      }

      if (status === "menunggu_worker") {
        progress = 0;
      }

      if (progress === null) {
        await db.execute({
          sql: `
            UPDATE joki_tickets
            SET
              status = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          args: [status, id],
        });
      } else {
        await db.execute({
          sql: `
            UPDATE joki_tickets
            SET
              status = ?,
              progress = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          args: [status, progress, id],
        });
      }

      let orderStatus = "pending";

      if (status === "diproses") {
        orderStatus = "diproses";
      }

      if (status === "selesai") {
        orderStatus = "selesai";
      }

      if (status === "dibatalkan") {
        orderStatus = "dibatalkan";
      }

      if (status === "menunggu_worker") {
        orderStatus = "pending";
      }

      await db.execute({
        sql: `
          UPDATE orders
          SET status = ?
          WHERE id = ?
        `,
        args: [orderStatus, orderId],
      });

      res.json({
        success: true,
        message:
          "Status tiket berhasil diperbarui",
        ticketId: Number(id),
        status,
        orderStatus,
      });
    } catch (error) {
      console.error(
        "UPDATE TICKET STATUS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Gagal memperbarui status tiket",
        error: error.message,
      });
    }
  }
);

// ==========================================
// ADMIN - UPDATE TICKET PROGRESS
// ==========================================

app.patch(
  "/api/admin/joki-tickets/:id/progress",
  checkAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const progress = Number(req.body.progress);

      if (
        !Number.isInteger(progress) ||
        progress < 0 ||
        progress > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Progress harus berupa angka 0 sampai 100",
        });
      }

      const ticketResult = await db.execute({
        sql: `
          SELECT order_id
          FROM joki_tickets
          WHERE id = ?
          LIMIT 1
        `,
        args: [id],
      });

      if (ticketResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tiket tidak ditemukan",
        });
      }

      let ticketStatus = "diproses";

      if (progress === 0) {
        ticketStatus = "menunggu_worker";
      }

      if (progress === 100) {
        ticketStatus = "selesai";
      }

      await db.execute({
        sql: `
          UPDATE joki_tickets
          SET
            progress = ?,
            status = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [progress, ticketStatus, id],
      });

      let orderStatus = "diproses";

      if (progress === 100) {
        orderStatus = "selesai";
      }

      if (progress === 0) {
        orderStatus = "pending";
      }

      await db.execute({
        sql: `
          UPDATE orders
          SET status = ?
          WHERE id = ?
        `,
        args: [
          orderStatus,
          ticketResult.rows[0].order_id,
        ],
      });

      res.json({
        success: true,
        message: "Progress tiket berhasil diperbarui",
        ticketId: Number(id),
        progress,
        status: ticketStatus,
      });
    } catch (error) {
      console.error(
        "UPDATE TICKET PROGRESS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Gagal memperbarui progress tiket",
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

    // ==========================================
    // RATING
    // ==========================================

    try {
      await db.execute(`
        ALTER TABLE orders
        ADD COLUMN rating INTEGER
      `);
    } catch (error) {
      const message =
        error.message?.toLowerCase() || "";

      if (
        !message.includes("duplicate") &&
        !message.includes("already exists")
      ) {
        console.error(
          "GAGAL TAMBAH KOLOM RATING:",
          error.message
        );
      }
    }

    // ==========================================
    // REVIEW
    // ==========================================

    try {
      await db.execute(`
        ALTER TABLE orders
        ADD COLUMN review TEXT
      `);
    } catch (error) {
      const message =
        error.message?.toLowerCase() || "";

      if (
        !message.includes("duplicate") &&
        !message.includes("already exists")
      ) {
        console.error(
          "GAGAL TAMBAH KOLOM REVIEW:",
          error.message
        );
      }
    }

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