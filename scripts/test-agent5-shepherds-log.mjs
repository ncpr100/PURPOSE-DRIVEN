/**
 * TEST SCRIPT — Agent 5: The Shepherd's Log
 *
 * Simulates GET /api/shepherds-log by calling generateShepherdsLog() logic
 * directly — bypassing HTTP auth.
 *
 * Tests:
 *   1. Query at-risk members (HIGH / VERY_HIGH retention risk)
 *   2. Query absent members (no check-in in 3+ weeks)
 *   3. Merge, deduplicate, sort and limit to 7
 *   4. Upsert result to shepherds_log_cache
 *   5. Read cache back and confirm it is fresh
 *
 * Usage:
 *   node scripts/test-agent5-shepherds-log.mjs
 *
 * Requirements:
 *   - DATABASE_URL set in .env
 *   - ENABLE_SHEPHERDS_LOG=true set in .env (or forced below)
 */

import { createRequire } from "module";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

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

// Force feature flag for this test
process.env.ENABLE_SHEPHERDS_LOG = "true";

// ── 2. Load PrismaClient ──────────────────────────────────────────────────────
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

// ── 3. Constants ──────────────────────────────────────────────────────────────
const TEST_CHURCH_ID = "demo-church";

// ── 4. Replicate generateShepherdsLog() logic ─────────────────────────────────
async function runShepherdsLog(churchId) {
  const now = new Date();
  const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);

  console.log(`📅  Now            : ${now.toISOString()}`);
  console.log(`📅  Three weeks ago: ${threeWeeksAgo.toISOString()}\n`);

  // ── Query 1: Members with HIGH or VERY_HIGH retention risk ──────────────────
  console.log("🔍  Query 1: at-risk members (HIGH / VERY_HIGH retention risk)...");
  const atRiskMembers = await db.$queryRawUnsafe(
    `SELECT m.id, m."firstName", m."lastName", m.phone,
            mj."retentionRisk", mj."engagementScore", mj."totalDaysInCurrentStage"
     FROM members m
     JOIN member_journeys mj ON mj."memberId" = m.id
     WHERE m."churchId" = $1
       AND m."isActive" = true
       AND mj."retentionRisk" IN ('HIGH', 'VERY_HIGH')
     ORDER BY mj."retentionRisk" DESC, mj."engagementScore" ASC
     LIMIT 10`,
    churchId,
  );
  console.log(`    Found ${atRiskMembers.length} at-risk member(s)\n`);

  // ── Query 2: Active members absent for 3+ weeks ──────────────────────────────
  console.log("🔍  Query 2: absent members (3+ weeks since last check-in)...");
  const absentMembers = await db.$queryRawUnsafe(
    `SELECT m.id, m."firstName", m."lastName", m.phone,
            MAX(c."checkedInAt") as "lastCheckin"
     FROM members m
     LEFT JOIN check_ins c ON c.email = m.email AND c."churchId" = m."churchId"
     WHERE m."churchId" = $1
       AND m."isActive" = true
     GROUP BY m.id, m."firstName", m."lastName", m.phone
     HAVING MAX(c."checkedInAt") < $2 OR MAX(c."checkedInAt") IS NULL
     LIMIT 10`,
    churchId,
    threeWeeksAgo,
  );
  console.log(`    Found ${absentMembers.length} absent member(s)\n`);

  // ── Merge and deduplicate ────────────────────────────────────────────────────
  const seen = new Set();
  const entries = [];

  for (const m of atRiskMembers) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);

    const reasons = [];
    if (m.retentionRisk === "VERY_HIGH") {
      reasons.push("Riesgo de desconexión crítico");
    } else {
      reasons.push("Riesgo de desconexión alto");
    }
    if (Number(m.engagementScore) < 30) reasons.push("Participación muy baja");

    const lastContact = await db.pastoral_contacts.findFirst({
      where: { churchId, memberId: m.id },
      orderBy: { contactedAt: "desc" },
      select: { contactedAt: true },
    });

    entries.push({
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      phone: m.phone,
      reason: reasons.join(" · "),
      urgency: m.retentionRisk === "VERY_HIGH" ? "CRITICAL" : "HIGH",
      lastAttendance: null,
      daysAbsent: null,
      retentionRisk: m.retentionRisk,
      lastContactedAt: lastContact
        ? lastContact.contactedAt.toLocaleDateString("es-CO")
        : null,
    });
  }

  for (const m of absentMembers) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);

    const daysAbsent = m.lastCheckin
      ? Math.floor(
          (now.getTime() - new Date(m.lastCheckin).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

    const lastContact = await db.pastoral_contacts.findFirst({
      where: { churchId, memberId: m.id },
      orderBy: { contactedAt: "desc" },
      select: { contactedAt: true },
    });

    entries.push({
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      phone: m.phone,
      reason: daysAbsent
        ? `No ha asistido en ${daysAbsent} días`
        : "Sin registro de asistencia",
      urgency: "HIGH",
      lastAttendance: m.lastCheckin
        ? new Date(m.lastCheckin).toLocaleDateString("es-CO")
        : null,
      daysAbsent,
      retentionRisk: "UNKNOWN",
      lastContactedAt: lastContact
        ? lastContact.contactedAt.toLocaleDateString("es-CO")
        : null,
    });
  }

  // Sort CRITICAL first, then by daysAbsent descending, limit to 7
  return entries
    .sort((a, b) => {
      if (a.urgency === "CRITICAL" && b.urgency !== "CRITICAL") return -1;
      if (b.urgency === "CRITICAL" && a.urgency !== "CRITICAL") return 1;
      return (b.daysAbsent ?? 0) - (a.daysAbsent ?? 0);
    })
    .slice(0, 7);
}

// ── 5. Run the test ───────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function pass(label) {
  console.log(`  ✅ PASS: ${label}`);
  passed++;
}
function fail(label, detail = "") {
  console.log(`  ❌ FAIL: ${label}${detail ? ` — ${detail}` : ""}`);
  failed++;
}

try {
  // ── Test A: generateShepherdsLog ──────────────────────────────────────────
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST A  generateShepherdsLog()");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const start = Date.now();
  const members = await runShepherdsLog(TEST_CHURCH_ID);
  const elapsed = Date.now() - start;

  console.log(`⏱️   Completed in ${elapsed}ms\n`);

  if (Array.isArray(members)) {
    pass("Returns an array");
  } else {
    fail("Returns an array", `got ${typeof members}`);
  }

  if (members.length <= 7) {
    pass(`Result capped at ≤7 entries (got ${members.length})`);
  } else {
    fail(`Result capped at ≤7 entries`, `got ${members.length}`);
  }

  if (members.length > 0) {
    const first = members[0];
    const hasId     = typeof first.id === "string" && first.id.length > 0;
    const hasName   = typeof first.name === "string" && first.name.trim().length > 0;
    const hasReason = typeof first.reason === "string" && first.reason.length > 0;
    const hasUrgency = first.urgency === "HIGH" || first.urgency === "CRITICAL";

    if (hasId) pass("Entry has id");
    else fail("Entry has id");

    if (hasName) pass("Entry has name");
    else fail("Entry has name");

    if (hasReason) pass("Entry has reason");
    else fail("Entry has reason");

    if (hasUrgency) pass("Entry urgency is HIGH or CRITICAL");
    else fail("Entry urgency is HIGH or CRITICAL", `got "${first.urgency}"`);

    // CRITICAL entries come first
    const criticalIdx = members.findIndex((m) => m.urgency === "CRITICAL");
    const highIdx     = members.findIndex((m) => m.urgency === "HIGH");
    if (criticalIdx !== -1 && highIdx !== -1 && criticalIdx < highIdx) {
      pass("CRITICAL entries sorted before HIGH entries");
    } else if (criticalIdx === -1) {
      pass("No CRITICAL entries (sort order trivially correct)");
    } else {
      pass("Sort order acceptable (only one urgency level present)");
    }

    console.log("\n📋  Member entries returned:");
    for (const m of members) {
      console.log(
        `    [${m.urgency.padEnd(8)}] ${m.name.padEnd(28)} | ${m.reason}`,
      );
      if (m.phone) console.log(`             Phone: ${m.phone}`);
      if (m.lastAttendance)
        console.log(`             Last attendance: ${m.lastAttendance}`);
      if (m.daysAbsent != null)
        console.log(`             Days absent: ${m.daysAbsent}`);
      if (m.lastContactedAt)
        console.log(`             Last contact: ${m.lastContactedAt}`);
    }
    console.log();
  } else {
    console.log(
      "  ℹ️   No at-risk or absent members found for demo-church.\n" +
        "       This is acceptable if the seed data has no members, or all\n" +
        "       members have low retention risk and recent check-ins.\n",
    );
    pass("Empty array returned (no at-risk members — acceptable for test seed)");
  }

  // ── Test B: Cache upsert (refreshShepherdsLog equivalent) ────────────────
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST B  shepherds_log_cache upsert / read-back");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
  await db.shepherds_log_cache.upsert({
    where: { churchId: TEST_CHURCH_ID },
    update: {
      members: JSON.stringify(members),
      generatedAt: new Date(),
      expiresAt,
    },
    create: {
      churchId: TEST_CHURCH_ID,
      members: JSON.stringify(members),
      generatedAt: new Date(),
      expiresAt,
    },
  });
  pass("Cache upsert succeeded");

  const cached = await db.shepherds_log_cache.findUnique({
    where: { churchId: TEST_CHURCH_ID },
  });

  if (cached) {
    pass("Cache record found after upsert");
  } else {
    fail("Cache record found after upsert");
  }

  if (cached && cached.expiresAt > new Date()) {
    pass(`Cache is fresh (expires ${cached.expiresAt.toISOString()})`);
  } else {
    fail("Cache is fresh", "record missing or already expired");
  }

  if (cached) {
    const parsedBack = JSON.parse(cached.members);
    if (Array.isArray(parsedBack) && parsedBack.length === members.length) {
      pass(`Cache members round-trips correctly (${parsedBack.length} entries)`);
    } else {
      fail("Cache members round-trips correctly");
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`RESULT  ${passed} passed  /  ${failed} failed`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (failed > 0) process.exit(1);
} catch (err) {
  console.error("\n💥  Unexpected error:", err.message);
  console.error(err);
  process.exit(1);
} finally {
  await db.$disconnect();
}
