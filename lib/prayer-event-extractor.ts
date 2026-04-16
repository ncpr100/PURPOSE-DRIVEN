// Agent 4: Prayer Watchman — Event Extractor
// Identifies date-specific events in prayer requests and schedules care touchpoints.

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { buildSystemPrompt } from "@/lib/ai-constitution";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ExtractedEvent {
  hasEvent: boolean;
  eventDateTime: string | null; // ISO 8601
  eventDescription: string | null;
}

export async function extractPrayerEvent(
  prayerText: string,
): Promise<ExtractedEvent> {
  if (process.env.ENABLE_PRAYER_WATCHMAN !== "true") {
    return { hasEvent: false, eventDateTime: null, eventDescription: null };
  }

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
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    system: buildSystemPrompt(["imageOfGod", "language"]),
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  try {
    return JSON.parse(rawText) as ExtractedEvent;
  } catch {
    return { hasEvent: false, eventDateTime: null, eventDescription: null };
  }
}

export async function scheduleWatchmanCare(params: {
  churchId: string;
  prayerRequestId: string;
  eventDateTime: string;
  eventDescription: string;
}) {
  // prayer_watchman_events schema has no requesterPhone/requesterName columns.
  // The cron resolves contact info at send-time via the prayerRequestId →
  // prayer_requests.contactId → prayer_contacts join.
  const watchmanEvent = await db.prayer_watchman_events.create({
    data: {
      churchId: params.churchId,
      prayerRequestId: params.prayerRequestId,
      eventDescription: params.eventDescription,
      eventDateTime: new Date(params.eventDateTime),
      status: "SCHEDULED",
    },
  });

  console.log(
    `[PRAYER_WATCHMAN] Scheduled care for event: ${params.eventDescription} at ${params.eventDateTime}`,
  );

  return watchmanEvent;
}
