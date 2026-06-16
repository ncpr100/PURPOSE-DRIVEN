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
let totalFixed = 0;
files.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.log('Not found: ' + file);
    return;
  }
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const hasMojibake = originalContent.includes('\u00C3') || originalContent.includes('\u00E2\u20AC');
  if (!hasMojibake) {
    console.log('No mojibake: ' + file);
    return;
  }
  // The correct fix: treat each UTF-16 char code as a Latin-1 byte, then decode those bytes as UTF-8.
  // Buffer.from(text, 'latin1') does exactly this in Node.js.
  const fixedContent = Buffer.from(originalContent, 'latin1').toString('utf8');
  const stillHasMojibake = fixedContent.includes('\u00C3') || fixedContent.includes('\u00E2\u20AC');
  if (stillHasMojibake) {
    console.log('Fix incomplete: ' + file);
    return;
  }
  fs.writeFileSync(filePath, fixedContent, 'utf8');
  console.log('Fixed: ' + file);
  totalFixed++;
});
console.log('\nTotal files fixed: ' + totalFixed);
