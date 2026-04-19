#!/usr/bin/env node
/**
 * extract_prompt.js – Extract prompts from prompt_library.xml by ID.
 *
 * Usage:
 *   node extract_prompt.js <prompt_id>     # Extract and print prompt
 *   node extract_prompt.js --list          # List all available IDs
 *   node extract_prompt.js --help          # Show this help
 *
 * Install dependencies:
 *   npm install fast-xml-parser
 *
 * Examples:
 *   node extract_prompt.js cms_universal
 *   node extract_prompt.js --list
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Dependency check
// ---------------------------------------------------------------------------
let XMLParser;
try {
  ({ XMLParser } = require('fast-xml-parser'));
} catch {
  console.error("ERROR: 'fast-xml-parser' is not installed.");
  console.error("       Run: npm install fast-xml-parser");
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const XML_FILE    = path.join(__dirname, 'prompt_library.xml');
const VALID_ID_RE = /^[a-zA-Z_][a-zA-Z0-9_\-]*$/;
const SEPARATOR   = '='.repeat(60);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Guarantee a value is always returned as an array.
 * fast-xml-parser returns a plain object when there is only ONE child element —
 * this is the root cause of the original crash.
 *
 * @param {*} value - The parsed value (may be object, array, undefined)
 * @returns {Array}
 */
function toArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Load and parse the XML file. Exits on error.
 * @returns {Object} Parsed JS object representing the XML.
 */
function loadXml() {
  if (!fs.existsSync(XML_FILE)) {
    console.error(`ERROR: File not found: '${XML_FILE}'`);
    process.exit(1);
  }

  let xmlData;
  try {
    xmlData = fs.readFileSync(XML_FILE, 'utf8');
  } catch (err) {
    console.error(`ERROR: Cannot read '${XML_FILE}': ${err.message}`);
    process.exit(1);
  }

  const parser = new XMLParser({
    ignoreAttributes:    false,
    attributeNamePrefix: '@_',
    // Preserve whitespace inside text elements so CDATA content is clean
    trimValues:          true,
  });

  let parsed;
  try {
    parsed = parser.parse(xmlData);
  } catch (err) {
    console.error(`ERROR: XML parsing failed: ${err.message}`);
    process.exit(1);
  }

  if (!parsed?.prompt_library) {
    console.error("ERROR: Unexpected XML structure – root <prompt_library> element not found.");
    process.exit(1);
  }

  return parsed.prompt_library;
}

/**
 * Iterate all prompts safely.
 * @param {Object} library - Parsed prompt_library object.
 * @returns {Array<{projectName: string, id: string, prompt: Object}>}
 */
function allPrompts(library) {
  const results = [];
  // toArray() handles single-project vs multi-project gracefully
  for (const project of toArray(library.project)) {
    const projectName = project['@_name'] || '(unnamed)';
    // toArray() handles single-prompt vs multi-prompt gracefully
    for (const prompt of toArray(project.prompt)) {
      results.push({ projectName, id: prompt['@_id'], prompt });
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function listPrompts(library) {
  const prompts = allPrompts(library);
  if (prompts.length === 0) {
    console.log('No prompts found in the library.');
    return;
  }

  // Group by project
  const byProject = {};
  for (const { projectName, id } of prompts) {
    if (!byProject[projectName]) byProject[projectName] = [];
    byProject[projectName].push(id);
  }

  for (const [project, ids] of Object.entries(byProject)) {
    console.log(`\n[${project}]`);
    for (const id of ids) console.log(`  ${id}`);
  }
}

function extractPrompt(library, promptId) {
  // Sanitize ID to prevent any injection via the search loop
  if (!VALID_ID_RE.test(promptId)) {
    console.error(`ERROR: Invalid prompt ID format: '${promptId}'`);
    console.error("       IDs must match: [a-zA-Z_][a-zA-Z0-9_-]*");
    process.exit(1);
  }

  const all    = allPrompts(library);
  const entry  = all.find(p => p.id === promptId);

  if (!entry) {
    console.error(`ERROR: Prompt ID '${promptId}' not found.`);
    console.error("       Run with --list to see available IDs.");
    process.exit(1);
  }

  const { prompt } = entry;

  const getText = (key) => {
    const val = prompt[key];
    if (val === undefined || val === null || val === '') return '(empty)';
    return String(val).trim();
  };

  console.log(SEPARATOR);
  console.log(`PROMPT ID: ${promptId}`);
  console.log(SEPARATOR);
  console.log('\n## Context\n');
  console.log(getText('context'));
  console.log('\n## Instructions\n');
  console.log(getText('instructions'));
  console.log('\n## Output Requirements\n');
  console.log(getText('output_requirements'));
  console.log(`\n${SEPARATOR}`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    // Print usage (first block comment of the file)
    console.log(
      `Usage:\n` +
      `  node extract_prompt.js <prompt_id>   Extract a prompt\n` +
      `  node extract_prompt.js --list        List all IDs\n` +
      `  node extract_prompt.js --help        Show this help`
    );
    process.exit(0);
  }

  const library = loadXml();

  if (args.includes('--list')) {
    listPrompts(library);
    return;
  }

  const ids = args.filter(a => !a.startsWith('--'));

  if (ids.length === 0) {
    console.error('ERROR: No prompt ID provided. Use --list to see available IDs.');
    process.exit(1);
  }

  for (const id of ids) {
    extractPrompt(library, id);
  }
}

main();
