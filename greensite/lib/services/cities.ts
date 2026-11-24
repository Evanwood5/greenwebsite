// Client-side helpers for the city dropdowns. Unlike a bare fetch, these throw
// when the API fails, so a broken endpoint surfaces as an error instead of an
// empty dropdown.

async function getCities(url: string): Promise<string[]> {
  const res = await fetch(url)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(`${url} failed (${res.status}): ${body?.error ?? 'unknown error'}`)
  }
  return Array.isArray(body.cities) ? body.cities : []
}

/** Cities with any job posting (Analytics). */
export function fetchJobCities(): Promise<string[]> {
  return getCities('/api/cities')
}

/** Cities with postings the Jobs page lists (recent, not initial load, relevant field). */
export function fetchListedJobCities(): Promise<string[]> {
  return getCities('/api/cities?scope=listed')
}

/** Every Michigan city, including ones with no postings yet (resume matching preferences). */
export function fetchAllMichiganCities(): Promise<string[]> {
  return getCities('/api/cities?scope=all')
}

/** Cities where one company has job postings (Tracking). */
export function fetchCompanyCities(company: string): Promise<string[]> {
  return getCities(`/api/companies/locations?company=${encodeURIComponent(company)}`)
}
