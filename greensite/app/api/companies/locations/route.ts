import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase-admin'

/**
 * GET /api/companies/locations?company=<exact company_name>
 * Cities where the given company has job postings. Used by the Tracking page,
 * where the company is always picked from the /api/companies/list options,
 * so the name is matched exactly.
 *
 * Response: { cities: string[] }, sorted alphabetically.
 */

const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }

export async function GET(request: NextRequest) {
  const company = request.nextUrl.searchParams.get('company')?.trim()

  if (!company) {
    return NextResponse.json({ cities: [] })
  }

  const { data, error } = await supabaseAdmin.rpc('get_job_locations', { p_company: company })
  if (error) {
    console.error('[api/companies/locations] get_job_locations failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const cities = (data as { city: string }[]).map((r) => r.city)
  return NextResponse.json({ cities }, { headers: CACHE_HEADERS })
}
