const fs = require("fs");
const path = require("path");

const files = [
  "app/(auth)/auth/mfa/page.tsx",
  "app/(dashboard)/analytics/_components/analytics-client.tsx",
  "app/(dashboard)/automation-rules/_components/automation-templates.tsx",
  "app/(dashboard)/automation-rules/_components/unified-automation-interface.tsx",
  "app/(dashboard)/events/_components/smart-events-client.tsx",
  "app/(dashboard)/help/manual/all-features/page.tsx",
  "app/(dashboard)/help/manual/phase-3-members/page.tsx",
  "app/(dashboard)/help/manual/phase-6-analytics/page.tsx",
  "app/(dashboard)/prayer-requests/page.tsx",
  "app/(dashboard)/social-media/_components/social-media-client.tsx",
  "app/(dashboard)/social-media-v2/_components/social-media-dashboard-client.tsx",
  "app/(dashboard)/volunteers/_components/volunteers-client.tsx",
  "app/api/analytics/member-journey/route.ts",
  "app/api/auth/mfa/verify/route.ts",
  "app/api/monitoring/collect/route.ts",
  "app/api/onboarding/register/route.ts",
  "app/api/platform/settings/mfa/verify/route.ts",
  "components/automation-rules/template-browser.tsx",
  "components/volunteers/enhanced-spiritual-assessment.tsx",
];

const mojibakeMap = {
  "\u00C3\u00A1": "\u00E1",
  "\u00C3\u00A9": "\u00E9",
  "\u00C3\u00AD": "\u00ED",
  "\u00C3\u00B3": "\u00F3",
  "\u00C3\u00BA": "\u00FA",
  "\u00C3\u00B1": "\u00F1",
  "\u00C3\u201C": "\u2014",
  "\u00C3\u201D": "\u2014",
  "\u00C2\u00A1": "\u00A1",
  "\u00C2\u00BF": "\u00BF",
};

let totalFixed = 0;

files.forEach((file) => {
  const filePath = path.resolve(file);

  if (!fs.existsSync(filePath)) {
    console.log("Not found: " + file);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;

  for (const [mojibake, correct] of Object.entries(mojibakeMap)) {
    content = content.split(mojibake).join(correct);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("Fixed: " + file);
    totalFixed++;
  } else {
    console.log("No changes: " + file);
  }
});

console.log("\nTotal files fixed: " + totalFixed);
