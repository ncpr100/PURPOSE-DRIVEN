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
  // Step 1: Encode the mojibake string as Latin-1 bytes
  const encoder = new TextEncoder('iso-8859-1');
  const latin1Bytes = encoder.encode(text);
  // Step 2: Decode those bytes as UTF-8
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(latin1Bytes);
}
let totalFixed = 0;
files.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.log('Not found: ' + file);
    return;
  }
  const originalContent = fs.readFileSync(filePath, 'utf8');
  // Check if file has mojibake (using character codes to avoid regex issues)
  const hasMojibake = originalContent.includes('Ã') || originalContent.includes('â€');
  if (!hasMojibake) {
    console.log('No mojibake: ' + file);
    return;
  }
  try {
    const fixedContent = fixMojibake(originalContent);
    // Verify the fix worked
    const stillHasMojibake = fixedContent.includes('Ã') || fixedContent.includes('â€');
    if (stillHasMojibake) {
      console.log('Fix incomplete: ' + file);
      return;
    }
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log('Fixed: ' + file);
    totalFixed++;
  } catch (e) {
    console.log('Error fixing ' + file + ': ' + e.message);
  }
});
console.log('\nTotal files fixed: ' + totalFixed);
