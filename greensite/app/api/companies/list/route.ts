import { supabaseAdmin } from '@/lib/db/supabase-admin'

const PAGE_SIZE = 1000

/**
 * GET /api/companies/list
 * Returns every distinct company name in job_postings_ingest_test, sorted alphabetically.
 * Response: { companies: string[] }
 */
export async function GET() {
  const seen = new Set<string>()
  let offset = 0

  while (true) {
    const { data, error } = await supabaseAdmin
      .from('job_postings_ingest_test')
      .select('company_name')
      .not('company_name', 'is', null)
      .order('company_name')
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) return Response.json({ error: error.message }, { status: 500 })
    if (!data || data.length === 0) break

    for (const row of data) {
      const name = typeof row.company_name === 'string' ? row.company_name.trim() : ''
      if (name) seen.add(name)
    }

    if (data.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  const companies = [...seen].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
  return Response.json({ companies })
}
