import { supabaseAdmin } from '@/lib/db/supabase-admin'
import { NextRequest } from 'next/server'

export async function GET(_request: NextRequest) {
  const { data, error } = await supabaseAdmin
    .from('mi_counties')
    .select('name, count_value')
    .order('count_value', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const counties = (data ?? []).map(row => ({
    county: row.name,
    jobCount: row.count_value ?? 0,
  }))

  return Response.json({ counties, maxJobs: counties[0]?.jobCount || 1 })
}
