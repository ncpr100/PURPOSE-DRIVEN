const fs = require('fs');
const path = require('path');
// Function to recursively get all .ts and .tsx files
function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.next')) {
      getAllFiles(fullPath, files);
    } else if (item.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      files.push(fullPath);
    }
  }
  return files;
}
// Get all TypeScript files
const allFiles = getAllFiles('.');
let fixedCount = 0;
allFiles.forEach(file => {
  try {
    // Read file as binary to detect BOM
    const buffer = fs.readFileSync(file);
    // Check for UTF-8 BOM (EF BB BF)
    let contentBuffer = buffer;
    if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
      // Remove BOM
      contentBuffer = buffer.slice(3);
    }
    // Convert to string
    let content = contentBuffer.toString('utf8');
    // Fix any remaining mojibake patterns using the comprehensive method
    const hasMojibake = content.includes('\u00C3') || content.includes('\u00E2\u20AC');
    if (hasMojibake) {
      content = Buffer.from(content, 'latin1').toString('utf8');
    }
    // Write back without BOM
    fs.writeFileSync(file, content, 'utf8');
    fixedCount++;
  } catch (error) {
    console.log('Error processing ' + file + ': ' + error.message);
  }
});
console.log('Fixed ' + fixedCount + ' files (removed BOM and mojibake)');
