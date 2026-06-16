const fs = require('fs');
const f1 = 'app/(dashboard)/help/manual/phase-3-members/page.tsx';
let c1 = fs.readFileSync(f1, 'utf8');
// Fix line 303: escape the quote after the dash/space
c1 = c1.replace(/Ve a Miembros\s+" Haz clic/g, 'Ve a Miembros \\" Haz clic');
c1 = c1.replace(/Ve a Miembros\s+—\s+" Haz clic/g, 'Ve a Miembros — \\" Haz clic');
// Remove all replacement characters
c1 = c1.replace(//g, '');
fs.writeFileSync(f1, c1, 'utf8');
const f2 = 'app/(dashboard)/help/manual/phase-6-analytics/page.tsx';
let c2 = fs.readFileSync(f2, 'utf8');
// Fix line 346: escape the quote after the dash/space
c2 = c2.replace(/ense\u00f1a\s+" Recomienda/g, 'ense\u00f1a \\" Recomienda');
c2 = c2.replace(/ense\u00f1a\s+—\s+" Recomienda/g, 'ense\u00f1a — \\" Recomienda');
// Fix line 340 if still broken
c2 = c2.replace(/semanas\s+" Sistema sugiere/g, 'semanas \\" Sistema sugiere');
c2 = c2.replace(/semanas\s+—\s+" Sistema sugiere/g, 'semanas — \\" Sistema sugiere');
// Remove all replacement characters
c2 = c2.replace(//g, '');
fs.writeFileSync(f2, c2, 'utf8');
console.log('Ambos archivos procesados - caracteres corruptos eliminados y comillas escapadas.');
