# Greenify Coding Standards

## Security
- Never import or use `SUPABASE_SERVICE_ROLE_KEY` in client components or any file prefixed with `'use client'`. It must only appear in server-side API routes or server utilities.

## Server vs Client
- `app/api/` — server-side HTTP endpoints (Next.js Route Handlers). These are the actual API routes your frontend calls over the network.
- `lib/services/` — functions that call Supabase directly. Imported by pages and server components.

## Database Types
- Always use `createClient<Database>` so table and column names are validated at compile time.
- When the schema changes, regenerate with: (admin command)
- TypeScript will immediately flag every broken reference.

## File Organization

Services — one file per domain area (jobs, profile, analytics, saved, etc). Named by what data they manage, not by what app page uses them.

Types — only create lib/types/<name>.ts when that type is imported by more than one file. Otherwise define it locally where it's used.

### `lib/services/<name>.ts` contains:
- All Supabase query functions
- Imports types from the matching `lib/types/` file
- Never defines its own interfaces — those belong in types
- Never imported directly by UI — pages import from services, services import from types

## Page Structure

| File | Responsibility |
|------|---------------|
| `page.tsx` | Who's logged in? Fetch data, own state, handle actions |
| `components.tsx` | How does it look? Receive data/callbacks as props, render UI |
| `lib/types/` | What shape is the data? TypeScript definitions only |
| `lib/services/` | How do we talk to the database? All Supabase calls live here |

## Functions
- Page-level components → `export default function`
- Internal handlers → `const` arrow functions

## Imports
- Always use `@/` alias (e.g. `@/lib/types/saved`) — never relative paths like `../../`. This keeps imports stable when files move.