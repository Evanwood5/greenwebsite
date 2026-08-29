1. Never import or use SUPABASE_SERVICE_ROLE_KEY in client components or any file prefixed with 'use client'. It must only appear in server-side API routes or server utilities.

2. server-side vs client side
- app/api/ = server-side HTTP endpoints (Next.js Route Handlers). These are the actual API routes your frontend calls over the network. They need to stay.
- lib/services/ = client-side abstractions that call those API routes (or Supabase directly from server components).

3. 