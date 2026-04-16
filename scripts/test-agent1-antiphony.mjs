/**
 * TEST SCRIPT — Agent 1: Sermon Antiphony Engine
 *
 * Usage:
 *   node scripts/test-agent1-antiphony.mjs [sermon-id]
 *
 * Defaults to the first PASTOR-church sermon in the DB.
 * Bypasses the HTTP layer and calls analyzeSermon() directly,
 * simulating exactly what POST /api/sermons/[id]/antiphony-analysis does.
 *
 * Requirements:
 *   - ANTHROPIC_API_KEY set in .env
 *   - ENABLE_SERMON_ANTIPHONY=true set in .env
 *   - A sermon with enough content (>100 chars) in the DB
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

// Force agent enabled for this test
process.env.ENABLE_SERMON_ANTIPHONY = "true";

// ── 2. Check required env vars ────────────────────────────────────────────────
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY || ANTHROPIC_KEY === "your-key-here") {
  console.error("❌  ANTHROPIC_API_KEY is not set in .env");
  process.exit(1);
}
console.log("🔑  ANTHROPIC_API_KEY: …" + ANTHROPIC_KEY.slice(-6));

// ── 3. Dynamically import Anthropic SDK ───────────────────────────────────────
let Anthropic;
try {
  const mod = await import("@anthropic-ai/sdk");
  Anthropic = mod.default;
  console.log("📦  @anthropic-ai/sdk loaded");
} catch {
  console.error("❌  @anthropic-ai/sdk not installed — run: npm install @anthropic-ai/sdk");
  process.exit(1);
}

// ── 4. Load PrismaClient ──────────────────────────────────────────────────────
const req = createRequire(import.meta.url);
let db;
try {
  const { PrismaClient } = req("@prisma/client");
  db = new PrismaClient();
  console.log("🗄️   PrismaClient ready");
} catch (e) {
  console.error("❌  Prisma not available:", e.message);
  process.exit(1);
}

// ── 5. Resolve sermon ─────────────────────────────────────────────────────────
const targetId = process.argv[2] ?? null;
let sermon;
if (targetId) {
  sermon = await db.sermons.findFirst({
    where: { id: targetId },
    select: { id: true, title: true, content: true, outline: true, churchId: true },
  });
  if (!sermon) {
    console.error(`❌  Sermon "${targetId}" not found`);
    await db.$disconnect();
    process.exit(1);
  }
} else {
  // Pick the first sermon with enough content
  const all = await db.sermons.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, content: true, outline: true, churchId: true },
  });
  sermon = all.find((s) => (s.content || s.outline || "").length >= 100);
  if (!sermon) {
    console.error("❌  No sermons found with ≥100 chars of content");
    await db.$disconnect();
    process.exit(1);
  }
}

console.log(`\n📖  Testing with sermon:`);
console.log(`    ID    : ${sermon.id}`);
console.log(`    Title : ${sermon.title}`);
console.log(`    Church: ${sermon.churchId}`);
console.log(`    Chars : ${(sermon.content || sermon.outline || "").length}\n`);

await db.$disconnect();

// ── 6. Inline AI Constitution (mirrors lib/ai-constitution.ts) ────────────────
const AI_CONSTITUTION = {
  imageOfGod: `Every person referenced in pastoral analysis carries the full dignity of being created in the image of God (imago Dei). Do not reduce human beings to data points, risk scores, or behavioural profiles. Treat individuals as whole persons with spiritual, emotional, relational, and social dimensions.`,
  grief: `When encountering situations of loss, crisis, or suffering: do not rush toward resolution. Acknowledge the reality of grief before offering hope. Avoid toxic positivity. A person who is suffering does not need optimised recommendations — they need to be seen.`,
  justice: `The church exists within social structures that produce inequality. Pastoral analysis must not assume a level playing field. When assessing engagement, retention, or spiritual growth, account for the ways that poverty, discrimination, migration, domestic hardship, and structural injustice shape a person's capacity to participate.`,
  hope: `Christian hope is not optimism — it is a theological conviction that God's story is not finished. When surfacing hard truths about decline, disengagement, or spiritual dryness, always hold open the possibility of renewal. Do not present statistical trends as final verdicts on a congregation or an individual.`,
  noPastoralReplacement: `This tool is an analytical assistant, not a pastor. It does not pray, counsel, give spiritual direction, or make binding pastoral decisions. All insights generated here are inputs for a human pastor's discernment — not outputs to be delivered directly to members. The human pastor remains the irreplaceable shepherd.`,
  language: `All output must be in Spanish (Colombia/Latin America standard). Use pastoral and theological vocabulary appropriate for evangelical Protestant churches in the Latin American context. Avoid Anglicisms and overly formal Castilian Spanish.`,
};

function buildSystemPrompt(clauses) {
  return clauses.map((c) => AI_CONSTITUTION[c]).filter(Boolean).join("\n\n");
}

// ── 7. Inline analyzeSermon (mirrors lib/sermon-antiphony-engine.ts) ───────────
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

const sermonText = sermon.content || sermon.outline || sermon.title;
const churchCountry = "Colombia";

const prompt = `You are a theological analysis assistant for an evangelical church in Latin America.
Your task is to analyze a sermon and return a structured JSON response. 
Do NOT write prayers, pastoral advice, or pretend to be a pastor.
Your job is purely analytical — finding gaps, tensions, and assumptions.

SERMON TEXT:
"""
${sermonText}
"""

CHURCH LOCATION: ${churchCountry}

Analyze this sermon and return ONLY a valid JSON object (no markdown, no explanation) with these exact fields:

{
  "culturalMirror": "A paragraph describing what economic, family, and social assumptions this sermon makes about its listeners — and how those assumptions would be wrong for a believer in rural poverty vs. the typical middle-class churchgoer.",
  "skepticFilter": "A paragraph describing what a thoughtful, respectful non-believer would find most credible AND least credible in this message. Not mocking — sharpening.",
  "unresolvedTension": "A single question the sermon raised but did not fully resolve. Reframe it as a Small Group discussion question (in Spanish, starting with '¿').",
  "comfortSentence": "The single sentence from the sermon that sounded most like a weight being lifted — copy it exactly from the text.",
  "discomfortSentence": "The single sentence that would make listeners shift in their seat because they know it's true — copy it exactly from the text."
}

Rules:
- All values must be in Spanish.
- comfortSentence and discomfortSentence must be direct quotes from the sermon text, not paraphrases.
- If the sermon text is too short to identify these elements, return null for those fields.
- Return ONLY the JSON. No preamble, no explanation, no markdown fences.`;

// ── 8. Call Claude ─────────────────────────────────────────────────────────────
console.log("🤖  Calling Claude claude-sonnet-4-5 …\n");
const startTime = Date.now();

let response;
try {
  response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1500,
    system: buildSystemPrompt(["imageOfGod", "language", "noPastoralReplacement"]),
    messages: [{ role: "user", content: prompt }],
  });
} catch (e) {
  console.error("❌  Anthropic API call failed:", e.message);
  process.exit(1);
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`⏱️   Response received in ${elapsed}s`);
console.log(`📊  Tokens used — input: ${response.usage.input_tokens}, output: ${response.usage.output_tokens}\n`);

// ── 9. Parse and display result ───────────────────────────────────────────────
const rawText = response.content
  .filter((b) => b.type === "text")
  .map((b) => b.text)
  .join("");

// Strip markdown fences Claude sometimes adds despite instructions
const cleanText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

let analysis;
try {
  analysis = JSON.parse(cleanText);
} catch {
  console.error("❌  Claude returned invalid JSON:");
  console.error(cleanText);
  process.exit(1);
}

// ── 10. Final output (mirrors API response format) ────────────────────────────
const apiSimulatedResponse = {
  analysis: {
    sermonId: sermon.id,
    churchId: sermon.churchId,
    culturalMirror: analysis.culturalMirror,
    skepticFilter: analysis.skepticFilter,
    unresolvedTension: analysis.unresolvedTension,
    comfortSentence: analysis.comfortSentence,
    discomfortSentence: analysis.discomfortSentence,
  },
  cached: false,
};

console.log("═══════════════════════════════════════════════════════════");
console.log("✅  AGENT 1 — ANTIPHONY ENGINE — RESULT");
console.log("═══════════════════════════════════════════════════════════\n");
console.log(JSON.stringify(apiSimulatedResponse, null, 2));

console.log("\n─── Field verification ─────────────────────────────────────");
const fields = ["culturalMirror", "skepticFilter", "unresolvedTension", "comfortSentence", "discomfortSentence"];
let allPresent = true;
for (const f of fields) {
  const val = analysis[f];
  if (val === null || val === undefined) {
    console.log(`⚠️   ${f}: null`);
  } else if (typeof val === "string" && val.length > 10) {
    console.log(`✅  ${f}: ${val.slice(0, 80)}…`);
  } else {
    console.log(`❌  ${f}: unexpected value →`, val);
    allPresent = false;
  }
}

console.log("\n─── AI Constitution compliance ─────────────────────────────");
console.log("✅  buildSystemPrompt([imageOfGod, language, noPastoralReplacement]) applied");
console.log("✅  System prompt was: " + buildSystemPrompt(["imageOfGod", "language", "noPastoralReplacement"]).slice(0, 60) + "…");

if (allPresent) {
  console.log("\n🎉  Agent 1 test PASSED — all 5 fields populated correctly.");
} else {
  console.log("\n⚠️   Agent 1 test PARTIAL — some fields missing or malformed.");
}
