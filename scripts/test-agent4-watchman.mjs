/**
 * TEST SCRIPT — Agent 4: Prayer Watchman Event Extractor
 *
 * Usage:
 *   node scripts/test-agent4-watchman.mjs
 *
 * Requirements:
 *   - ANTHROPIC_API_KEY set in .env
 *   - ENABLE_PRAYER_WATCHMAN=true set in .env
 */

import Anthropic from "@anthropic-ai/sdk";
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
process.env.ENABLE_PRAYER_WATCHMAN = "true";

// ── 2. Check API key ──────────────────────────────────────────────────────────
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY || ANTHROPIC_KEY === "your-key-here") {
  console.error("❌  ANTHROPIC_API_KEY is not set in .env");
  process.exit(1);
}
console.log("🔑  ANTHROPIC_API_KEY: …" + ANTHROPIC_KEY.slice(-6));

// ── 3. Inline AI Constitution (mirrors lib/ai-constitution.ts) ────────────────
const AI_CONSTITUTION = {
  imageOfGod: `Every person referenced in pastoral analysis carries the full dignity of being created in the image of God (imago Dei). Do not reduce human beings to data points, risk scores, or behavioural profiles.`,
  language: `All output must be in Spanish (Colombia/Latin America standard). Use pastoral and theological vocabulary appropriate for evangelical Protestant churches in the Latin American context.`,
};

function buildSystemPrompt(clauses) {
  return clauses.map((c) => AI_CONSTITUTION[c]).filter(Boolean).join("\n\n");
}

// ── 4. Inline extractPrayerEvent (mirrors lib/prayer-event-extractor.ts) ──────
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

async function extractPrayerEvent(prayerText) {
  const today = new Date().toISOString().split("T")[0];

  const prompt = `Today's date is ${today}.

Read this prayer request and determine if it mentions a specific upcoming event with a date or time (such as a surgery, medical appointment, court date, exam, travel, procedure, interview, or similar).

Prayer request:
"""
${prayerText}
"""

Return ONLY a JSON object (no markdown, no explanation):
{
  "hasEvent": true or false,
  "eventDateTime": "ISO 8601 datetime if found, null otherwise",
  "eventDescription": "brief description of the event in Spanish, null if no event"
}

Rules:
- Only extract FUTURE events (after today: ${today})
- If only a time is mentioned (e.g., "mañana a las 9am") without a full date, use tomorrow's date
- If no specific date or time is mentioned, hasEvent must be false
- Return ONLY the JSON. No other text.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 200,
    system: buildSystemPrompt(["imageOfGod", "language"]),
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  // Strip markdown fences Claude sometimes adds despite instructions
  const cleanText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    return JSON.parse(cleanText);
  } catch {
    return { hasEvent: false, eventDateTime: null, eventDescription: null, _rawText: cleanText };
  }
}

// ── 5. Test cases ─────────────────────────────────────────────────────────────
const testCases = [
  {
    label: "Surgery tomorrow with time",
    text: "Por favor oren por mi cirugía mañana a las 9am",
    expectHasEvent: true,
  },
  {
    label: "Medical appointment with specific date",
    text: "Tengo una cita médica el próximo martes 20 de abril",
    expectHasEvent: true,
  },
  {
    label: "General prayer request (no event)",
    text: "Necesito oración en general para mi familia",
    expectHasEvent: false,
  },
];

// ── 6. Run tests ──────────────────────────────────────────────────────────────
console.log(`\n📅  Today's date: ${new Date().toISOString().split("T")[0]}\n`);
console.log("🤖  Calling Claude claude-sonnet-4-5 for each test case…\n");

const results = [];
let allPassed = true;

for (const tc of testCases) {
  const startTime = Date.now();
  process.stdout.write(`  ▶  "${tc.text.substring(0, 50)}…"\n`);

  const result = await extractPrayerEvent(tc.text);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  const passed = result.hasEvent === tc.expectHasEvent;
  if (!passed) allPassed = false;

  results.push({ tc, result, elapsed, passed });

  console.log(`     hasEvent        : ${result.hasEvent} ${passed ? "✅" : "❌  (expected " + tc.expectHasEvent + ")"}`);
  if (result.hasEvent) {
    console.log(`     eventDateTime   : ${result.eventDateTime}`);
    console.log(`     eventDescription: ${result.eventDescription}`);
  }
  console.log(`     ⏱️   ${elapsed}s\n`);
}

// ── 7. Final output ───────────────────────────────────────────────────────────
console.log("═══════════════════════════════════════════════════════════");
console.log(`${allPassed ? "✅" : "❌"}  AGENT 4 — PRAYER WATCHMAN — ${allPassed ? "ALL TESTS PASSED" : "SOME TESTS FAILED"}`);
console.log("═══════════════════════════════════════════════════════════\n");

for (const { tc, result, passed } of results) {
  console.log(`  ${passed ? "✅" : "❌"}  [${tc.label}]`);
  if (!passed) {
    console.log(`       Expected hasEvent: ${tc.expectHasEvent}, got: ${result.hasEvent}`);
    if (result._rawText) console.log(`       Raw Claude output: ${result._rawText}`);
  }
}

if (!allPassed) process.exit(1);
