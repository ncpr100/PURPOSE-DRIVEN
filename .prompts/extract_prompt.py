#!/usr/bin/env python3
"""
extract_prompt.py – Extract prompts from prompt_library.xml by ID.

Usage:
  python extract_prompt.py <prompt_id>           # Extract and print prompt
  python extract_prompt.py --list                # List all available prompt IDs
  python extract_prompt.py --validate            # Validate XML against XSD schema
  python extract_prompt.py --validate <id>       # Validate then extract

Requirements:
  pip install lxml

Examples:
  python extract_prompt.py cms_universal
  python extract_prompt.py --list
  python extract_prompt.py --validate cms_bug_fixing
"""

import re
import sys
from pathlib import Path

try:
    from lxml import etree
except ImportError:
    print("ERROR: 'lxml' is not installed. Run: pip install lxml")
    sys.exit(2)

XML_FILE = Path(__file__).parent / "prompt_library.xml"
XSD_FILE = Path(__file__).parent / "prompt_library.xsd"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

VALID_ID_RE = re.compile(r'^[a-zA-Z_][a-zA-Z0-9_\-]*$')


def sanitize_id(prompt_id: str) -> str:
    """Reject IDs that don't match the allowed pattern (prevents XPath injection)."""
    if not VALID_ID_RE.match(prompt_id):
        print(f"ERROR: Invalid prompt ID format: '{prompt_id}'")
        print("       IDs must match: [a-zA-Z_][a-zA-Z0-9_-]*")
        sys.exit(1)
    return prompt_id


def load_xml(xml_path: Path) -> etree._ElementTree:
    try:
        return etree.parse(str(xml_path))
    except etree.XMLSyntaxError as e:
        print(f"ERROR: XML syntax error in '{xml_path}':\n  {e}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"ERROR: File not found: '{xml_path}'")
        sys.exit(1)


def validate_against_xsd(tree: etree._ElementTree, xsd_path: Path) -> bool:
    if not xsd_path.exists():
        print(f"WARNING: XSD file not found at '{xsd_path}'. Skipping schema validation.")
        return True
    try:
        schema_doc = etree.parse(str(xsd_path))
        schema = etree.XMLSchema(schema_doc)
    except etree.XMLSyntaxError as e:
        print(f"ERROR: XSD schema is invalid:\n  {e}")
        sys.exit(1)

    if schema.validate(tree):
        print(f"[OK] XML is valid against '{xsd_path.name}'")
        return True
    else:
        print(f"[FAIL] XML validation errors in '{xsd_path.name}':")
        for error in schema.error_log:
            print(f"  Line {error.line}: {error.message}")
        sys.exit(1)


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def list_prompts(tree: etree._ElementTree) -> None:
    """Print all prompt IDs grouped by project."""
    root = tree.getroot()
    found = False
    for project in root.findall("project"):
        proj_name = project.get("name", "(unnamed)")
        prompts = project.findall("prompt")
        if prompts:
            found = True
            print(f"\n[{proj_name}]")
            for prompt in prompts:
                print(f"  {prompt.get('id')}")
    if not found:
        print("No prompts found in the library.")


def extract_prompt(tree: etree._ElementTree, prompt_id: str) -> None:
    """Find and pretty-print a prompt by its ID."""
    safe_id = sanitize_id(prompt_id)

    # Safe XPath using ElementPath (no f-string injection risk)
    results = tree.findall(f".//prompt[@id='{safe_id}']")

    if not results:
        print(f"ERROR: Prompt ID '{safe_id}' not found.")
        print("       Run with --list to see available IDs.")
        sys.exit(1)

    prompt = results[0]

    def get_text(tag: str) -> str:
        el = prompt.find(tag)
        return el.text.strip() if el is not None and el.text else "(empty)"

    separator = "=" * 60
    print(separator)
    print(f"PROMPT ID: {safe_id}")
    print(separator)
    print("\n## Context\n")
    print(get_text("context"))
    print("\n## Instructions\n")
    print(get_text("instructions"))
    print("\n## Output Requirements\n")
    print(get_text("output_requirements"))
    print(f"\n{separator}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    args = sys.argv[1:]

    if not args:
        print(__doc__)
        sys.exit(0)

    do_validate = "--validate" in args
    do_list = "--list" in args
    ids = [a for a in args if not a.startswith("--")]

    tree = load_xml(XML_FILE)

    if do_validate:
        validate_against_xsd(tree, XSD_FILE)

    if do_list:
        list_prompts(tree)
        return

    if not ids:
        if not do_validate:
            print("ERROR: No prompt ID provided.")
            print("       Run with --list to see available IDs, or --help for usage.")
            sys.exit(1)
        return

    for prompt_id in ids:
        extract_prompt(tree, prompt_id)


if __name__ == "__main__":
    main()
