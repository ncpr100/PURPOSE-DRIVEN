#!/usr/bin/env python3
"""
Cosmos Design System - Bulk Color Token Replacement Script
Replaces all hardcoded Tailwind color classes with Cosmos CSS variable tokens.
"""

import os
import re
import sys
from pathlib import Path

# ============================================================
# REPLACEMENT RULES (order matters — most specific first)
# ============================================================

REPLACEMENTS = [
    # ── Background gradients ──────────────────────────────
    (r'bg-gradient-to-br from-blue-50 to-indigo-100', 'bg-background'),
    (r'bg-gradient-to-br from-blue-\d+ to-purple-\d+', 'btn-cta-gradient'),
    (r'bg-gradient-to-[a-z]+ from-blue-\d+ to-purple-\d+', 'btn-cta-gradient'),
    (r'bg-gradient-to-r from-blue-500 to-purple-500', 'btn-cta-gradient'),
    (r'bg-gradient-to-r from-blue-600 to-purple-600', 'btn-cta-gradient'),
    (r'bg-gradient-to-r from-blue-\d+ via-\w+-\d+ to-purple-\d+', 'btn-cta-gradient'),
    (r'from-blue-\d+ to-indigo-\d+', 'from-primary/20 to-primary/10'),
    (r'from-blue-\d+ to-purple-\d+', 'btn-cta-gradient'),

    # ── Blue backgrounds ──────────────────────────────────
    (r'bg-blue-50/50',          'bg-[hsl(var(--info)/0.06)]'),
    (r'bg-blue-50',             'bg-[hsl(var(--info)/0.10)]'),
    (r'bg-blue-100',            'bg-[hsl(var(--info)/0.15)]'),
    (r'bg-blue-200',            'bg-[hsl(var(--info)/0.20)]'),
    (r'bg-blue-500',            'bg-[hsl(var(--info))]'),
    (r'bg-blue-600',            'bg-[hsl(var(--info))]'),
    (r'bg-blue-700',            'bg-[hsl(var(--info))]'),

    # ── Blue text ──────────────────────────────────────────
    (r'text-blue-900',          'text-foreground'),
    (r'text-blue-800',          'text-[hsl(var(--info))]'),
    (r'text-blue-700',          'text-[hsl(var(--info))]'),
    (r'text-blue-600',          'text-[hsl(var(--info))]'),
    (r'text-blue-500',          'text-[hsl(var(--info))]'),
    (r'text-blue-400',          'text-[hsl(var(--info)/0.7)]'),

    # ── Blue borders ──────────────────────────────────────
    (r'border-blue-200',        'border-[hsl(var(--info)/0.3)]'),
    (r'border-blue-300',        'border-[hsl(var(--info)/0.4)]'),
    (r'border-blue-400',        'border-[hsl(var(--info)/0.5)]'),
    (r'border-blue-500',        'border-[hsl(var(--info))]'),
    (r'border-blue-600',        'border-[hsl(var(--info))]'),
    (r'ring-blue-\d+',          'ring-[hsl(var(--info)/0.4)]'),
    (r'focus:ring-blue-\d+',    'focus:ring-[hsl(var(--info)/0.4)]'),

    # ── Indigo (treat same as blue/primary) ───────────────
    (r'bg-indigo-50',           'bg-primary/[0.06]'),
    (r'bg-indigo-100',          'bg-primary/[0.12]'),
    (r'bg-indigo-500',          'bg-primary'),
    (r'bg-indigo-600',          'bg-primary'),
    (r'text-indigo-900',        'text-foreground'),
    (r'text-indigo-800',        'text-primary'),
    (r'text-indigo-700',        'text-primary'),
    (r'text-indigo-600',        'text-primary'),
    (r'text-indigo-500',        'text-primary'),
    (r'border-indigo-200',      'border-primary/20'),
    (r'border-indigo-300',      'border-primary/30'),

    # ── Purple backgrounds ────────────────────────────────
    (r'bg-purple-50',           'bg-[hsl(var(--lavender)/0.10)]'),
    (r'bg-purple-100',          'bg-[hsl(var(--lavender)/0.15)]'),
    (r'bg-purple-200',          'bg-[hsl(var(--lavender)/0.20)]'),
    (r'bg-purple-500',          'bg-[hsl(var(--lavender))]'),
    (r'bg-purple-600',          'bg-[hsl(var(--lavender))]'),

    # ── Purple text ───────────────────────────────────────
    (r'text-purple-900',        'text-foreground'),
    (r'text-purple-800',        'text-[hsl(var(--lavender))]'),
    (r'text-purple-700',        'text-[hsl(var(--lavender))]'),
    (r'text-purple-600',        'text-[hsl(var(--lavender))]'),
    (r'text-purple-500',        'text-[hsl(var(--lavender))]'),
    (r'text-purple-400',        'text-[hsl(var(--lavender)/0.7)]'),

    # ── Purple borders ────────────────────────────────────
    (r'border-purple-200',      'border-[hsl(var(--lavender)/0.3)]'),
    (r'border-purple-300',      'border-[hsl(var(--lavender)/0.4)]'),
    (r'border-purple-500',      'border-[hsl(var(--lavender))]'),

    # ── Green backgrounds ─────────────────────────────────
    (r'bg-green-50',            'bg-[hsl(var(--success)/0.10)]'),
    (r'bg-green-100',           'bg-[hsl(var(--success)/0.15)]'),
    (r'bg-green-200',           'bg-[hsl(var(--success)/0.20)]'),
    (r'bg-green-500',           'bg-[hsl(var(--success))]'),
    (r'bg-green-600',           'bg-[hsl(var(--success))]'),

    # ── Green text ────────────────────────────────────────
    (r'text-green-900',         'text-foreground'),
    (r'text-green-800',         'text-[hsl(var(--success))]'),
    (r'text-green-700',         'text-[hsl(var(--success))]'),
    (r'text-green-600',         'text-[hsl(var(--success))]'),
    (r'text-green-500',         'text-[hsl(var(--success))]'),
    (r'text-green-400',         'text-[hsl(var(--success)/0.7)]'),

    # ── Green borders ─────────────────────────────────────
    (r'border-green-200',       'border-[hsl(var(--success)/0.3)]'),
    (r'border-green-300',       'border-[hsl(var(--success)/0.4)]'),
    (r'border-green-500',       'border-[hsl(var(--success))]'),
    (r'border-green-600',       'border-[hsl(var(--success))]'),

    # ── Yellow/Amber backgrounds ──────────────────────────
    (r'bg-yellow-50',           'bg-[hsl(var(--warning)/0.10)]'),
    (r'bg-yellow-100',          'bg-[hsl(var(--warning)/0.15)]'),
    (r'bg-amber-50',            'bg-[hsl(var(--warning)/0.10)]'),
    (r'bg-amber-100',           'bg-[hsl(var(--warning)/0.15)]'),

    # ── Yellow/Amber text ─────────────────────────────────
    (r'text-yellow-900',        'text-[hsl(var(--warning))]'),
    (r'text-yellow-800',        'text-[hsl(var(--warning))]'),
    (r'text-yellow-700',        'text-[hsl(var(--warning))]'),
    (r'text-yellow-600',        'text-[hsl(var(--warning))]'),
    (r'text-yellow-500',        'text-[hsl(var(--warning))]'),
    (r'text-amber-700',         'text-[hsl(var(--warning))]'),
    (r'text-amber-600',         'text-[hsl(var(--warning))]'),
    (r'text-amber-500',         'text-[hsl(var(--warning))]'),

    # ── Yellow borders ────────────────────────────────────
    (r'border-yellow-200',      'border-[hsl(var(--warning)/0.3)]'),
    (r'border-yellow-300',      'border-[hsl(var(--warning)/0.4)]'),
    (r'border-amber-200',       'border-[hsl(var(--warning)/0.3)]'),

    # ── Red backgrounds ───────────────────────────────────
    (r'bg-red-50',              'bg-[hsl(var(--destructive)/0.10)]'),
    (r'bg-red-100',             'bg-[hsl(var(--destructive)/0.15)]'),
    (r'bg-red-200',             'bg-[hsl(var(--destructive)/0.20)]'),
    (r'bg-red-500',             'bg-[hsl(var(--destructive))]'),
    (r'bg-red-600',             'bg-[hsl(var(--destructive))]'),

    # ── Red text ──────────────────────────────────────────
    (r'text-red-900',           'text-[hsl(var(--destructive))]'),
    (r'text-red-800',           'text-[hsl(var(--destructive))]'),
    (r'text-red-700',           'text-[hsl(var(--destructive))]'),
    (r'text-red-600',           'text-[hsl(var(--destructive))]'),
    (r'text-red-500',           'text-[hsl(var(--destructive))]'),
    (r'text-red-400',           'text-[hsl(var(--destructive)/0.7)]'),

    # ── Red borders ───────────────────────────────────────
    (r'border-red-200',         'border-[hsl(var(--destructive)/0.3)]'),
    (r'border-red-300',         'border-[hsl(var(--destructive)/0.4)]'),
    (r'border-red-500',         'border-[hsl(var(--destructive))]'),

    # ── Orange ────────────────────────────────────────────
    (r'bg-orange-50',           'bg-[hsl(var(--warning)/0.10)]'),
    (r'bg-orange-100',          'bg-[hsl(var(--warning)/0.15)]'),
    (r'text-orange-600',        'text-[hsl(var(--warning))]'),
    (r'text-orange-500',        'text-[hsl(var(--warning))]'),
    (r'text-orange-700',        'text-[hsl(var(--warning))]'),
    (r'border-orange-200',      'border-[hsl(var(--warning)/0.3)]'),

    # ── Gray/Slate text → muted-foreground ────────────────
    (r'text-gray-900',          'text-foreground'),
    (r'text-gray-800',          'text-foreground'),
    (r'text-gray-700',          'text-muted-foreground'),
    (r'text-gray-600',          'text-muted-foreground'),
    (r'text-gray-500',          'text-muted-foreground'),
    (r'text-gray-400',          'text-muted-foreground/70'),
    (r'text-slate-900',         'text-foreground'),
    (r'text-slate-800',         'text-foreground'),
    (r'text-slate-700',         'text-muted-foreground'),
    (r'text-slate-600',         'text-muted-foreground'),
    (r'text-slate-500',         'text-muted-foreground'),
    (r'text-slate-400',         'text-muted-foreground/70'),
    (r'text-zinc-900',          'text-foreground'),
    (r'text-zinc-700',          'text-muted-foreground'),
    (r'text-zinc-600',          'text-muted-foreground'),
    (r'text-zinc-500',          'text-muted-foreground'),

    # ── Gray/Slate backgrounds → card / muted ─────────────
    (r'bg-gray-50',             'bg-muted/30'),
    (r'bg-gray-100',            'bg-muted/50'),
    (r'bg-gray-200',            'bg-muted'),
    (r'bg-gray-700',            'bg-muted'),
    (r'bg-gray-800',            'bg-card'),
    (r'bg-gray-900',            'bg-background'),
    (r'bg-slate-50',            'bg-muted/30'),
    (r'bg-slate-100',           'bg-muted/50'),
    (r'bg-slate-200',           'bg-muted'),
    (r'bg-slate-700',           'bg-muted'),
    (r'bg-slate-800',           'bg-card'),
    (r'bg-slate-900',           'bg-background'),
    (r'bg-zinc-50',             'bg-muted/30'),
    (r'bg-zinc-100',            'bg-muted/50'),

    # ── Gray borders ──────────────────────────────────────
    (r'border-gray-100',        'border-border/50'),
    (r'border-gray-200',        'border-border'),
    (r'border-gray-300',        'border-border'),
    (r'border-slate-200',       'border-border'),
    (r'border-slate-300',       'border-border'),

    # ── Hover states ──────────────────────────────────────
    (r'hover:bg-blue-50',       'hover:bg-[hsl(var(--info)/0.10)]'),
    (r'hover:bg-blue-100',      'hover:bg-[hsl(var(--info)/0.15)]'),
    (r'hover:bg-gray-100',      'hover:bg-muted'),
    (r'hover:bg-gray-50',       'hover:bg-muted/50'),
    (r'hover:bg-slate-100',     'hover:bg-muted'),
    (r'hover:text-blue-600',    'hover:text-[hsl(var(--info))]'),
    (r'hover:text-gray-900',    'hover:text-foreground'),
    (r'hover:border-blue-300',  'hover:border-[hsl(var(--info)/0.4)]'),

    # ── White text (often forced on dark bg) ──────────────
    # Only replace when combined with colored bg — handled contextually

    # ── Teal/Cyan ─────────────────────────────────────────
    (r'bg-teal-50',             'bg-[hsl(var(--info)/0.10)]'),
    (r'bg-teal-100',            'bg-[hsl(var(--info)/0.15)]'),
    (r'text-teal-600',          'text-[hsl(var(--info))]'),
    (r'text-teal-700',          'text-[hsl(var(--info))]'),
    (r'text-cyan-600',          'text-[hsl(var(--info))]'),
    (r'text-cyan-500',          'text-[hsl(var(--info))]'),

    # ── Pink/Rose ─────────────────────────────────────────
    (r'bg-pink-50',             'bg-[hsl(var(--destructive)/0.08)]'),
    (r'bg-pink-100',            'bg-[hsl(var(--destructive)/0.12)]'),
    (r'text-pink-600',          'text-[hsl(var(--destructive))]'),
    (r'text-rose-600',          'text-[hsl(var(--destructive))]'),
    (r'text-rose-500',          'text-[hsl(var(--destructive))]'),
]

# ============================================================
# SKIP PATTERNS — don't touch node_modules, built files, etc.
# ============================================================

SKIP_DIRS = {'.next', 'node_modules', '.git', 'dist', 'build', '__pycache__', 'scripts'}
SKIP_FILES = {'tailwind.config.ts', 'globals.css'}  # already correct


def should_skip(path: Path) -> bool:
    for part in path.parts:
        if part in SKIP_DIRS:
            return True
    if path.name in SKIP_FILES:
        return True
    return False


def fix_file(path: Path, dry_run: bool = False) -> int:
    """Apply all replacements to a file. Returns count of changes."""
    try:
        content = path.read_text(encoding='utf-8')
    except Exception as e:
        print(f'  SKIP (read error): {path} — {e}')
        return 0

    original = content
    changes = 0
    for pattern, replacement in REPLACEMENTS:
        new_content, n = re.subn(pattern, replacement, content)
        if n > 0:
            content = new_content
            changes += n

    if changes > 0 and content != original:
        if not dry_run:
            path.write_text(content, encoding='utf-8')
        return changes
    return 0


def main():
    root = Path('/workspaces/PURPOSE-DRIVEN')
    dry_run = '--dry-run' in sys.argv

    # Target dirs
    search_dirs = [
        root / 'app',
        root / 'components',
    ]

    total_files = 0
    total_changes = 0
    changed_files = []

    for search_dir in search_dirs:
        for path in sorted(search_dir.rglob('*.tsx')):
            if should_skip(path):
                continue
            n = fix_file(path, dry_run=dry_run)
            total_files += 1
            if n > 0:
                total_changes += n
                changed_files.append((path.relative_to(root), n))

    print(f'\n{"DRY RUN — " if dry_run else ""}Cosmos Color Fix Complete')
    print(f'Scanned:  {total_files} files')
    print(f'Modified: {len(changed_files)} files')
    print(f'Changes:  {total_changes} token substitutions\n')

    if changed_files:
        print('Changed files:')
        for f, n in changed_files:
            print(f'  {n:4d}  {f}')


if __name__ == '__main__':
    main()
