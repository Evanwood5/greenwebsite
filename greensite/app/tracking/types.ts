export const MAX_TRACKED = 5

export interface TrackedCompany {
  id: string
  company_name: string
  filters: TrackingFilters
  created_at: string
}

export interface TrackingFilters {
  category: string
  subcategories: string[]
  level: string
  jobType: string
  location: string
  city: string[]
}

export const EMPTY_FILTERS: TrackingFilters = {
  category: '',
  subcategories: [],
  level: '',
  jobType: '',
  location: '',
  city: [],
}

export interface DropdownOption {
  label: string
  value: string
}

export const sectionLabel: React.CSSProperties = {
  color: '#52525b',
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: '4px',
  marginTop: '12px',
}

export function filterSummary(filters: TrackingFilters): string {
  const parts: string[] = []
  if (filters.category) parts.push(filters.category)
  if (filters.subcategories?.length) parts.push(filters.subcategories.join(', '))
  if (filters.level) parts.push(filters.level)
  if (filters.jobType) parts.push(filters.jobType)
  if (filters.location === 'remote') parts.push('Remote')
  else if (filters.location === 'onsite') parts.push('On-site')
  if (filters.city?.length) parts.push(filters.city.join(', '))
  return parts.length ? parts.join(' \u00b7 ') : 'All jobs'
}