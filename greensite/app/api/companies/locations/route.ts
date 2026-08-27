import { supabase } from '@/lib/db/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const company = searchParams.get('company')

  if (!company || company.trim().length < 2) {
    return Response.json({ cities: [] })
  }

  const { data, error } = await supabase
    .from('job_postings_ingest_test')
    .select('city')
    .ilike('company_name', `%${company.trim()}%`)
    .not('city', 'is', null)
    .neq('city', '')

  if (error) return Response.json({ cities: [] })

  const cities = [...new Set(data.map((r: any) => r.city).filter(Boolean))].sort()
  return Response.json({ cities })
}
