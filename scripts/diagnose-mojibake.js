const fs = require('fs');
const path = require('path');
const files = [
  'app/(auth)/auth/mfa/page.tsx',
  'app/(dashboard)/analytics/_components/analytics-client.tsx',
  'app/(dashboard)/automation-rules/_components/automation-templates.tsx',
  'app/(dashboard)/automation-rules/_components/unified-automation-interface.tsx',
  'app/(dashboard)/events/_components/smart-events-client.tsx',
  'app/(dashboard)/help/manual/all-features/page.tsx',
  'app/(dashboard)/help/manual/phase-3-members/page.tsx',
  'app/(dashboard)/help/manual/phase-6-analytics/page.tsx',
  'app/(dashboard)/prayer-requests/page.tsx',
  'app/(dashboard)/social-media/_components/social-media-client.tsx',
  'app/(dashboard)/social-media-v2/_components/social-media-dashboard-client.tsx',
  'app/(dashboard)/volunteers/_components/volunteers-client.tsx',
  'app/api/auth/mfa/verify/route.ts',
  'app/api/monitoring/collect/route.ts',
  'app/api/platform/settings/mfa/verify/route.ts',
  'components/automation-rules/template-browser.tsx',
  'components/volunteers/enhanced-spiritual-assessment.tsx'
];
// Use the EXACT same regex as quality-gate-ci.js
const mojibakeRegex = /Ã|â€|Â¡|Â¿/g;
const allMojibake = new Map();
files.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(mojibakeRegex);
  if (matches) {
    matches.forEach(m => {
      const codes = Array.from(m).map(c => 'U+' + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' ');
      if (!allMojibake.has(m)) {
        allMojibake.set(m, { codes, count: 0, files: new Set() });
      }
      const entry = allMojibake.get(m);
      entry.count++;
      entry.files.add(file);
    });
  }
});
console.log('=== MOJIBAKE PATTERNS FOUND (Using quality gate regex) ===\n');
const sorted = Array.from(allMojibake.entries()).sort((a, b) => b[1].count - a[1].count);
sorted.forEach(([pattern, data]) => {
  console.log('Pattern: ' + JSON.stringify(pattern));
  console.log('Codes:   ' + data.codes);
  console.log('Count:   ' + data.count + ' occurrences in ' + data.files.size + ' files');
  console.log('---');
});
console.log('\nTotal unique patterns: ' + allMojibake.size);
