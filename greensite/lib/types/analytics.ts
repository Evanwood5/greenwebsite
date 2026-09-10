import { Database } from '@/lib/supabase'

export type Field = 'tech' | 'engineering' | 'business' | 'health'

export type SubcategoryTrendRow = 
  Pick<Database['public']['Tables']['job_postings_ingest_test']['Row'], 'created_at'> & {
    job_field_counts: Pick<Database['public']['Tables']['job_field_counts']['Row'], 'category' | 'subcategory'> | null
  }

export const TIMEFRAMES: { value: string; label: string }[] = [
  { value: '1month', label: 'Past 1 Month' },
  { value: '6months', label: 'Past 6 Months' },
  { value: '1year', label: 'Past 1 Year' },
]

export const TIMEFRAME_DAYS: Record<string, number> = {
  '1month': 30,
  '6months': 180,
  '1year': 365,
}


export interface City {
  name: string
  jobCount: number
}

export interface Company {
  company: string
  jobCount: number
}

export interface SubcategoryCount {
  subcategory: string
  count: number
}

export interface AnalyticsData {
  category: string
  totalJobs: number
  topCompanies: Company[]
  allCompanies: Company[]
  totalCompanies: number
  experienceLevels: Record<string, number>
  jobTypes: Record<string, number>
  topCities: City[]
  allCities: City[]
  subcategoryCounts: Record<string, number>
  monthlyStats: { totalJobs: number; percentChange: number; previousMonth: number }
  trendData: { date: string; count: number }[]
}

export interface SubcategoryTrendData {
  topSubcategories: SubcategoryCount[]
  trendData: Record<string, string | number>[]
}

export interface CityOption {
  value: string
  label: string
}
