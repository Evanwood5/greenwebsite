import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return Response.json({ companies: [] })

  const { data, error } = await supabaseAdmin
    .from('job_postings_ingest_test')
    .select('company_name')
    .ilike('company_name', `%${q}%`)
    .not('company_name', 'is', null)
    .limit(200)

  if (error) return Response.json({ companies: [] }, { status: 500 })

  const unique = [...new Set(
    (data ?? []).map((r: { company_name: string | null }) => r.company_name).filter(Boolean) as string[]
  )].sort().slice(0, 8)

  return Response.json({ companies: unique })
}
