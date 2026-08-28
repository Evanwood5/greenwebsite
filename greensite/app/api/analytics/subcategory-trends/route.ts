import { supabase } from '@/lib/db/supabase'
import { NextRequest } from 'next/server'

/**
 * GET /api/analytics/subcategory-trends?category=tech&location=MI:all&timeframe=1year
 * Returns real subcategory breakdown + weekly trend data for a given category.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? 'engineering'
  const location = searchParams.get('location') ?? ''
  const timeframe = searchParams.get('timeframe') ?? '1year'

  const dbCategory = category.charAt(0).toUpperCase() + category.slice(1)

  const timeframeDays: Record<string, number> = {
    '1month': 30,
    '6months': 180,
    '1year': 365,
  }
  const days = timeframeDays[timeframe] ?? 365
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

  const { data: jobs, error } = await query

  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Count jobs per subcategory
  const subcategoryCounts: Record<string, number> = {}
  ;(jobs ?? []).forEach((job: any) => {
    const sub = job.job_field_counts?.subcategory || 'Unknown'
    subcategoryCounts[sub] = (subcategoryCounts[sub] || 0) + 1
  })

  // Get top 8 subcategories sorted by count
  const topSubcategories = Object.entries(subcategoryCounts)
    .map(([subcategory, count]) => ({ subcategory, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const topNames = new Set(topSubcategories.map(s => s.subcategory))

  // Build weekly buckets over the timeframe
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

  // Count jobs per subcategory per week
  const trendData = weeks.map(({ label, start, end }) => {
    const point: Record<string, string | number> = { date: label }
    ;(jobs ?? []).forEach((job: any) => {
      const sub = job.job_field_counts?.subcategory
      if (!sub || !topNames.has(sub)) return
      const created = new Date(job.created_at)
      if (created >= start && created < end) {
        point[sub] = (point[sub] as number || 0) + 1
      }
    })
    // Fill in 0 for subcategories with no jobs that week
    topNames.forEach(name => {
      if (!(name in point)) point[name] = 0
    })
    return point
  })

  return Response.json({ topSubcategories, trendData })
}
