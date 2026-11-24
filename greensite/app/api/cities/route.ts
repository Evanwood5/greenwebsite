import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase-admin'
import { IRRELEVANT_FIELD_ID, jobsListingCutoff } from '@/lib/types/jobs'
import { FIELDS, Field, TIMEFRAME_DAYS, analyticsCutoff, fieldToCategory } from '@/lib/types/analytics'

/**
 * GET /api/cities               -> cities with any posting in job_postings_ingest
 *   &category=tech&timeframe=1year  optionally narrowed to one Analytics field
 *                                  and timeframe (Analytics)
 * GET /api/cities?scope=listed  -> cities with postings the Jobs page actually
 *                                  lists: recent, not initial load, not the
 *                                  irrelevant field (Jobs)
 * GET /api/cities?scope=all     -> every Michigan city (michigan_cities) plus any
 *                                  job city missing from it. Used for resume
 *                                  matching preferences, where users may pick a
 *                                  city before jobs are posted there.
 *
 * Response: { cities: string[] }, sorted alphabetically.
 */

// The list only changes when the scraper runs, so let the CDN cache it briefly.
const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }

type Scope = 'jobs' | 'listed' | 'all'

function parseScope(value: string | null): Scope {
  return value === 'listed' || value === 'all' ? value : 'jobs'
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const scope = parseScope(params.get('scope'))

  // Mirrors the always-on filters in fetchJobs (lib/services/jobs.ts).
  const listedFilters = {
    p_since: jobsListingCutoff().toISOString(),
    p_exclude_initial_load: true,
    p_exclude_field_id: IRRELEVANT_FIELD_ID,
  }

  // Mirrors getAnalytics (lib/services/analytics.ts): selected field + timeframe.
  const analyticsFilters: { p_category?: string; p_since?: string } = {}
  const field = params.get('category')
  if (field && FIELDS.includes(field as Field)) analyticsFilters.p_category = fieldToCategory(field as Field)
  const timeframe = params.get('timeframe')
  if (timeframe && timeframe in TIMEFRAME_DAYS) analyticsFilters.p_since = analyticsCutoff(timeframe).toISOString()

  const { data: jobRows, error: jobError } = await supabaseAdmin.rpc(
    'get_job_locations',
    scope === 'listed' ? listedFilters : scope === 'jobs' ? analyticsFilters : {},
  )
  if (jobError) {
    console.error('[api/cities] get_job_locations failed:', jobError)
    return NextResponse.json({ error: jobError.message }, { status: 500 })
  }
  const jobCities = (jobRows as { city: string }[]).map((r) => r.city)

  if (scope !== 'all') {
    return NextResponse.json({ cities: jobCities }, { headers: CACHE_HEADERS })
  }

  const { data: michiganRows, error: michiganError } = await supabaseAdmin
    .from('michigan_cities')
    .select('city_name')
  if (michiganError) {
    console.error('[api/cities] michigan_cities failed:', michiganError)
    return NextResponse.json({ error: michiganError.message }, { status: 500 })
  }

  const cities = [...new Set([...(michiganRows as { city_name: string }[]).map((r) => r.city_name), ...jobCities])]
    .sort((a, b) => a.localeCompare(b))

  return NextResponse.json({ cities }, { headers: CACHE_HEADERS })
}
