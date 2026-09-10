import { Database } from '@/lib/supabase'
// Stable IDs that never change — avoids async race condition on first load
// Other/Irrelevant field id from job_field_counts

export const IRRELEVANT_FIELD_ID = 35

export const JOBS_PER_PAGE = 20

export type Job = Database['public']['Tables']['job_postings_ingest_test']['Row']

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