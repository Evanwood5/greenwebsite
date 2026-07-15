import { supabaseAdmin } from '@/lib/db/supabase-admin'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''

  let query = supabaseAdmin
    .from('job_postings_ingest_test')
    .select('company_name')
    .not('company_name', 'is', null)
    .limit(1000)

  if (q) query = query.ilike('company_name', `%${q}%`)

  const { data, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const countMap: Record<string, number> = {}
  for (const row of data ?? []) {
    if (row.company_name) countMap[row.company_name] = (countMap[row.company_name] || 0) + 1
  }

  const companies = Object.entries(countMap)
    .map(([company, jobCount]) => ({ company, jobCount }))
    .sort((a, b) => b.jobCount - a.jobCount)
    .slice(0, 20)

  return Response.json({ companies })
}
