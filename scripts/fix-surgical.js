const fs = require('fs');
const f1 = 'app/(dashboard)/help/manual/phase-3-members/page.tsx';
let l1 = fs.readFileSync(f1, 'utf8').split('\n');
// Reemplazar SOLO las líneas específicas que tienen comillas sin escapar
l1[302] = '                  "Ve a Miembros > Haz clic en Importar",';
l1[327] = '                  "Vuelve a Khesed-tek > Miembros > Importar",';
l1[411] = '                description: "Haz clic en el nombre del miembro > boton Editar",';
fs.writeFileSync(f1, l1.join('\n'), 'utf8');
console.log('Fixed phase-3-members');
const f2 = 'app/(dashboard)/help/manual/phase-6-analytics/page.tsx';
let l2 = fs.readFileSync(f2, 'utf8').split('\n');
l2[339] = '                example: "Juan no ha asistido en 3 semanas > Alerta: Contactar urgente",';
l2[345] = '                example: "Maria tiene don de ensenanza > Recomienda: Escuela Dominical",';
l2[357] = '                example: "Asistencia bajo 20% > Alerta: Revisar programacion de cultos",';
l2[363] = '                example: "Pedro paso de VISITANTE a CRECIMIENTO en 3 meses > Excelente",';
fs.writeFileSync(f2, l2.join('\n'), 'utf8');
console.log('Fixed phase-6-analytics');
console.log('Done - only specific lines replaced');
