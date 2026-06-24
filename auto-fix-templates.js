const fs = require('fs');
function autoFixHTML(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('⚠️  ' + filePath + ': No encontrado');
    return false;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const changes = [];
  let originalContent = content;
  // ═══════════════════════════════════════════════════════════════
  // FIX 1: Agregar rel="noopener noreferrer" a links target="_blank"
  // ═══════════════════════════════════════════════════════════════
  const linkRegex = /<a\s+([^>]*?)>/gi;
  content = content.replace(linkRegex, (match, attrs) => {
    if (!attrs.includes('target="_blank"') && !attrs.includes("target='_blank'")) {
      return match;
    }
    if (attrs.includes('rel=') && (attrs.includes('noopener') || attrs.includes('noreferrer'))) {
      return match;
    }
    if (attrs.includes('rel=')) {
      attrs = attrs.replace(/rel=["']([^"']*)["']/, 'rel=" noopener noreferrer"');
    } else {
      attrs += ' rel="noopener noreferrer"';
    }
    changes.push('✅ Fix 1: Agregado rel="noopener noreferrer" a link');
    return '<a ' + attrs + '>';
  });
  // ═══════════════════════════════════════════════════════════════
  // FIX 2: Extraer estilos inline a clases CSS
  // ═══════════════════════════════════════════════════════════════
  const styleMap = new Map();
  let classCounter = 0;
  const styleBlockMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const existingStyles = styleBlockMatch ? styleBlockMatch[1] : '';
  const elementRegex = /<(\w+)([^>]*)>/gi;
  content = content.replace(elementRegex, (match, tag, attrs) => {
    if (tag === 'style' || tag === 'script') return match;
    const styleMatch = attrs.match(/style=["']([^"']+)["']/i);
    if (!styleMatch) return match;
    const inlineStyle = styleMatch[1];
    const className = 'auto-style-' + classCounter++;
    styleMap.set(className, inlineStyle);
    if (attrs.includes('class=')) {
      attrs = attrs.replace(/class=["']([^"']*)["']/, 'class=" ' + className + '"');
    } else {
      attrs += ' class="' + className + '"';
    }
    attrs = attrs.replace(/style=["'][^"']+["']/i, '');
    changes.push('✅ Fix 2: Extraído estilo inline a .' + className);
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
    console.log('\n📄 ' + filePath + ' — ' + changes.length + ' correcciones aplicadas:');
    changes.forEach(c => console.log('   ' + c));
    return true;
  } else {
    console.log('\n✅ ' + filePath + ' — Sin problemas detectados');
    return true;
  }
}
const templates = [
  'templates/pastor-welcome.html',
  'templates/agent12-cascade.html',
  'templates/agent2-crisis-alert.html',
  'templates/agent4-prayer-reminder.html'
];
console.log('═══════════════════════════════════════════');
console.log('  AUTO-FIX: WhatsApp Templates');
console.log('═══════════════════════════════════════════');
let fixed = 0;
let missing = 0;
templates.forEach(t => {
  if (fs.existsSync(t)) {
    if (autoFixHTML(t)) fixed++;
  } else {
    console.log('\n⚠️  ' + t + ': Archivo no encontrado');
    missing++;
  }
});
console.log('\n═══════════════════════════════════════════');
console.log('  Resumen: ' + fixed + ' corregidos, ' + missing + ' faltantes');
console.log('═══════════════════════════════════════════');
