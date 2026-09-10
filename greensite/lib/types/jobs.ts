// Stable IDs that never change — avoids async race condition on first load
// Other/Irrelevant field id from job_field_counts
export const IRRELEVANT_FIELD_ID = 29244

export const JOBS_PER_PAGE = 20

export interface Job {
  job_id: string
  created_at: string
  company_name: string | null
  job_title: string | null
  job_href: string | null
  job_type: string | null
  city: string | null
  state: string | null
  is_remote: boolean | null
  job_field_id: number | null
}

export interface FilterOptions {
  category: string
  subCategory: string
  level: string
  jobType: string
  isRemote: string
  city: string
  searchTerm: string
}

export const EMPTY_FILTERS: FilterOptions = {
  category: '',
  subCategory: '',
  level: '',
  jobType: '',
  isRemote: '',
  city: '',
  searchTerm: '',
}