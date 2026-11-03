#!/usr/bin/env node
/**
 * Color audit for the centralized color system.
 *
 * Fails when:
 *   1. A maintained source file contains a literal hex / rgb / hsl color.
 *   2. A source file uses an obvious named CSS color as a color value.
 *   3. A referenced CSS custom property is not defined in app/globals.css.
 *   4. A Tailwind palette utility is used without a matching @theme bridge entry.
 *
 * Run with: npm run colors:check
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const SOURCE_DIRS = ['app', 'components', 'contexts', 'lib']
const SOURCE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css'])
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'public', 'supabase', 'documentation', 'scripts'])
const GLOBALS = join(ROOT, 'app', 'globals.css')

// Custom properties provided by Next.js / Tailwind at build time, not by globals.css.
const EXTERNAL_VARS = new Set(['--font-geist-sans', '--font-geist-mono'])

const HEX_RE = /(?<![0-9A-Za-z_])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-fA-F])/g
const COLOR_FN_RE = /(?:rgba?|hsla?)\(\s*\d/g
const NAMED_COLOR_RE =
  /(?:color|background|backgroundColor|borderColor|fill|stroke|stopColor|outlineColor|accentColor|boxShadow)\s*[:=]\s*['"](white|black|red|blue|green|gray|grey|orange|yellow|purple|pink|brown|cyan|magenta|lime|navy|teal|olive|maroon|silver|aqua|fuchsia)['"]/g
const VAR_REF_RE = /var\(\s*(--[A-Za-z0-9_-]+)/g
const TW_UTILITY_RE =
  /(?<![\w-])(?:bg|text|border|from|via|to|ring|ring-offset|shadow|fill|stroke|outline|decoration|divide|placeholder|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-\d{2,3})?(?:\/\d{1,3})?(?![-\w])/g

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      walk(full, files)
    } else if (SOURCE_EXTS.has(entry.slice(entry.lastIndexOf('.')))) {
      files.push(full)
    }
  }
  return files
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length
}

function collectDefinitions(css) {
  const defs = new Set()
  for (const match of css.matchAll(/(--[A-Za-z0-9_-]+)\s*:/g)) defs.add(match[1])
  return defs
}

const globalsCss = readFileSync(GLOBALS, 'utf8')
const definedVars = collectDefinitions(globalsCss)

const themeColors = new Set(['white', 'black'])
for (const match of globalsCss.matchAll(/--color-([a-z]+-\d+)\s*:/g)) themeColors.add(match[1])

const sourceFiles = SOURCE_DIRS.flatMap((dir) => {
  try {
    return walk(join(ROOT, dir))
  } catch {
    return []
  }
})

const problems = []
const referencedVars = new Map()
const usedUtilities = new Map()

for (const file of sourceFiles) {
  const rel = relative(ROOT, file).split(sep).join('/')
  const text = readFileSync(file, 'utf8')
  const isGlobals = file === GLOBALS

  if (!isGlobals) {
    for (const match of text.matchAll(HEX_RE)) {
      problems.push(`${rel}:${lineOf(text, match.index)} literal hex color "${match[0]}"`)
    }
    for (const match of text.matchAll(COLOR_FN_RE)) {
      problems.push(`${rel}:${lineOf(text, match.index)} literal color function "${match[0]}"`)
    }
    for (const match of text.matchAll(NAMED_COLOR_RE)) {
      problems.push(`${rel}:${lineOf(text, match.index)} named color "${match[1]}"`)
    }
  }

  for (const match of text.matchAll(VAR_REF_RE)) {
    const name = match[1]
    if (name.endsWith('-')) continue // comment placeholder such as var(--palette-*-rgb)
    if (!referencedVars.has(name)) referencedVars.set(name, new Set())
    referencedVars.get(name).add(rel)
  }

  for (const match of text.matchAll(TW_UTILITY_RE)) {
    const base = match[0]
      .replace(/^(?:bg|text|border|from|via|to|ring|ring-offset|shadow|fill|stroke|outline|decoration|divide|placeholder|accent|caret)-/, '')
      .split('/')[0]
    if (!usedUtilities.has(base)) usedUtilities.set(base, new Set())
    usedUtilities.get(base).add(rel)
  }
}

for (const [name, files] of referencedVars) {
  if (!definedVars.has(name) && !EXTERNAL_VARS.has(name)) {
    problems.push(`undefined CSS variable "${name}" referenced in ${[...files].sort().join(', ')}`)
  }
}

for (const [base, files] of usedUtilities) {
  if (!themeColors.has(base)) {
    problems.push(`Tailwind palette "${base}" used in ${[...files].sort().join(', ')} is missing from the @theme bridge`)
  }
}

if (problems.length > 0) {
  console.error(`Color audit failed with ${problems.length} problem(s):\n`)
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log(
  `Color audit passed: ${sourceFiles.length} files, ${definedVars.size} defined variables, ` +
    `${referencedVars.size} referenced variables, ${usedUtilities.size} Tailwind palette utilities.`
)
