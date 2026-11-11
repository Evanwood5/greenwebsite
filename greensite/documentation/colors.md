# Color System

`globals.css` at the project root is the single source of truth for application colors. Components
must not contain literal hex, `rgb()`, or `hsl()` values. Run `npm run colors:check`
to enforce this.

## Layers

### 1. Primitives (`--palette-*`)

Raw values captured from the existing UI. Pass A kept every distinct color so the
UI stayed pixel-identical. Pass B merged only near-identical shades that serve the
same purpose (see [Pass B merges](#pass-b-merges)); the remaining primitives are
**80 hex colors**.

Names describe hue and lightness (for example `--palette-forest-800`), not usage.
Semantic roles belong on the semantic layer below.

### 2. RGB channels (`--palette-*-rgb`)

Channel triplets used for translucent colors (**26 tokens**):

```css
rgb(var(--palette-white-rgb) / 0.06)
```

Add a channel token only when a translucent variant of that primitive is needed.
This keeps one variable per color instead of one per opacity.

For dynamic values, store the channel token in data and compose at render time:

```ts
colorRgb: 'var(--palette-blue-500-rgb)'
// ...
background: `rgb(${colorRgb} / 0.12)`
```

Canvas cannot resolve CSS variables, so `MoleculeBackground` reads
`--palette-white-rgb` once via `getComputedStyle` and emits `rgba(r, g, b, a)`.

### 3. Semantic tokens (`--surface-*`, `--text-*`, `--border-*`, `--accent*`, `--status-*`, `--overlay`)

Role-based aliases layered over primitives (**25 roles**). Prefer these in new code
where the role and theme are unambiguous. Existing Pass A markup mostly uses
primitives to guarantee exact values.

`body` uses `--surface-app` and `--text-primary` directly. Those resolve to
`--palette-neutral-950` / `--palette-neutral-50` at `:root`, which are the exact
values the removed `--background` / `--foreground` aliases held, so body defaults
and theme behavior are unchanged.

### 4. Theme scopes

Semantic tokens are redefined per product area. Apply the scope on an existing
wrapper element; no route-group layouts were added.

| Scope | Applied at | Palette |
| --- | --- | --- |
| `.theme-dashboard` | `components/layout/AppShell.tsx` (also the `:root` default) | dark neutral surfaces |
| `.theme-marketing-dark` | homepage root | black + white |
| `.theme-marketing-light` | `Navbar`, contact, how-it-works, terms, AI-powered hero | cream + forest |
| `.theme-auth` | auth page root | cream + forest |

Dark-surface layering is intentionally shallow: app (`neutral-950`), panel
(`neutral-850`), and raised/elevated (`neutral-800`). Pass B collapsed the former
`#1a1a1a` / `#1a1b1e` elevated steps into `neutral-800`; the remaining step
difference is 4 RGB units and the app → panel → raised hierarchy is preserved.

### 5. Tailwind bridge (`@theme`)

Legacy utility classes such as `text-gray-600` and `bg-green-50` still appear in
the codebase. The `@theme` block pins those specific colors to Tailwind v4's
original values so they render exactly as before. New code should use the
primitive or semantic tokens instead of adding more palette utilities.

## Pass B merges

Approved low-risk and dark-surface consolidations. Values are shown as
`removed → survivor`.

| Removed | Value | Survivor | Value | Purpose |
| --- | --- | --- | --- | --- |
| `neutral-55` | `#f9fafb` | `neutral-50` | `#fafafa` | light card header |
| `neutral-150` | `#e5e7eb` | `neutral-200` | `#e4e4e7` | light border |
| `neutral-300` | `#d4d4d8` | `neutral-200` | `#e4e4e7` | dark menu label |
| `neutral-525` | `#6b7280` | `neutral-500` | `#71717a` | secondary text |
| `neutral-705` | `#3f3f3f` | `neutral-700` | `#3f3f46` | dark UI text |
| `neutral-710` | `#3a3a3a` | `neutral-700` | `#3f3f46` | terminal title |
| `neutral-810` | `#1a1b1e` | `neutral-800` | `#1e1e1e` | marketing card surface |
| `neutral-820` | `#1a1a1a` | `neutral-800` | `#1e1e1e` | elevated surface / dark text |
| `neutral-830` | `#161616` | `neutral-850` | `#141414` | nav shadow |
| `neutral-860` | `#111111` | `neutral-850` | `#141414` | table / panel surface |
| `neutral-870` | `#0d0d0d` | `neutral-900` | `#0a0a0a` | chart stroke / table |
| `neutral-875` | `#0e0e0e` | — | — | unused hex; removed |
| `neutral-875-rgb` | `14 14 14` | `neutral-950-rgb` | `8 8 8` | translucent nav |
| `neutral-820-rgb` | `26 26 26` | `neutral-800-rgb` | `30 30 30` | translucent menu |
| `forest-925` | `#0a1208` | `forest-950` | `#050a05` | wrapper background |
| `forest-980` | `#0a1f0a` | `forest-900` | `#0f2510` | contact feature background |
| `forest-990` | `#0a1f0d` | `forest-900` | `#0f2510` | CTA card background |
| `green-55` | `#f0fdf0` | `green-50` | `#f0fdf4` | fresh card header |

Net change: **16 hex primitives and 2 RGB channels removed** (96 → 80 hex,
28 → 26 RGB). No semantic role was removed; `--background` / `--foreground` were
replaced by existing `--surface-app` / `--text-primary` with identical computed
values.

## Preserved near-duplicates

These pairs remain because they encode a real role or theme difference. Do not
merge them without a design review.

| Token(s) | Reason |
| --- | --- |
| `neutral-450` (`#9ca3af`) | Saved status text and muted labels; kept distinct from `neutral-400` (ΔE ≈ 3.0) so status styling stays intentional. |
| `neutral-715` (`#374151`) | Blue-gray Saved badge border and chip text; kept separate from `neutral-700`. |
| `neutral-720` (`#333333`) | Analytics chart grid stroke; kept separate from `neutral-750` for chart readability. |
| `neutral-475` (`#888888`) | Analytics axis labels/ticks; distinct muted role from `neutral-450`. |
| `neutral-840` (`#111827`) | Dark navy card text; distinct from `neutral-800` on light cards. |
| `navy-850` (`#1f2937`) | Dark slate role text in the AI-powered profile card. |
| `green-450` (`#22c55e`) | Tracking success indicator. |
| `green-550` (`#1a8a0d`) | Auth CTA/link green and navbar accent. |
| `green-650` (`#1f6b1a`) | Auth success message text. |
| `blue-300` (`#93c5fd`) | Jobs stat color. |
| `neutral-900` / `neutral-950` (ΔE ≈ 0.55) | Marketing panel vs app background; kept to preserve named surface roles. |
| `neutral-800` / `neutral-850` (ΔE ≈ 4.9) | Raised surface vs panel/app background; keeps dark-surface hierarchy. |
| `neutral-50` / `neutral-100` (ΔE ≈ 2.4) | Primary text vs hover/chip surface; different roles. |
| `neutral-720` / `neutral-750` (ΔE ≈ 4.2) | Chart grid vs dark card border/background. |
| `cream-50` / `cream-100` / `cream-150` / `cream-200` | Four light-surface layers (app, panel/active, raised, elevated/hover) used across marketing light and auth. |
| `forest-700` / `forest-900` (ΔE ≈ 4.6) | Light-theme primary text vs dark feature background. |

## Accessibility notes

Pass B does not change any foreground/background pairing enough to cross a WCAG
threshold. `neutral-525 → neutral-500` keeps the same measured contrast
(4.83:1 on white, 4.10:1 on `cream-50`).

Pre-existing issues, reported separately and intentionally left unchanged:

- `forest-300` on `cream-50`: ≈ 2.65:1 (muted text; used only for low-emphasis copy).
- `forest-400` on `cream-50`: ≈ 4.08:1.
- `neutral-500` on `cream-50` / `cream-200`: ≈ 4.10:1 / 4.42:1.
- `amber-500` on `cream-50`: ≈ 1.82:1 (decorative/status accent, not body copy).
- `cyan-500` on `cream-50`: ≈ 2.06:1.
- `blue-500` on `cream-50`: ≈ 3.12:1.
- `green-550` on `cream-50`: ≈ 3.80:1; white on `green-550`: ≈ 4.48:1 (auth
  CTA/link). Darker auth text uses `green-650` (≈ 5.61:1 on cream).

## Audit

```bash
npm run colors:check
```

The audit discovers source files automatically from the project root, so new
folders such as `styles/` or `hooks/` are covered without changing the script.
It skips generated output, vendor code, static assets, documentation, and the
audit script itself. `globals.css` is the only file allowed to contain literal
color values.

The audit fails on:

- literal hex colors, including percent-encoded SVG colors (`%23ff0000`)
- literal `rgb()` / `hsl()` / `hwb()` / `lab()` / `lch()` / `oklab()` /
  `oklch()` / `color()` / `device-cmyk()` values
- any CSS named color used as a value, including inside gradients, shadows,
  borders, SVG attributes, and custom properties
- arbitrary Tailwind named colors such as `bg-[red]`
- referenced custom properties that are not defined in `globals.css`
- Tailwind palette utilities missing from the `@theme` bridge

`transparent`, `currentColor`, `inherit`, `initial`, `unset`, `revert`, and
`none` remain valid keywords and are not flagged.
