// DEPRECATED: Route moved to app/api/analytics/subcategory-trends/route.ts (lowercase)
// Redirecting to canonical lowercase path. This file can be deleted.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const newUrl = new URL('/api/analytics/subcategory-trends', request.url)
  const category = url.searchParams.get('category')
  if (category) newUrl.searchParams.set('category', category)
  return Response.redirect(newUrl.toString(), 308)
}
