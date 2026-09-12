import { Database } from '@/lib/supabase'

export type MatchRow = Pick<Database['public']['Tables']['user_company_matches']['Row'], 'job_id' | 'created_at'>

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