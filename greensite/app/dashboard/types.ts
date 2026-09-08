export type Field = 'tech' | 'engineering' | 'business' | 'health'

export const TIMEFRAMES: { value: string; label: string }[] = [
  { value: '1month', label: 'Past 1 Month' },
  { value: '6months', label: 'Past 6 Months' },
  { value: '1year', label: 'Past 1 Year' },
]

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
