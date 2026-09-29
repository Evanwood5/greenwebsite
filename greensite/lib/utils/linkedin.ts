const LINKEDIN_PEOPLE_SEARCH = 'https://www.linkedin.com/search/results/people/'

const LINKEDIN_ORIGIN = 'FACETED_SEARCH'

const LINKEDIN_GEO_URN = '%5B%22103051080%22%5D'

export function linkedInPeopleSearchUrl(companyName: string | null | undefined): string {
  const keywords = encodeURIComponent(companyName ?? '')
  return `${LINKEDIN_PEOPLE_SEARCH}?keywords=${keywords}&origin=${LINKEDIN_ORIGIN}&geoUrn=${LINKEDIN_GEO_URN}`
}
