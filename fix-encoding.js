// fix-encoding.js
const fs = require("fs");
const path = require("path");

const files = [
  "app/api/analytics/member-lifecycle-funnel/route.ts",
  "app/api/analytics/retention-risk/route.ts",
  "app/api/cron/prayer-watchman/route.ts",
  "app/api/cron/sermon-antiphony/route.ts",
  "app/api/onboarding/prepare/route.ts",
  "app/api/online-payments/route.ts",
  "app/api/platform/churches/route.ts",
  "app/api/platform/settings/mfa/setup/route.ts",
  "lib/agents/product-designer.ts",
  "lib/monitoring/health-check-engine.ts",
];

// Common Mojibake replacements for Spanish text
const replacements = {
  "Ã­": "í",
  "Ã³": "ó",
  "Ã±": "ñ",
  "Ã¡": "á",
  "Ã©": "é",
  Ãº: "ú",
  "Ã¼": "ü",
  "Ã¿": "ÿ",
  'â€"': "—",
  "â€™": "'",
  "ï¸": "️",
  Â: "",
  Ã: "ñ",
  "Â¡": "¡",
  "Â¿": "¿",
};

files.forEach((file) => {
  const fullPath = path.resolve(file);
  let content = fs.readFileSync(fullPath, "utf8");

  // Replace corrupted sequences
  Object.entries(replacements).forEach(([bad, good]) => {
    content = content.split(bad).join(good);
  });

  // Write back as proper UTF-8
  fs.writeFileSync(fullPath, content, { encoding: "utf8" });
  console.log(`✅ Fixed: ${file}`);
});
