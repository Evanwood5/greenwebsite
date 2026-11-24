import { Database } from '@/lib/supabase'
// Stable IDs that never change — avoids async race condition on first load
// Other/Irrelevant field id from job_field_counts

export const IRRELEVANT_FIELD_ID = 61

export const JOBS_PER_PAGE = 20

// The Jobs page lists postings from the last N days. Shared with the Jobs city
// dropdown (/api/cities?scope=listed) so it only offers cities with listed jobs.
export const JOBS_LISTING_WINDOW_DAYS = 30

export function jobsListingCutoff(): Date {
  return new Date(Date.now() - JOBS_LISTING_WINDOW_DAYS * 24 * 60 * 60 * 1000)
}

export type Job = Database['public']['Tables']['job_postings_ingest']['Row']

export interface FilterOptions {
  category: string
  subCategory: string
  level: string
  jobType: string
  isRemote: string
  location: string
  searchTerm: string
}

export const EMPTY_FILTERS: FilterOptions = {
  category: '',
  subCategory: '',
  level: '',
  jobType: '',
  isRemote: '',
  location: '',
  searchTerm: '',
}

export interface JobPage {
  data: Job[]
  count: number
  hasMore: boolean
}