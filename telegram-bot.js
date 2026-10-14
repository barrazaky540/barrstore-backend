
require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TELEGRAM_BOT_TOKEN;
const barrStoreApiUrl = (
  process.env.BARRSTORE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

if (!token) {
  console.error("TELEGRAM_BOT_TOKEN belum diatur di file .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log("=================================");
console.log("BarrConnect v4 sedang aktif!");
console.log("Telegram Bot siap menerima pesan");
console.log("=================================");

// ==================================================
// HELPER
// ==================================================

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[?!.,;:()[\]{}"'`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function randomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

async function reply(chatId, messageText) {
  try {
    await bot.sendMessage(chatId, messageText);
  } catch (error) {
    console.error("Gagal mengirim pesan:", error.message);
  }
}

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function hasWord(text, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("(^|\\s)" + escaped + "(\\s|$)", "i").test(text);
}

function capitalize(text) {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ==================================================
// GAME
// ==================================================

const games = {
  ml: "Mobile Legends",
  ff: "Free Fire",
  pubg: "PUBG Mobile",
  valo: "Valorant",
  genshin: "Genshin Impact",
  codm: "Call of Duty Mobile",
  hok: "Honor of Kings",
  aov: "Arena of Valor",
};

function detectGame(text) {
  const t = normalizeText(text);

  if (
    t.includes("mobile legends") ||
    t.includes("mobile legend") ||
    t.includes("mlbb") ||
    t.includes("diamond ml") ||
    t.includes("dm ml") ||
    hasWord(t, "ml")
  ) return games.ml;

  if (
    t.includes("free fire") ||
    t.includes("freefire") ||
    t.includes("ff max") ||
    t.includes("diamond ff") ||
    t.includes("dm ff") ||
    hasWord(t, "ff")
  ) return games.ff;

  if (
    t.includes("pubg mobile") ||
    t.includes("pubgm") ||
    t.includes("uc pubg") ||
    hasWord(t, "pubg")
  ) return games.pubg;

  if (
    t.includes("valorant") ||
    t.includes("vp valorant") ||
    t.includes("vp valo") ||
    hasWord(t, "valo")
  ) return games.valo;

  if (
    t.includes("genshin impact") ||
    t.includes("genshin") ||
    t.includes("gensin") ||
    t.includes("genhin") ||
    t.includes("genhsin")
  ) return games.genshin;

  if (
    t.includes("call of duty mobile") ||
    t.includes("call of duty") ||
    t.includes("cod mobile") ||
    hasWord(t, "codm")
  ) return games.codm;

  if (
    t.includes("honor of kings") ||
    t.includes("honor kings") ||
    hasWord(t, "hok")
  ) return games.hok;

  if (
    t.includes("arena of valor") ||
    t.includes("arena valor") ||
    hasWord(t, "aov")
  ) return games.aov;

  return null;
}

// ==================================================
// MEMORY CHAT
// ==================================================

const chatMemory = new Map();
const trackingSessions = new Map();

function getMemory(chatId) {
  if (!chatMemory.has(chatId)) {
    chatMemory.set(chatId, {
      game: null,
      intent: null,
      currentRank: null,
      targetRank: null,
    });
  }
  return chatMemory.get(chatId);
}

function saveMemory(chatId, data) {
  chatMemory.set(chatId, {
    ...getMemory(chatId),
    ...data,
  });
}

function resetMemory(chatId) {
  chatMemory.delete(chatId);
}

function isTrackingRequest(text) {
  return hasAny(normalizeText(text), [
    "cek pesanan",
    "lacak pesanan",
    "status pesanan",
    "cek order",
    "lacak order",
    "pesanan saya",
    "cek transaksi",
    "lacak transaksi",
  ]);
}

// ==================================================
// DETEKSI INTENT
// ==================================================

function detectIntent(text) {
  const t = normalizeText(text);

  if (hasAny(t, [
    "joki",
    "jokikan",
    "jokiin",
    "push rank",
    "pushrank",
    "push ranked",
    "push ranking",
    "naikin rank",
    "naikin ranked",
    "naikin ranking",
    "naik rank",
    "naik ranked",
    "naik ranking",
    "bantu naik rank",
    "bantu push rank",
    "rank up",
    "rankup",
  ])) return "joki";

  if (hasAny(t, [
    "top up",
    "topup",
    "top-up",
    "isi diamond",
    "isi dm",
    "beli diamond",
    "beli dm",
    "isi uc",
    "beli uc",
    "isi vp",
    "beli vp",
    "isi cp",
    "beli cp",
    "isi token",
    "beli token",
    "isi voucher",
    "beli voucher",
    "mau topup",
    "mau top up",
  ])) return "topup";

  if (hasAny(t, [
    "jual akun",
    "beli akun",
    "jual beli akun",
    "akun game",
    "cari akun",
    "cari acc",
    "mau akun",
    "butuh akun",
    "nyari akun",
    "cari account",
    "beli account",
    "jual account",
  ])) return "akun";

  if (hasAny(t, [
    "voucher",
    "promo",
    "diskon",
    "kode promo",
    "kode voucher",
    "potongan harga",
  ])) return "voucher";

  if (hasAny(t, [
    "cara order",
    "cara pesan",
    "cara beli",
    "cara transaksi",
    "gimana order",
    "bagaimana order",
    "pesan gimana",
    "order gimana",
    "cara pesen",
    "gimana pesen",
  ])) return "order";

  if (
    hasAny(t, [
      "hubungi admin",
      "kontak admin",
      "contact admin",
      "chat admin",
      "mau chat admin",
      "minta admin",
      "customer service",
    ]) ||
    hasWord(t, "admin") ||
    hasWord(t, "cs")
  ) return "admin";

  return null;
}

// ==================================================
// DETEKSI RANK
// ==================================================

const rankList = [
  "mythical immortal",
  "mythical glory",
  "grandmaster",
  "challenger",
  "conqueror",
  "ascendant",
  "immortal",
  "radiant",
  "platinum",
  "diamond",
  "master",
  "heroic",
  "legend",
  "mythic",
  "epic",
  "gold",
  "silver",
  "bronze",
  "crown",
  "ace",
  "pro",
  "supreme",
  "elite",
  "warrior",
  "iron",
];

function findRankInText(text) {
  const t = normalizeText(text);
  return rankList.find((rank) => t.includes(rank)) || null;
}

function detectRanks(text) {
  const t = normalizeText(text);
  const found = rankList.filter((rank) => t.includes(rank));

  let currentRank = null;
  let targetRank = null;

  const patterns = [
    /dari (.+?) ke (.+)/,
    /(.+?) ke (.+)/,
    /dari (.+?) sampai (.+)/,
    /(.+?) sampai (.+)/,
    /dari (.+?) menuju (.+)/,
    /(.+?) menuju (.+)/,
    /(.+?)\s*->\s*(.+)/,
  ];

  for (const pattern of patterns) {
    const match = t.match(pattern);
    if (!match) continue;

    const first = findRankInText(match[1]);
    const second = findRankInText(match[2]);

    if (first && second) {
      currentRank = first;
      targetRank = second;
      break;
    }
  }

  if (!currentRank && found.length >= 2) {
    currentRank = found[0];
    targetRank = found[1];
  } else if (!currentRank && found.length === 1) {
    currentRank = found[0];
  }

  return { currentRank, targetRank, all: found };
}

// ==================================================
// JAWABAN BOT
// ==================================================

const greetings = [
  "Halo kak 👋 Ada yang bisa gue bantu?",
  "Hai kak! Ada yang mau ditanyain?",
  "Halo! Gas, mau bahas apa?",
  "Hai kak 👋 Butuh bantuan apa?",
];

const thanksResponses = [
  "Sama-sama kak!",
  "Siap kak, sama-sama!",
  "Santai kak 😄",
  "Siap, kalau butuh bantuan lagi tinggal chat.",
];

function topupGeneralResponse() {
  return (
    "Bisa kak.\n\n" +
    "BarrStore menyediakan Top Up untuk:\n" +
    "• Mobile Legends\n" +
    "• Free Fire\n" +
    "• PUBG Mobile\n" +
    "• Valorant\n" +
    "• Genshin Impact\n" +
    "• Call of Duty Mobile\n" +
    "• Honor of Kings\n" +
    "• Arena of Valor\n\n" +
    "Tinggal sebut game dan nominalnya."
  );
}

function topupResponse(chatId, game) {
  if (!game) return topupGeneralResponse();

  saveMemory(chatId, { game, intent: "topup" });

  const details = {
    [games.ml]: "User ID, Server / Zone ID, dan nominal Diamond.",
    [games.ff]: "ID akun dan jumlah Diamond.",
    [games.pubg]: "ID akun dan jumlah UC.",
    [games.valo]: "Riot ID dan jumlah VP.",
    [games.genshin]: "UID dan nominal Genesis Crystal.",
    [games.codm]: "ID akun dan jumlah CP.",
    [games.hok]: "ID akun dan nominal Token.",
    [games.aov]: "ID akun dan nominal Voucher.",
  };

  return (
    `Top Up ${game}\n\n` +
    "Bisa kak!\n\n" +
    `Siapkan ${details[game] || "data akun dan nominal yang kamu mau"}\n\n` +
    `Contoh: Top Up ${game}.`
  );
}

function jokiResponse(chatId, game, text) {
  const ranks = detectRanks(text);
  const memory = getMemory(chatId);

  const currentRank = ranks.currentRank || memory.currentRank;
  const targetRank = ranks.targetRank || memory.targetRank;
  const finalGame = game || memory.game;

  saveMemory(chatId, {
    game: finalGame,
    intent: "joki",
    currentRank,
    targetRank,
  });

  if (!finalGame) {
    return (
      "Bisa kak, layanan joki tersedia.\n\n" +
      "Sebutkan game-nya ya.\n\n" +
      "Contoh: Joki ML, FF, PUBG, Valorant, Genshin, CODM, HOK, atau AOV."
    );
  }

  if (finalGame === games.genshin) {
    return (
      "Joki Genshin Impact\n\n" +
      "Bisa kak! Sebutkan progres atau jasa yang kamu butuhkan.\n\n" +
      "Contoh: Adventure Rank, farming material, atau quest."
    );
  }

  if (currentRank && targetRank) {
    return (
      `Joki ${finalGame}\n\n` +
      `Rank sekarang: ${capitalize(currentRank)}\n` +
      `Rank tujuan: ${capitalize(targetRank)}\n\n` +
      "Detailnya sudah gue tangkep. Silakan lanjut proses order di BarrStore."
    );
  }

  if (currentRank) {
    return (
      `Joki ${finalGame}\n\n` +
      `Rank sekarang: ${capitalize(currentRank)}\n\n` +
      "Tinggal kasih tahu rank tujuan kamu."
    );
  }

  return (
    `Joki ${finalGame}\n\n` +
    "Bisa kak! Rank sekarang dan rank tujuan kamu berapa?"
  );
}

function akunResponse(chatId, game) {
  if (game) {
    saveMemory(chatId, { game, intent: "akun" });

    return (
      `Cari Akun ${game}\n\n` +
      "Bisa kak! Kasih tahu budget dan kriteria akun yang kamu cari.\n\n" +
      `Contoh: Cari akun ${game} budget 300 ribu.`
    );
  }

  return (
    "Bisa kak!\n\n" +
    "BarrStore menyediakan jual beli akun game.\n\n" +
    "Sebutkan game, budget, dan kriteria akun yang kamu cari."
  );
}

function gameInfoResponse(game) {
  return (
    `${game} tersedia di BarrStore.\n\n` +
    "Kamu bisa bilang:\n" +
    `• Joki ${game}\n` +
    `• Top Up ${game}\n` +
    `• Cari akun ${game}`
  );
}

// ==================================================
// LACAK PESANAN
// ==================================================

async function trackOrder(chatId, orderId, whatsappLast4) {
  const response = await fetch(`${barrStoreApiUrl}/api/orders/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, whatsappLast4 }),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Respons backend bukan JSON yang valid.");
  }

  if (!response.ok || !data.success || !data.order) {
    return {
      success: false,
      message:
        "❌ Pesanan tidak ditemukan atau data verifikasi tidak cocok.\n\n" +
        "Periksa kembali ID pesanan dan 4 digit terakhir nomor WhatsApp kamu.\n" +
        "Ketik `cek pesanan saya` untuk mencoba lagi.",
    };
  }

  const order = data.order;

  const statusLabels = {
    pending: "⏳ Menunggu diproses",
    diproses: "🔄 Sedang diproses",
    selesai: "✅ Selesai",
    dibatalkan: "❌ Dibatalkan",
  };

  const status = String(order.status || "").toLowerCase();
  const statusText = statusLabels[status] || status || "Belum diketahui";

  const priceText = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(order.price || 0));

  return {
    success: true,
    message:
      "📦 STATUS PESANAN BARRSTORE\n\n" +
      `ID Pesanan: #${order.id}\n` +
      `Layanan: ${order.service || "-"}\n` +
      `Game: ${order.game || "-"}\n` +
      `Nominal: ${order.nominal || "-"}\n` +
      `Harga: ${priceText}\n` +
      `Status: ${statusText}\n\n` +
      "Ketik `cek pesanan saya` untuk melacak pesanan lain.",
  };
}

// ==================================================
// MESSAGE HANDLER
// ==================================================

bot.on("message", async function (msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name || "User";
  const firstName = msg.from.first_name || "kak";
  const rawText = msg.text || "";
  const text = normalizeText(rawText);

  console.log(`Pesan dari ${username}: ${text}`);

  if (!text) return;

  // START
  if (text === "/start") {
    resetMemory(chatId);
    trackingSessions.delete(chatId);

    await reply(
      chatId,
      `Halo ${firstName} 👋\n\n` +
      "Gue BarrConnect.\n" +
      "Ada yang bisa gue bantu?\n\n" +
      "Ketik `cek pesanan saya` untuk melacak pesanan BarrStore."
    );
    return;
  }

  // RESET
  if (
    text === "/reset" ||
    text === "reset" ||
    text === "lupakan" ||
    text === "ganti game"
  ) {
    resetMemory(chatId);
    trackingSessions.delete(chatId);

    await reply(chatId, "Siap kak, konteks sebelumnya gue hapus.");
    return;
  }

  // ==================================================
  // LACAK PESANAN: MULAI ATAU LANJUTKAN SESI
  // ==================================================

  if (isTrackingRequest(text)) {
    trackingSessions.set(chatId, { step: "orderId" });

    await reply(
      chatId,
      "🔎 Lacak Pesanan BarrStore\n\n" +
      "Kirim ID pesanan kamu terlebih dahulu.\n\n" +
      "Contoh: 123"
    );
    return;
  }

  const trackingSession = trackingSessions.get(chatId);

  if (trackingSession) {
    if (trackingSession.step === "orderId") {
      const match = rawText.trim().match(/^#?\s*(\d+)\s*$/);

      if (!match || Number(match[1]) <= 0) {
        await reply(
          chatId,
          "ID pesanan belum valid, kak. Kirim angka ID pesanan saja ya."
        );
        return;
      }

      trackingSessions.set(chatId, {
        step: "whatsappLast4",
        orderId: Number(match[1]),
      });

      await reply(
        chatId,
        "Oke kak! Sekarang kirim 4 digit terakhir nomor WhatsApp yang dipakai saat order."
      );
      return;
    }

    if (trackingSession.step === "whatsappLast4") {
      const last4 = rawText.replace(/\D/g, "");

      if (!/^\d{4}$/.test(last4)) {
        await reply(
          chatId,
          "Masukkan tepat 4 digit terakhir nomor WhatsApp ya, kak."
        );
        return;
      }

      trackingSessions.delete(chatId);

      try {
        const result = await trackOrder(
          chatId,
          trackingSession.orderId,
          last4
        );

        await reply(chatId, result.message);
      } catch (error) {
        console.error("Gagal melacak pesanan:", error.message);

        await reply(
          chatId,
          "⚠️ BarrConnect belum bisa terhubung ke backend BarrStore.\n\n" +
          "Pastikan backend berjalan dan BARRSTORE_API_URL di file .env sudah benar."
        );
      }

      return;
    }
  }

  // GREETING
  if ([
    "p",
    "pp",
    "ping",
    "halo",
    "hai",
    "hi",
    "hello",
    "permisi",
    "assalamualaikum",
    "assalamu alaikum",
  ].includes(text)) {
    await reply(chatId, randomResponse(greetings));
    return;
  }

  // THANKS
  if (hasAny(text, [
    "makasih",
    "terima kasih",
    "thanks",
    "thank you",
    "thx",
  ])) {
    await reply(chatId, randomResponse(thanksResponses));
    return;
  }

  const detectedGame = detectGame(text);
  const detectedIntent = detectIntent(text);

  if (detectedGame) {
    saveMemory(chatId, { game: detectedGame });
  }

  if (detectedIntent) {
    saveMemory(chatId, { intent: detectedIntent });
  }

  const memory = getMemory(chatId);

  // ADMIN
  if (detectedIntent === "admin") {
    await reply(
      chatId,
      "Siap kak. Kalau ada masalah dengan pesanan atau pembayaran, ceritakan masalahnya ke gue dulu."
    );
    return;
  }

  // VOUCHER
  if (detectedIntent === "voucher") {
    await reply(
      chatId,
      "Untuk voucher atau promo BarrStore, kirim kode voucher kalau mau dicek.\n\n" +
      "Kalau mau tanya promo, tinggal bilang aja."
    );
    return;
  }

  // ORDER
  if (detectedIntent === "order") {
    await reply(
      chatId,
      "Cara order di BarrStore:\n\n" +
      "1. Pilih layanan\n" +
      "2. Pilih game\n" +
      "3. Pilih nominal atau tujuan\n" +
      "4. Isi data\n" +
      "5. Selesaikan pembayaran\n" +
      "6. Pesanan diproses\n\n" +
      "Untuk melihat status pesanan, ketik `cek pesanan saya`."
    );
    return;
  }

  // JOKI
  if (detectedIntent === "joki") {
    await reply(
      chatId,
      jokiResponse(chatId, detectedGame || memory.game, text)
    );
    return;
  }

  // TOP UP
  if (detectedIntent === "topup") {
    await reply(
      chatId,
      topupResponse(chatId, detectedGame || memory.game)
    );
    return;
  }

  // AKUN
  if (detectedIntent === "akun") {
    await reply(
      chatId,
      akunResponse(chatId, detectedGame || memory.game)
    );
    return;
  }

  // KALIMAT LANJUTAN JOKI
  const ranks = detectRanks(text);

  if (
    memory.intent === "joki" &&
    memory.game &&
    ranks.all.length > 0
  ) {
    await reply(chatId, jokiResponse(chatId, memory.game, text));
    return;
  }

  // KALIMAT LANJUTAN TOP UP
  if (
    memory.intent === "topup" &&
    memory.game &&
    hasAny(text, ["diamond", "dm", "uc", "vp", "cp", "token", "voucher"])
  ) {
    await reply(chatId, topupResponse(chatId, memory.game));
    return;
  }

  // USER CUMA MENYEBUT GAME
  if (detectedGame) {
    await reply(chatId, gameInfoResponse(detectedGame));
    return;
  }

  // DEFAULT
  await reply(
    chatId,
    "Gue belum nangkep maksudnya kak 😅\n\n" +
    "Coba ngomong santai aja.\n\n" +
    "Contoh:\n" +
    "• joki ff gold ke heroic\n" +
    "• top up ml 86 diamond\n" +
    "• cari akun pubg\n" +
    "• ada promo gak\n" +
    "• cek pesanan saya"
  );
});

// ==================================================
// TELEGRAM ERROR
// ==================================================

bot.on("polling_error", function (error) {
  console.error("Telegram polling error:", error.message);
});
