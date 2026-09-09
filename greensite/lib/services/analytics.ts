import { supabase } from '@/lib/db/supabase'
import { Field, AnalyticsData, SubcategoryTrendData } from '@/app/dashboard/types'

// All database calls related to analytics data (trends, counties, subcategories).

interface SubcategoryTrendRow {
  created_at: string
  job_field_counts: { category: string; subcategory: string } | null
}

const TIMEFRAME_DAYS: Record<string, number> = {
  '1month': 30,
  '6months': 180,
  '1year': 365,
}

export async function getAnalytics(field: Field, location: string, timeframe: string): Promise<AnalyticsData> {
  const category = field.charAt(0).toUpperCase() + field.slice(1)
  const days = TIMEFRAME_DAYS[timeframe] ?? 365
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  let query = supabase
    .from('job_postings_ingest_test')
    .select(`
      *,
      job_field_counts!inner (
        id,
        category,
        subcategory
      )
    `)
    .eq('job_field_counts.category', category)
    .gte('created_at', cutoffDate.toISOString())

  if (location) {
    query = query.eq('city', location)
  }

  const { data: jobs, error } = await query
  if (error) throw error

  const totalJobs = jobs?.length || 0

  const companyCounts = jobs?.reduce((acc: Record<string, number>, job) => {
    const company = job.company_name || 'Unknown'
    acc[company] = (acc[company] || 0) + 1
    return acc
  }, {})

  const allCompanies = Object.entries(companyCounts || {})
    .map(([company, jobCount]) => ({ company, jobCount }))
    .sort((a, b) => b.jobCount - a.jobCount)

  const totalCompanies = Object.keys(companyCounts || {}).length

  const experienceLevels = jobs?.reduce((acc: Record<string, number>, job) => {
    const level = job.experience_level || 'N/A'
    acc[level] = (acc[level] || 0) + 1
    return acc
  }, {})

  const jobTypes = jobs?.reduce((acc: Record<string, number>, job) => {
    const type = job.job_type || 'Unknown'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const cityCounts = jobs?.reduce((acc: Record<string, number>, job) => {
    const city = job.city || 'Unknown'
    acc[city] = (acc[city] || 0) + 1
    return acc
  }, {})

  const allCities = Object.entries(cityCounts || {})
    .map(([name, jobCount]) => ({ name, jobCount }))
    .sort((a, b) => b.jobCount - a.jobCount)

  const subcategoryCounts = jobs?.reduce((acc: Record<string, number>, job) => {
    const subcategory = job.job_field_counts?.subcategory || 'Unknown'
    acc[subcategory] = (acc[subcategory] || 0) + 1
    return acc
  }, {})

  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  const lastMonthDate = new Date(thisYear, thisMonth - 1, 1)
  const lastMonth = lastMonthDate.getMonth()
  const lastMonthYear = lastMonthDate.getFullYear()

  const thisMonthJobs = jobs?.filter(job => {
    const created = new Date(job.created_at)
    return created.getMonth() === thisMonth && created.getFullYear() === thisYear
  }).length || 0

  const lastMonthJobs = jobs?.filter(job => {
    const created = new Date(job.created_at)
    return created.getMonth() === lastMonth && created.getFullYear() === lastMonthYear
  }).length || 0

  const percentChange = lastMonthJobs > 0
    ? Math.round(((thisMonthJobs - lastMonthJobs) / lastMonthJobs) * 100)
    : 0

  const recentJobs = jobs?.filter(job => {
    const created = new Date(job.created_at)
    return created >= cutoffDate
  }) || []

  const jobsByDate: { [date: string]: number } = {}
  recentJobs.forEach(job => {
    const date = new Date(job.created_at)
    const dateKey = `${date.getMonth() + 1}/${date.getDate()}`
    jobsByDate[dateKey] = (jobsByDate[dateKey] || 0) + 1
  })

  const trendDays = Math.min(days, 90)
  const trendData = []
  for (let i = trendDays - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = `${date.getMonth() + 1}/${date.getDate()}`
    trendData.push({ date: dateKey, count: jobsByDate[dateKey] || 0 })
  }

  return {
    category: field,
    totalJobs,
    topCompanies: allCompanies.slice(0, 5),
    allCompanies,
    totalCompanies,
    experienceLevels,
    jobTypes,
    topCities: allCities.slice(0, 5),
    allCities,
    subcategoryCounts,
    monthlyStats: {
      totalJobs: thisMonthJobs,
      percentChange,
      previousMonth: lastMonthJobs,
    },
    trendData,
  }
}

export async function getSubcategoryTrends(
  category: string,
  location: string,
  timeframe: string,
): Promise<SubcategoryTrendData> {
  const dbCategory = category.charAt(0).toUpperCase() + category.slice(1)
  const days = TIMEFRAME_DAYS[timeframe] ?? 365
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  let query = supabase
    .from('job_postings_ingest_test')
    .select(`
      created_at,
      job_field_counts!inner (
        category,
        subcategory
      )
    `)
    .eq('job_field_counts.category', dbCategory)
    .gte('created_at', cutoffDate.toISOString())

  if (location) {
    query = query.eq('city', location)
  }

  const { data, error } = await query
  if (error) throw error
  const jobs = (data ?? []) as unknown as SubcategoryTrendRow[]

  const subcategoryCounts: Record<string, number> = {}
  ;jobs.forEach((job) => {
    const sub = job.job_field_counts?.subcategory || 'Unknown'
    subcategoryCounts[sub] = (subcategoryCounts[sub] || 0) + 1
  })
  const topSubcategories = Object.entries(subcategoryCounts)
    .map(([subcategory, count]) => ({ subcategory, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const topNames = new Set(topSubcategories.map(s => s.subcategory))

  const weekCount = Math.min(Math.ceil(days / 7), 52)
  const weeks: { label: string; start: Date; end: Date }[] = []
  for (let i = weekCount - 1; i >= 0; i--) {
    const end = new Date()
    end.setDate(end.getDate() - i * 7)
    const start = new Date(end)
    start.setDate(start.getDate() - 7)
    const label = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    weeks.push({ label, start, end })
  }

  const trendData = weeks.map(({ label, start, end }) => {
    const point: Record<string, string | number> = { date: label }
    ;jobs.forEach((job) => {
      const sub = job.job_field_counts?.subcategory
      if (!sub || !topNames.has(sub)) return
      const created = new Date(job.created_at)
      if (created >= start && created < end) {
        point[sub] = (point[sub] as number || 0) + 1
      }
    })
    topNames.forEach(name => {
      if (!(name in point)) point[name] = 0
    })
    return point
  })

  return { topSubcategories, trendData }
}
