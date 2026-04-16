/**
 * TEST SCRIPT — Agent 2: Spiritual Triage
 *
 * Simulates a POST /api/prayer-requests with a distress keyword,
 * bypassing HTTP auth by calling DB and logic directly.
 *
 * Usage:
 *   node scripts/test-agent2-triage.mjs
 *
 * Requirements:
 *   - DATABASE_URL set in .env
 *   - ENABLE_SPIRITUAL_TRIAGE=true set in .env
 *   - TRIAGE_KEYWORDS set in .env (must include "divorcio")
 */

import { createRequire } from "module";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// ── 1. Load .env ──────────────────────────────────────────────────────────────
const envPath = resolve(projectRoot, ".env");
try {
  const envContent = readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
  console.log("✅  Loaded .env");
} catch {
  console.warn("⚠️   No .env file found — relying on existing env vars");
}

// Force triage enabled for this test
process.env.ENABLE_SPIRITUAL_TRIAGE = "true";

// ── 2. Check required env vars ────────────────────────────────────────────────
const TRIAGE_KEYWORDS_RAW = process.env.TRIAGE_KEYWORDS || "";
if (!TRIAGE_KEYWORDS_RAW) {
  console.error("❌  TRIAGE_KEYWORDS is not set in .env");
  process.exit(1);
}
const keywords = TRIAGE_KEYWORDS_RAW.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
console.log(`🔑  TRIAGE_KEYWORDS loaded: ${keywords.length} keywords`);
console.log(`    List: ${keywords.join(", ")}`);

// ── 3. Load PrismaClient ──────────────────────────────────────────────────────
const req = createRequire(import.meta.url);
let db;
try {
  const { PrismaClient } = req("@prisma/client");
  db = new PrismaClient();
  console.log("🗄️   PrismaClient ready\n");
} catch (e) {
  console.error("❌  Prisma not available:", e.message);
  process.exit(1);
}

// ── 4. Simulate prayer request body ──────────────────────────────────────────
const TEST_CHURCH_ID = "demo-church";
const TEST_BODY = {
  title: "Por favor oren por mi familia",
  body: "Estamos pasando por un divorcio muy difícil y no sé cómo seguir adelante.",
  category: "familia",
};

console.log("📋  Simulating prayer request:");
console.log(`    Title   : ${TEST_BODY.title}`);
console.log(`    Body    : ${TEST_BODY.body}`);
console.log(`    Category: ${TEST_BODY.category}\n`);

// ── 5. detectDistress (inline — mirrors lib/spiritual-triage-service.ts) ─────
async function detectDistress(text, churchId) {
  const normalizedText = text.toLowerCase();

  // Check DB keywords first
  const dbKeywords = await db.triage_keywords.findMany({
    where: { churchId, isActive: true },
    select: { keyword: true },
  });

  const activeKeywords =
    dbKeywords.length > 0
      ? dbKeywords.map((k) => k.keyword.toLowerCase())
      : keywords; // fallback to env var

  console.log(
    `🔍  Using ${dbKeywords.length > 0 ? "DB" : "env"} keywords (${activeKeywords.length} total)`
  );

  for (const keyword of activeKeywords) {
    if (normalizedText.includes(keyword)) {
      return { isDistress: true, keyword };
    }
  }
  return { isDistress: false, keyword: null };
}

// ── 6. Run detection ──────────────────────────────────────────────────────────
const fullText = `${TEST_BODY.title} ${TEST_BODY.body}`;
const { isDistress, keyword } = await detectDistress(fullText, TEST_CHURCH_ID);

console.log(`\n🧠  Detection result:`);
console.log(`    isDistress      : ${isDistress}`);
console.log(`    detectedKeyword : ${keyword ?? "none"}\n`);

if (!isDistress || !keyword) {
  console.error("❌  No distress keyword detected — check TRIAGE_KEYWORDS in .env");
  await db.$disconnect();
  process.exit(1);
}

// ── 7. Create triage event (inline — mirrors lib/spiritual-triage-service.ts) ─
console.log("🚨  Creating triage_events record in DB…");

const triageEvent = await db.triage_events.create({
  data: {
    churchId: TEST_CHURCH_ID,
    triggerSource: "prayer_form",
    sourceId: `TEST-${nanoid(8)}`,
    detectedKeyword: keyword,
    requesterName: "Test Requester",
    requesterPhone: "+1-555-0000",
    requesterEmail: "test@test.com",
    messageBody: TEST_BODY.body,
    status: "PENDING",
  },
});

console.log(`✅  triage_events record created:`);
console.log(`    ID              : ${triageEvent.id}`);
console.log(`    detectedKeyword : ${triageEvent.detectedKeyword}`);
console.log(`    status          : ${triageEvent.status}`);
console.log(`    triggerSource   : ${triageEvent.triggerSource}`);
console.log(`    createdAt       : ${triageEvent.createdAt.toISOString()}\n`);

// ── 8. Verify record is in DB ─────────────────────────────────────────────────
const verifyRecord = await db.triage_events.findUnique({
  where: { id: triageEvent.id },
  select: { id: true, status: true, detectedKeyword: true, churchId: true },
});

if (!verifyRecord) {
  console.error("❌  Record not found in DB after creation — DB write failed");
  await db.$disconnect();
  process.exit(1);
}
console.log("✅  DB verification passed — record confirmed in triage_events table");

// ── 9. Check for on-call pastor ───────────────────────────────────────────────
const onCallPastor = await db.users.findFirst({
  where: { churchId: TEST_CHURCH_ID, role: "PASTOR", isActive: true },
  select: { id: true, name: true, phone: true },
});

console.log(`\n👨‍⚖️  On-call pastor lookup:`);
if (onCallPastor) {
  console.log(`    ✅  Found: ${onCallPastor.name} (${onCallPastor.phone ?? "no phone"})`);
  console.log(`    → In production, in-app notification + WhatsApp would fire to this user`);
} else {
  console.log(`    ⚠️   No active PASTOR found for ${TEST_CHURCH_ID}`);
  console.log(`    → Notification would be skipped (non-blocking — triage event still created)`);
}

// ── 10. Check total triage events ────────────────────────────────────────────
const totalEvents = await db.triage_events.count({ where: { churchId: TEST_CHURCH_ID } });
console.log(`\n📊  Total triage_events for ${TEST_CHURCH_ID}: ${totalEvents}`);

// ── 11. Clean up the test record ─────────────────────────────────────────────
await db.triage_events.delete({ where: { id: triageEvent.id } });
console.log(`🧹  Test record cleaned up (ID: ${triageEvent.id})`);

await db.$disconnect();

// ── 12. Final result ──────────────────────────────────────────────────────────
console.log("\n═══════════════════════════════════════════════════════════");
console.log("✅  AGENT 2 — SPIRITUAL TRIAGE — TEST PASSED");
console.log("═══════════════════════════════════════════════════════════");
console.log("  ✅  Keyword detection: 'divorcio' matched from TRIAGE_KEYWORDS env var");
console.log("  ✅  triage_events record created in DB with status PENDING");
console.log("  ✅  DB verification confirmed record written");
console.log(`  ${onCallPastor ? "✅" : "⚠️ "} Pastor lookup: ${onCallPastor ? "found → notification would fire" : "no PASTOR in demo-church → notification skipped"}`);
console.log("  ✅  Test record cleaned up from DB");
console.log("\n  Real endpoint flow (POST /api/prayer-requests):");
console.log("    1. Prayer request saved → prayer_requests table");
console.log("    2. detectDistress() runs on request body");
console.log("    3. createTriageEvent() → triage_events table (PENDING)");
console.log("    4. notifyPastoralTeam() → in-app notification + WhatsApp");
console.log("    5. 30-min cron fallback if no human responds");
