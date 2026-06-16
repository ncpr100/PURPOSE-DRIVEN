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
function fixMojibake(text) {
  // Convert string to Latin-1 bytes, then decode as UTF-8
  const bytes = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 256) {
      bytes.push(code);
    } else {
      // Character outside Latin-1 range - keep as is
      bytes.push(code);
    }
  }
  // Try to decode as UTF-8
  try {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const uint8Array = new Uint8Array(bytes);
    return decoder.decode(uint8Array);
  } catch (e) {
    // If decoding fails, return original
    return text;
  }
}
let totalFixed = 0;
const mojibakeRegex = /Ã|â€/;
files.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.log('Not found: ' + file);
    return;
  }
  const originalContent = fs.readFileSync(filePath, 'utf8');
  // Check if file has mojibake
  if (!mojibakeRegex.test(originalContent)) {
    console.log('No mojibake: ' + file);
    return;
  }
  const fixedContent = fixMojibake(originalContent);
  // Verify the fix worked
  if (mojibakeRegex.test(fixedContent)) {
    console.log('Fix incomplete: ' + file);
    return;
  }
  fs.writeFileSync(filePath, fixedContent, 'utf8');
  console.log('Fixed: ' + file);
  totalFixed++;
});
console.log('\nTotal files fixed: ' + totalFixed);
