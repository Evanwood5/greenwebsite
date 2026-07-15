// DEPRECATED: Route moved to app/api/companies/search/route.ts (lowercase)
// Redirecting to canonical lowercase path. This file can be deleted.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const newUrl = new URL('/api/companies/search', request.url)
  const q = url.searchParams.get('q')
  if (q) newUrl.searchParams.set('q', q)
  return Response.redirect(newUrl.toString(), 308)
}
