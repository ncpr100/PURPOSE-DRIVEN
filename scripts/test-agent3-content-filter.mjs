/**
 * TEST SCRIPT — Agent 3: Wheat & Chaff Content Filter
 *
 * Calls generateFormationContent() logic directly — bypassing HTTP auth.
 * Agent 3 is a pure DB read (no Claude call); it requires a sermon_ai_analysis
 * record to already exist (Agent 1 must have run on the sermon first).
 *
 * Tests:
 *   A. Happy path   — sermon with existing analysis → returns FormationContent
 *   B. Error path   — sermon with no analysis record → specific actionable error
 *   C. Structure    — validates all fields in socialMediaPost + smallGroupGuide
 *
 * Usage:
 *   node scripts/test-agent3-content-filter.mjs
 *
 * Requirements:
 *   - DATABASE_URL set in .env
 *   - ENABLE_CONTENT_FILTER=true set in .env (forced below)
 *   - At least one sermon in demo-church with a sermon_ai_analysis record
 *     (run test-agent1-antiphony.mjs first if needed)
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
process.env.ENABLE_CONTENT_FILTER = "true";

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
const DISCLAIMER =
  "⚠️ Generado por IA como apoyo ministerial. La decisión pastoral pertenece al pastor.";

// Fixture values that match the known Agent 1 output for "La Importancia del Perdón"
const FIXTURE_COMFORT =
  "Recuerda: perdonar no significa tolerar el abuso o no establecer límites.";
const FIXTURE_TENSION =
  "¿Cómo distinguimos entre un perdón genuino que nos libera y un perdón prematuro que silencia nuestro dolor legítimo, especialmente cuando la iglesia o la familia presionan para 'superar' rápidamente ofensas graves sin espacio para el lamento?";

// ── 4. Replicate generateFormationContent() logic ─────────────────────────────
async function generateFormationContent(sermonId, churchId) {
  if (process.env.ENABLE_CONTENT_FILTER !== "true") {
    throw new Error("Content Filter is not enabled.");
  }

  const analysis = await db.sermon_ai_analysis.findUnique({
    where: { sermonId },
  });

  if (!analysis) {
    throw new Error(
      "Primero debe ejecutar el Análisis Antifonal del sermón. Vaya a la pestaña 'Análisis Ministerial'.",
    );
  }

  const sermon = await db.sermons.findFirst({
    where: { id: sermonId, churchId },
    select: { title: true, scripture: true },
  });

  if (!sermon) {
    throw new Error("Sermón no encontrado.");
  }

  const hashtag = sermon.title?.replace(/\s+/g, "") || "Sermón";

  return {
    socialMediaPost: {
      text: analysis.comfortSentence,
      caption: `"${analysis.comfortSentence}"\n\n¿Te resonó esto? Escucha el sermón completo en el enlace de nuestra biografía.\n\n#${hashtag} #IglesiaViva #Esperanza\n\n${DISCLAIMER}`,
      platforms: ["instagram", "facebook"],
    },
    smallGroupGuide: {
      discussionQuestion: analysis.unresolvedTension,
      followUpQuestions: [
        "¿Cómo vivirían esta tensión de manera diferente esta semana?",
        "¿Qué le impide aplicar esto en su contexto específico?",
        "¿Qué necesitarían de su grupo para vivir en esta tensión juntos?",
      ],
      verseReference: sermon.scripture ?? null,
    },
  };
}

// ── 5. Run tests ──────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
let seededSermonId = null; // track fixture so we can clean up

function pass(label) {
  console.log(`  ✅ PASS: ${label}`);
  passed++;
}
function fail(label, detail = "") {
  console.log(`  ❌ FAIL: ${label}${detail ? ` — ${detail}` : ""}`);
  failed++;
}

try {
  // ── Pre-flight: ensure a sermon_ai_analysis record exists ────────────────────
  console.log("🔍  Pre-flight: checking for sermon_ai_analysis record in demo-church...");
  let existingAnalysis = await db.sermon_ai_analysis.findFirst({
    where: { churchId: TEST_CHURCH_ID },
    select: { sermonId: true, comfortSentence: true, unresolvedTension: true },
  });

  if (!existingAnalysis) {
    // Seed a fixture record against the real demo-church sermon
    console.log("    None found — seeding fixture record from known Agent 1 output...");
    const sermon = await db.sermons.findFirst({
      where: { churchId: TEST_CHURCH_ID },
      select: { id: true },
    });
    if (!sermon) {
      console.error("❌  No sermons found for demo-church — seed data missing.");
      process.exit(1);
    }
    seededSermonId = sermon.id;
    await db.sermon_ai_analysis.upsert({
      where: { sermonId: seededSermonId },
      update: {
        comfortSentence: FIXTURE_COMFORT,
        unresolvedTension: FIXTURE_TENSION,
        culturalMirror: "Test fixture: culturalMirror placeholder.",
        skepticFilter: "Test fixture: skepticFilter placeholder.",
        discomfortSentence: "Test fixture: discomfortSentence placeholder.",
        modelVersion: "test-fixture",
      },
      create: {
        sermonId: seededSermonId,
        churchId: TEST_CHURCH_ID,
        comfortSentence: FIXTURE_COMFORT,
        unresolvedTension: FIXTURE_TENSION,
        culturalMirror: "Test fixture: culturalMirror placeholder.",
        skepticFilter: "Test fixture: skepticFilter placeholder.",
        discomfortSentence: "Test fixture: discomfortSentence placeholder.",
        modelVersion: "test-fixture",
      },
    });
    existingAnalysis = {
      sermonId: seededSermonId,
      comfortSentence: FIXTURE_COMFORT,
      unresolvedTension: FIXTURE_TENSION,
    };
    console.log(`    ✅ Fixture seeded for sermonId: ${seededSermonId}`);
  } else {
    console.log(`    Found existing analysis for sermonId: ${existingAnalysis.sermonId}`);
  }

  const sermonId = existingAnalysis.sermonId;
  console.log(
    `    comfortSentence  : ${existingAnalysis.comfortSentence.slice(0, 80)}...`,
  );
  console.log(
    `    unresolvedTension: ${existingAnalysis.unresolvedTension.slice(0, 80)}...\n`,
  );

  // ── TEST A: Happy path ────────────────────────────────────────────────────────
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST A  Happy path — sermon with existing analysis");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const start = Date.now();
  const content = await generateFormationContent(sermonId, TEST_CHURCH_ID);
  const elapsed = Date.now() - start;

  console.log(`⏱️   Completed in ${elapsed}ms\n`);

  // socialMediaPost checks
  const smp = content?.socialMediaPost;
  if (smp && typeof smp.text === "string" && smp.text.length > 0) {
    pass("socialMediaPost.text is a non-empty string");
  } else {
    fail("socialMediaPost.text is a non-empty string");
  }

  if (smp && typeof smp.caption === "string" && smp.caption.includes(DISCLAIMER)) {
    pass("socialMediaPost.caption contains AI Constitution disclaimer");
  } else {
    fail("socialMediaPost.caption contains AI Constitution disclaimer");
  }

  if (smp && Array.isArray(smp.platforms) && smp.platforms.includes("instagram") && smp.platforms.includes("facebook")) {
    pass("socialMediaPost.platforms includes instagram and facebook");
  } else {
    fail("socialMediaPost.platforms includes instagram and facebook", JSON.stringify(smp?.platforms));
  }

  // text matches comfortSentence from DB
  if (smp && smp.text === existingAnalysis.comfortSentence) {
    pass("socialMediaPost.text matches analysis.comfortSentence");
  } else {
    fail("socialMediaPost.text matches analysis.comfortSentence");
  }

  // smallGroupGuide checks
  const sgg = content?.smallGroupGuide;
  if (sgg && typeof sgg.discussionQuestion === "string" && sgg.discussionQuestion.length > 0) {
    pass("smallGroupGuide.discussionQuestion is a non-empty string");
  } else {
    fail("smallGroupGuide.discussionQuestion is a non-empty string");
  }

  // discussionQuestion matches unresolvedTension from DB
  if (sgg && sgg.discussionQuestion === existingAnalysis.unresolvedTension) {
    pass("smallGroupGuide.discussionQuestion matches analysis.unresolvedTension");
  } else {
    fail("smallGroupGuide.discussionQuestion matches analysis.unresolvedTension");
  }

  if (
    sgg &&
    Array.isArray(sgg.followUpQuestions) &&
    sgg.followUpQuestions.length === 3 &&
    sgg.followUpQuestions.every((q) => typeof q === "string" && q.length > 0)
  ) {
    pass("smallGroupGuide.followUpQuestions has 3 non-empty strings");
  } else {
    fail("smallGroupGuide.followUpQuestions has 3 non-empty strings");
  }

  if (sgg && ("verseReference" in sgg)) {
    pass("smallGroupGuide.verseReference field present (string or null)");
  } else {
    fail("smallGroupGuide.verseReference field present");
  }

  console.log("\n📋  Content preview:");
  console.log(`    Social post text   : ${smp?.text?.slice(0, 100) ?? "—"}`);
  console.log(`    Discussion question: ${sgg?.discussionQuestion?.slice(0, 100) ?? "—"}`);
  console.log(`    Verse reference    : ${sgg?.verseReference ?? "(none)"}`);
  console.log(`    Platforms          : ${smp?.platforms?.join(", ") ?? "—"}`);
  console.log();

  // ── TEST B: Error path — no analysis record ───────────────────────────────────
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST B  Error path — sermon with no analysis record");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const FAKE_SERMON_ID = "non-existent-sermon-id-xyz";
  let caughtError = null;
  try {
    await generateFormationContent(FAKE_SERMON_ID, TEST_CHURCH_ID);
  } catch (e) {
    caughtError = e;
  }

  if (caughtError) {
    pass("Throws when no analysis record found");
  } else {
    fail("Throws when no analysis record found");
  }

  if (caughtError && caughtError.message.includes("Primero debe ejecutar el Análisis Antifonal")) {
    pass("Error message is the actionable 'run Agent 1 first' message");
    console.log(`    Message: ${caughtError.message}\n`);
  } else {
    fail("Error message is the actionable 'run Agent 1 first' message", caughtError?.message ?? "(no error)");
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`RESULT  ${passed} passed  /  ${failed} failed`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (failed > 0) process.exit(1);
} catch (err) {
  console.error("\n💥  Unexpected error:", err.message);
  console.error(err);
  process.exit(1);
} finally {
  // Clean up fixture if we created it
  if (seededSermonId) {
    try {
      await db.sermon_ai_analysis.delete({ where: { sermonId: seededSermonId } });
      console.log(`\n🧹  Cleaned up fixture record for sermonId: ${seededSermonId}`);
    } catch {
      // non-fatal
    }
  }
  await db.$disconnect();
}
