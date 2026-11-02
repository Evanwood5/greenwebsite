# Color System

`app/globals.css` is the single source of truth for application colors. Components
must not contain literal hex, `rgb()`, or `hsl()` values. Run `npm run colors:check`
to enforce this.

## Layers

### 1. Primitives (`--palette-*`)

Raw values captured from the existing UI, one token per distinct color. They are
never merged, so Pass A keeps every screen pixel-identical. Names describe hue and
lightness (for example `--palette-forest-800`), not usage.

### 2. RGB channels (`--palette-*-rgb`)

Channel triplets used for translucent colors:

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

Role-based aliases layered over primitives. Prefer these in new code where the
role and theme are unambiguous. Existing Pass A markup mostly uses primitives to
guarantee exact values.

### 4. Theme scopes

Semantic tokens are redefined per product area. Apply the scope on an existing
wrapper element; no route-group layouts were added.

| Scope | Applied at | Palette |
| --- | --- | --- |
| `.theme-dashboard` | `components/layout/AppShell.tsx` (also the `:root` default) | dark neutral surfaces |
| `.theme-marketing-dark` | homepage root | black + white |
| `.theme-marketing-light` | `Navbar`, contact, how-it-works, terms, AI-powered hero | cream + forest |
| `.theme-auth` | auth page root | cream + forest |

`body` keeps its original `--background` / `--foreground` values.

### 5. Tailwind bridge (`@theme`)

Legacy utility classes such as `text-gray-600` and `bg-green-50` still appear in
the codebase. The `@theme` block pins those specific colors to Tailwind v4's
original values so they render exactly as before. New code should use the
primitive or semantic tokens instead of adding more palette utilities.

## Pass A / Pass B

Pass A centralizes colors without changing appearance, which is why near-duplicate
shades remain as separate primitives. Pass B can consolidate those shades once the
visual changes are approved. Do not merge primitives before that review.

## Audit

```bash
npm run colors:check
```

The audit fails on:

- literal hex / `rgb()` / `hsl()` colors outside `app/globals.css`
- obvious named CSS colors used as color values
- referenced custom properties that are not defined in `globals.css`
- Tailwind palette utilities missing from the `@theme` bridge
