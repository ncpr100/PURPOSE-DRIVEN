const fs = require('fs');
function autoFixHTML(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('WARNING: ' + filePath + ': No encontrado');
    return false;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const changes = [];
  let originalContent = content;
  // FIX 1: Agregar rel="noopener noreferrer" a links target="_blank"
  const linkRegex = /<a\s+([^>]*?)>/gi;
  content = content.replace(linkRegex, (match, attrs) => {
    if (!attrs.includes('target="_blank"') && !attrs.includes("target=' + "'_blank'")) {
      return match;
    }
    if (attrs.includes('rel=') && (attrs.includes('noopener') || attrs.includes('noreferrer'))) {
      return match;
    }
    if (attrs.includes('rel=')) {
      attrs = attrs.replace(/rel=["'] + "[^" + "']*["']/, 'rel="' + "" + ' noopener noreferrer"');
    } else {
      attrs += ' rel="noopener noreferrer"';
    }
    changes.push('Fix 1: rel=noopener');
    return '<a ' + attrs + '>';
  });
  // FIX 2: Extraer estilos inline a clases CSS
  const styleMap = new Map();
  let classCounter = 0;
  const styleBlockMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const existingStyles = styleBlockMatch ? styleBlockMatch[1] : '';
  const elementRegex = /<(\w+)([^>]*)>/gi;
  content = content.replace(elementRegex, (match, tag, attrs) => {
    if (tag === 'style' || tag === 'script') return match;
    const styleMatch = attrs.match(/style=["'] + "([^" + "']+)["']/i);
    if (!styleMatch) return match;
    const inlineStyle = styleMatch[1];
    const className = 'auto-style-' + classCounter++;
    styleMap.set(className, inlineStyle);
    if (attrs.includes('class=')) {
      attrs = attrs.replace(/class=["'] + "([^" + "']*)["']/, 'class="' + " " + className + '"');
    } else {
      attrs += ' class="' + className + '"';
    }
    attrs = attrs.replace(/style=["'] + "[^" + "']+["']/i, '');
    changes.push('Fix 2: inline style -> .' + className);
    return '<' + tag + attrs + '>';
  });
  if (styleMap.size > 0) {
    const styleAdditions = Array.from(styleMap.entries())
      .map(([className, style]) => '    .' + className + ' { ' + style + ' }')
      .join('\n');
    if (existingStyles) {
      content = content.replace(/<\/style>/i, '\n' + styleAdditions + '\n  </style>');
    } else {
      content = content.replace(/<\/head>/i, '  <style>\n' + styleAdditions + '\n  </style>\n</head>');
    }
  }
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('FIXED: ' + filePath + ' (' + changes.length + ' changes)');
    return true;
  } else {
    console.log('OK: ' + filePath);
    return true;
  }
}
const filesToFix = [
  'public/downloads/meta-template-agent12-cascade.html',
  'public/downloads/meta-template-pastor-welcome.html',
  'PURPOSE-DRIVEN/public/downloads/meta-template-agent12-cascade.html',
  'PURPOSE-DRIVEN/public/downloads/meta-template-pastor-welcome.html'
];
console.log('=== Corrigiendo archivos originales ===');
let fixed = 0;
filesToFix.forEach(file => {
  if (autoFixHTML(file)) fixed++;
});
console.log('=== Resumen: ' + fixed + '/' + filesToFix.length + ' ===');
