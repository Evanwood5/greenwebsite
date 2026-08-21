import { supabase } from '@/lib/db/supabase'
import { NextRequest } from 'next/server'

/**
 * GET /api/analytics/counties
 * Returns Michigan county job counts from the mi_counties table.
 * Response: { counties: { county: string, jobCount: number }[], maxJobs: number }
 */
export async function GET(_request: NextRequest) {
  const { data, error } = await supabase
    .from('mi_counties')
    .select('name, count_value')
    .order('count_value', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const counties = (data ?? []).map(row => ({
    county: row.name,
    jobCount: row.count_value ?? 0,
  }))

  const maxJobs = counties[0]?.jobCount || 1

  return Response.json({ counties, maxJobs })
}
