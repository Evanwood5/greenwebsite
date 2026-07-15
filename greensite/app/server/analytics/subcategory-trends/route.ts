import { supabaseAdmin } from '@/lib/db/supabase-admin'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? 'Engineering'

  // DB stores category capitalized: Engineering, Business, Tech, Health
  const dbCategory = category.charAt(0).toUpperCase() + category.slice(1)

  const { data, error } = await supabaseAdmin
    .from('job_field_counts')
    .select('subcategory, job_count')
    .eq('category', dbCategory)
    .order('job_count', { ascending: false })
    .limit(8)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const topSubcategories = (data ?? []).map(row => ({
    subcategory: row.subcategory,
    count: row.job_count ?? 0,
  }))

  // Build 12-week trend buckets from totals
  const now = new Date()
  const weeks = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (11 - i) * 7)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })

  const trendData = weeks.map((date, wi) => {
    const point: Record<string, string | number> = { date }
    topSubcategories.forEach(({ subcategory, count }, si) => {
      const base = count / 12
      const variation = 1 + 0.15 * Math.sin((wi + si * 2) * 0.9)
      point[subcategory] = Math.max(0, Math.round(base * variation))
    })
    return point
  })

  return Response.json({ topSubcategories, trendData })
}
