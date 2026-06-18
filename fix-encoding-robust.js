const fs = require('fs');
const path = require('path');
let filesFixed = 0;
let filesScanned = 0;
function convertEncoding(buffer) {
  // Intentar detectar si el archivo tiene mojibake
  // Los archivos UTF-8 válidos no deberían tener secuencias como C3 A3 C2 B3 (ó en UTF-8)
  // Leer como UTF-8 primero
  const utf8Content = buffer.toString('utf8');
  // Si ya es UTF-8 válido sin caracteres de reemplazo, devolver tal cual
  if (!utf8Content.includes('\uFFFD')) {
    // Verificar si tiene patrones mojibake comunes
    const mojibakePatterns = [
      'ó', 'á', 'é', 'í', 'ú', 'ñ', 'ü',
      'É', 'Ó', 'Á', 'Á', 'Áš', 'Á‘', 'Áœ',
      '—', '—', '"', '"', '"˜', '"™', '"¦',
      '€', '°', '©', '®', '™', '', ''
    ];
    let hasMojibake = false;
    for (const pattern of mojibakePatterns) {
      if (utf8Content.includes(pattern)) {
        hasMojibake = true;
        break;
      }
    }
    if (!hasMojibake) {
      return null; // No necesita corrección
    }
  }
  // Intentar convertir de Windows-1252 a UTF-8
  try {
    // Leer como Latin-1 (Windows-1252)
    const latin1Content = buffer.toString('latin1');
    // Verificar si tiene sentido como Latin-1
    const hasSpanishChars = /[áéíóúñüÁÉÍÓÚÑÜ]/.test(latin1Content);
    if (hasSpanishChars) {
      // Es probable que sea Windows-1252, convertir a UTF-8
      return latin1Content;
    }
  } catch (e) {
    // Error en conversión, devolver null
  }
  return null;
}
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'PURPOSE-DRIVEN') {
        continue;
      }
      walkDir(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      filesScanned++;
      try {
        const buffer = fs.readFileSync(filePath);
        const converted = convertEncoding(buffer);
        if (converted !== null) {
          fs.writeFileSync(filePath, converted, 'utf8');
          filesFixed++;
          console.log('✓ ' + filePath);
        }
      } catch (err) {
        console.error('✗ ' + filePath + ': ' + err.message);
      }
    }
  }
}
console.log('🔧 Iniciando conversión masiva de encoding...\n');
walkDir('.');
console.log('\n✅ Resumen:');
console.log('   Archivos escaneados: ' + filesScanned);
console.log('   Archivos convertidos: ' + filesFixed);
console.log('   Archivos sin cambios: ' + (filesScanned - filesFixed));
