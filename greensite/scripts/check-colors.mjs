#!/usr/bin/env node
/**
 * Color audit for the centralized color system.
 *
 * Fails when:
 *   1. A maintained source file contains a literal hex / rgb / hsl / oklch /
 *      color() value (including percent-encoded SVG colors).
 *   2. A source file uses a named CSS color as a color value, including inside
 *      gradients, shadows, borders, SVG attributes, and custom properties.
 *   3. A referenced CSS custom property is not defined in globals.css.
 *   4. A Tailwind palette utility is used without a matching @theme bridge entry.
 *
 * globals.css is the single source of truth. Literal values are allowed there
 * and only there; every other file must reference variables defined in it.
 *
 * Source discovery is automatic: any file with a source extension under the
 * project root is audited, except generated/vendor/asset/documentation folders.
 * New folders such as `styles/` or `hooks/` are therefore covered by default.
 *
 * Run with: npm run colors:check
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const SOURCE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css'])
const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  '.turbo',
  '.vercel',
  'dist',
  'build',
  'coverage',
  'public',
  'supabase',
  'documentation',
  'scripts',
])
const GLOBALS = join(ROOT, 'globals.css')

// Custom properties provided by Next.js / Tailwind at build time, not by globals.css.
const EXTERNAL_VARS = new Set(['--font-geist-sans', '--font-geist-mono'])

const HEX_RE =
  /(?<![0-9A-Za-z_])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-fA-F])/g
const PERCENT_HEX_RE =
  /%23(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-fA-F])/g
// Literal numeric channels: rgb(255 ...), hsl(120 ...), oklch(62% ...), etc.
const COLOR_FN_RE = /(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|device-cmyk)\(\s*[-+.\d]/gi
// color(display-p3 1 0 0) / color(srgb 0.1 0.2 0.3)
const COLOR_SPACE_FN_RE = /(?<![\w-])color\(\s*[a-z][\w-]*\s+[-+.\d]/gi

// Full CSS named-color keyword set. transparent / currentColor / inherit /
// initial / unset / revert / none are legitimate keywords and stay allowed.
const NAMED_COLORS = new Set(
  `aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue
  blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk
  crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki
  darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen
  darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue
  dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite
  gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki
  lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan
  lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen
  lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen
  magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen
  mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream
  mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid
  palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum
  powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown
  seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen
  steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow
  yellowgreen`.split(/\s+/)
)

const COLOR_PROP =
  '(?:color|background(?:Color)?|border(?:Top|Right|Bottom|Left)?Color|border|outline(?:Color)?|fill|stroke|stopColor|floodColor|lightingColor|caretColor|textDecorationColor|accentColor|boxShadow|textShadow|backgroundImage|filter|WebkitTextStrokeColor|columnRuleColor|textEmphasisColor)'
// Quoted style values such as color: 'red' or border: '1px solid red'.
const STYLE_COLOR_VALUE_RE = new RegExp(
  `(?<![\\w-])${COLOR_PROP}\\s*[:=]\\s*(['"\`])([^'"\`]*)\\1`,
  'gi'
)
// Quoted custom properties such as { '--chip': 'red' }.
const STYLE_CUSTOM_PROP_RE = /(['"])(--[A-Za-z0-9_-]+)\1\s*:\s*(['"])([^'"]*)\3/g
// CSS declarations such as `color: red;` or `--chip: red;`.
const CSS_COLOR_VALUE_RE = new RegExp(
  `(?:^|[;{])\\s*(?:${COLOR_PROP}|--[A-Za-z0-9_-]+)\\s*:\\s*([^;}\\n]+)`,
  'gi'
)
// Arbitrary Tailwind values such as bg-[red] or text-[color:red].
const TW_ARBITRARY_NAMED_RE = new RegExp(
  `(?<![\\w-])(?:bg|text|border|from|via|to|ring|ring-offset|shadow|fill|stroke|outline|decoration|divide|placeholder|accent|caret)-\\[(?:color:)?(${[...NAMED_COLORS].join('|')})\\]`,
  'gi'
)
const VAR_REF_RE = /var\(\s*(--[A-Za-z0-9_-]+)/g
const TW_UTILITY_RE =
  /(?<![\w-])(?:bg|text|border|from|via|to|ring|ring-offset|shadow|fill|stroke|outline|decoration|divide|placeholder|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-\d{2,3})?(?:\/\d{1,3})?(?![-\w])/g

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.') || SKIP_DIRS.has(entry)) continue
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

function readText(file) {
  const buffer = readFileSync(file)
  // lib/supabase.ts is UTF-16 LE; decode it so its contents are audited too.
  if (buffer[0] === 0xff && buffer[1] === 0xfe) return buffer.toString('utf16le')
  return buffer.toString('utf8')
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length
}

function namedColorsIn(value) {
  const withoutVarsAndUrls = value
    .replace(/var\([^)]*\)/g, ' ')
    .replace(/url\([^)]*\)/gi, ' ')
  const found = new Set()
  for (const match of withoutVarsAndUrls.matchAll(/\b([A-Za-z]+)\b/g)) {
    const word = match[1].toLowerCase()
    if (NAMED_COLORS.has(word)) found.add(word)
  }
  return [...found]
}

function collectDefinitions(css) {
  const defs = new Set()
  for (const match of css.matchAll(/(--[A-Za-z0-9_-]+)\s*:/g)) defs.add(match[1])
  return defs
}

const globalsCss = readText(GLOBALS)
const definedVars = collectDefinitions(globalsCss)

const themeColors = new Set(['white', 'black'])
for (const match of globalsCss.matchAll(/--color-([a-z]+-\d+)\s*:/g)) themeColors.add(match[1])

const sourceFiles = walk(ROOT)

const problems = new Set()
const referencedVars = new Map()
const usedUtilities = new Map()

function addProblem(message) {
  problems.add(message)
}

for (const file of sourceFiles) {
  const rel = relative(ROOT, file).split(sep).join('/')
  const text = readText(file)
  const isGlobals = file === GLOBALS

  if (!isGlobals) {
    for (const match of text.matchAll(HEX_RE)) {
      addProblem(`${rel}:${lineOf(text, match.index)} literal hex color "${match[0]}"`)
    }
    for (const match of text.matchAll(PERCENT_HEX_RE)) {
      addProblem(`${rel}:${lineOf(text, match.index)} encoded literal hex color "${match[0]}"`)
    }
    for (const match of text.matchAll(COLOR_FN_RE)) {
      addProblem(`${rel}:${lineOf(text, match.index)} literal color function "${match[0]}"`)
    }
    for (const match of text.matchAll(COLOR_SPACE_FN_RE)) {
      addProblem(`${rel}:${lineOf(text, match.index)} literal color function "${match[0]}"`)
    }
    for (const match of text.matchAll(STYLE_COLOR_VALUE_RE)) {
      for (const named of namedColorsIn(match[2])) {
        addProblem(`${rel}:${lineOf(text, match.index)} named color "${named}"`)
      }
    }
    for (const match of text.matchAll(STYLE_CUSTOM_PROP_RE)) {
      for (const named of namedColorsIn(match[4])) {
        addProblem(`${rel}:${lineOf(text, match.index)} named color "${named}" in custom property`)
      }
    }
    for (const match of text.matchAll(CSS_COLOR_VALUE_RE)) {
      for (const named of namedColorsIn(match[1])) {
        addProblem(`${rel}:${lineOf(text, match.index)} named color "${named}"`)
      }
    }
    for (const match of text.matchAll(TW_ARBITRARY_NAMED_RE)) {
      addProblem(`${rel}:${lineOf(text, match.index)} arbitrary Tailwind named color "${match[0]}"`)
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
      .replace(
        /^(?:bg|text|border|from|via|to|ring|ring-offset|shadow|fill|stroke|outline|decoration|divide|placeholder|accent|caret)-/,
        ''
      )
      .split('/')[0]
    if (!usedUtilities.has(base)) usedUtilities.set(base, new Set())
    usedUtilities.get(base).add(rel)
  }
}

for (const [name, files] of referencedVars) {
  if (!definedVars.has(name) && !EXTERNAL_VARS.has(name)) {
    addProblem(`undefined CSS variable "${name}" referenced in ${[...files].sort().join(', ')}`)
  }
}

for (const [base, files] of usedUtilities) {
  if (!themeColors.has(base)) {
    addProblem(
      `Tailwind palette "${base}" used in ${[...files].sort().join(', ')} is missing from the @theme bridge`
    )
  }
}

if (problems.size > 0) {
  console.error(`Color audit failed with ${problems.size} problem(s):\n`)
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log(
  `Color audit passed: ${sourceFiles.length} files, ${definedVars.size} defined variables, ` +
    `${referencedVars.size} referenced variables, ${usedUtilities.size} Tailwind palette utilities.`
)
