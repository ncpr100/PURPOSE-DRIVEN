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
  'app/api/analytics/member-journey/route.ts',
  'app/api/auth/mfa/verify/route.ts',
  'app/api/monitoring/collect/route.ts',
  'app/api/onboarding/register/route.ts',
  'app/api/platform/settings/mfa/verify/route.ts',
  'components/automation-rules/template-browser.tsx',
  'components/volunteers/enhanced-spiritual-assessment.tsx'
];
// Comprehensive mojibake map covering all common UTF-8 misinterpretations
const mojibakeMap = {
  // Accented lowercase vowels (Ã + byte)
  '\u00C3\u00A1': '\u00E1', // á
  '\u00C3\u00A9': '\u00E9', // é
  '\u00C3\u00AD': '\u00ED', // í
  '\u00C3\u00B3': '\u00F3', // ó
  '\u00C3\u00BA': '\u00FA', // ú
  // Accented uppercase vowels
  '\u00C3\u0081': '\u00C1', // Á
  '\u00C3\u0089': '\u00C9', // É
  '\u00C3\u008D': '\u00CD', // Í
  '\u00C3\u0093': '\u00D3', // Ó
  '\u00C3\u009A': '\u00DA', // Ú
  // ñ and Ñ
  '\u00C3\u00B1': '\u00F1', // ñ
  '\u00C3\u0091': '\u00D1', // Ñ
  // ü and Ü
  '\u00C3\u00BC': '\u00FC', // ü
  '\u00C3\u009C': '\u00DC', // Ü
  // Inverted punctuation
  '\u00C2\u00A1': '\u00A1', // ¡
  '\u00C2\u00BF': '\u00BF', // ¿
  // Em-dash and quotes (â€ patterns)
  '\u00E2\u0080\u0094': '\u2014', // —
  '\u00E2\u0080\u009C': '\u201C', // "
  '\u00E2\u0080\u009D': '\u201D', // "
  '\u00E2\u0080\u0098': '\u2018', // '
  '\u00E2\u0080\u0099': '\u2019', // '
  '\u00E2\u0080\u00A6': '\u2026', // …
  // Arrows
  '\u00E2\u0086\u0090': '\u2190', // ←
  '\u00E2\u0086\u0092': '\u2192', // →
  '\u00E2\u0086\u0091': '\u2191', // ↑
  '\u00E2\u0086\u0093': '\u2193', // ↓
  // Common standalone mojibake characters that might appear
  '\u00C3\u0083': '', // Remove stray Ã
  '\u00C2\u0080': '', // Remove stray Â€
  '\u00C2\u0081': '', // Remove stray Â
  '\u00C2\u0082': '', // Remove stray Â
  '\u00C2\u0083': '', // Remove stray Â
  '\u00C2\u0084': '', // Remove stray Â
  '\u00C2\u0085': '', // Remove stray Â
  '\u00C2\u0086': '', // Remove stray Â
  '\u00C2\u0087': '', // Remove stray Â
  '\u00C2\u0088': '', // Remove stray Â
  '\u00C2\u0089': '', // Remove stray Â
  '\u00C2\u008A': '', // Remove stray Â
  '\u00C2\u008B': '', // Remove stray Â
  '\u00C2\u008C': '', // Remove stray Â
  '\u00C2\u008D': '', // Remove stray Â
  '\u00C2\u008E': '', // Remove stray Â
  '\u00C2\u008F': '', // Remove stray Â
  '\u00C2\u0090': '', // Remove stray Â
  '\u00C2\u0091': '', // Remove stray Â
  '\u00C2\u0092': '', // Remove stray Â
  '\u00C2\u0093': '', // Remove stray Â
  '\u00C2\u0094': '', // Remove stray Â
  '\u00C2\u0095': '', // Remove stray Â
  '\u00C2\u0096': '', // Remove stray Â
  '\u00C2\u0097': '', // Remove stray Â
  '\u00C2\u0098': '', // Remove stray Â
  '\u00C2\u0099': '', // Remove stray Â
  '\u00C2\u009A': '', // Remove stray Â
  '\u00C2\u009B': '', // Remove stray Â
  '\u00C2\u009C': '', // Remove stray Â
  '\u00C2\u009D': '', // Remove stray Â
  '\u00C2\u009E': '', // Remove stray Â
  '\u00C2\u009F': ''  // Remove stray Â
};
let totalFixed = 0;
files.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.log('Not found: ' + file);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  for (const [mojibake, correct] of Object.entries(mojibakeMap)) {
    content = content.split(mojibake).join(correct);
  }
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed: ' + file);
    totalFixed++;
  } else {
    console.log('No changes: ' + file);
  }
});
console.log('\nTotal files fixed: ' + totalFixed);
