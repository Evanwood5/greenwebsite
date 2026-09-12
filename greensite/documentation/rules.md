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

**Services** (`lib/services/`) — one file per domain area (`jobs`, `profile`, `analytics`, `saved`, etc). Named by what data they manage, not by what app page uses them. Pages and components import from `lib/services/` only — Supabase never appears outside these files.

**Types** (`lib/types/`) — all types live in `lib/types/<domain>.ts`, regardless of how many files use them.

- **Database row types**: always derived from `Database['public']['Tables'][...]['Row']` in `lib/supabase.ts`
- **App-level types** (UI shapes, interfaces, enums): defined in the matching domain types file

**Utils** (`lib/utils/`) — pure helper functions and data constants with no DB calls. One file per domain area, mirroring the types folder. Imported by services, components, or pages as needed.

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