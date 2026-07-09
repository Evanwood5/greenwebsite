// DEPRECATED: Route moved to app/api/analytics/counties/route.ts (lowercase)
// Redirecting to canonical lowercase path. This file can be deleted.
export async function GET(request: Request) {
  return Response.redirect(new URL('/api/analytics/counties', request.url), 308)
}
