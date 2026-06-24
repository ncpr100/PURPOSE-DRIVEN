import re
import os
def fix_html_file(filepath):
    if not os.path.exists(filepath):
        print(f'WARNING: {filepath}: No encontrado')
        return False
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    changes = []
    # FIX 1: Agregar rel="noopener noreferrer" a links target="_blank"
    def fix_link(match):
        tag_content = match.group(0)
        if 'target="_blank"' not in tag_content and "target='_blank'" not in tag_content:
            return tag_content
        if 'rel=' in tag_content and ('noopener' in tag_content or 'noreferrer' in tag_content):
            return tag_content
        if 'rel=' in tag_content:
            # Agregar noopener noreferrer al rel existente
            tag_content = re.sub(r'rel=["\']([^"\']*)["\']', r'rel="\1 noopener noreferrer"', tag_content)
        else:
            # Agregar rel="noopener noreferrer"
            tag_content = tag_content.replace('>', ' rel="noopener noreferrer">', 1)
        changes.append('Fix 1: rel=noopener')
        return tag_content
    content = re.sub(r'<a\s+[^>]*>', fix_link, content)
    # FIX 2: Extraer estilos inline a clases CSS
    style_map = {}
    class_counter = [0]
    def extract_inline_style(match):
        tag = match.group(1)
        attrs = match.group(2)
        style_match = re.search(r'style=["\']([^"\']+)["\']', attrs)
        if not style_match:
            return match.group(0)
        inline_style = style_match.group(1)
        class_name = f'auto-style-{class_counter[0]}'
        class_counter[0] += 1
        style_map[class_name] = inline_style
        # Agregar o actualizar class attribute
        if 'class=' in attrs:
            attrs = re.sub(r'class=["\']([^"\']*)["\']', rf'class="\1 {class_name}"', attrs)
        else:
            attrs += f' class="{class_name}"'
        # Remover style attribute
        attrs = re.sub(r'style=["\'][^"\']+["\']', '', attrs)
        changes.append(f'Fix 2: inline style -> .{class_name}')
        return f'<{tag}{attrs}>'
    content = re.sub(r'<(\w+)([^>]*)>', extract_inline_style, content)
    # Agregar estilos extraídos al bloque <style>
    if style_map:
        style_additions = '\n'.join([f'    .{cls} {{ {style} }}' for cls, style in style_map.items()])
        if '</style>' in content:
            content = content.replace('</style>', f'\n{style_additions}\n  </style>')
        else:
            content = content.replace('</head>', f'  <style>\n{style_additions}\n  </style>\n</head>')
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'FIXED: {filepath} ({len(changes)} changes)')
        return True
    else:
        print(f'OK: {filepath}')
        return True
files_to_fix = [
    'public/downloads/meta-template-agent12-cascade.html',
    'public/downloads/meta-template-pastor-welcome.html',
    'PURPOSE-DRIVEN/public/downloads/meta-template-agent12-cascade.html',
    'PURPOSE-DRIVEN/public/downloads/meta-template-pastor-welcome.html'
]
print('=== Corrigiendo archivos originales ===')
fixed = sum(1 for f in files_to_fix if fix_html_file(f))
print(f'=== Resumen: {fixed}/{len(files_to_fix)} ===')
