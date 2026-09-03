import { supabase } from '@/lib/db/supabase'
import { IRRELEVANT_FIELD_ID, FilterOptions, Job } from '@/app/jobs/types'

// ── Jobs Service ──────────────────────────────────────────────────────────────
// All database calls related to fetching and filtering job postings,
// resolving field ids, and saved-job membership.

export async function getFieldMaps(): Promise<{ category: Record<number, string>; subCategory: Record<number, string> }> {
  const { data } = await supabase
    .from('job_field_counts')
    .select('id, category, subcategory')

  const category: Record<number, string> = {}
  const subCategory: Record<number, string> = {}
  data?.forEach(r => {
    category[r.id] = r.category.toLowerCase()
    subCategory[r.id] = r.subcategory
  })
  return { category, subCategory }
}

export async function resolveFieldIds(category: string, subCategory: string): Promise<number[]> {
  if (!category) return []
  let query = supabase
    .from('job_field_counts')
    .select('id')
    .ilike('category', category)
  if (subCategory) query = query.eq('subcategory', subCategory)
  const { data } = await query
  return data?.map(r => r.id) ?? []
}

export interface JobPage {
  data: Job[]
  count: number
  hasMore: boolean
}

export async function fetchJobs(filters: FilterOptions, fieldIds: number[], from: number, to: number): Promise<JobPage> {
  let query = supabase
    .from('job_postings_ingest_test')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .eq('is_relevant', true)
    .neq('job_field_id', IRRELEVANT_FIELD_ID)

  if (filters.searchTerm) query = query.or(`job_title.ilike.%${filters.searchTerm}%,company_name.ilike.%${filters.searchTerm}%`)
  if (filters.category) {
    if (fieldIds.length > 0) query = query.in('job_field_id', fieldIds)
    else query = query.eq('job_field_id', -1)
  }
  if (filters.level) query = query.eq('experience_level', filters.level)
  if (filters.jobType) query = query.eq('job_type', filters.jobType)
  if (filters.city) query = query.eq('city', filters.city)
  if (filters.isRemote === 'remote') query = query.eq('is_remote', true)
  else if (filters.isRemote === 'onsite') query = query.eq('is_remote', false)

  query = query.range(from, to)

  const { data, error, count } = await query
  if (error) throw error

  return {
    data: (data ?? []) as Job[],
    count: count || 0,
    hasMore: count ? (to + 1) < count : false,
  }
}

export async function countJobsSince(filters: FilterOptions, fieldIds: number[], date: Date): Promise<number> {
  let query = supabase
    .from('job_postings_ingest_test')
    .select('*', { count: 'exact', head: true })
    .eq('is_relevant', true)
    .neq('job_field_id', IRRELEVANT_FIELD_ID)
    .gte('created_at', date.toISOString())

  if (filters.searchTerm) query = query.or(`job_title.ilike.%${filters.searchTerm}%,company_name.ilike.%${filters.searchTerm}%`)
  if (filters.category) {
    if (fieldIds.length > 0) query = query.in('job_field_id', fieldIds)
    else query = query.eq('job_field_id', -1)
  }
  if (filters.level) query = query.eq('experience_level', filters.level)
  if (filters.jobType) query = query.eq('job_type', filters.jobType)
  if (filters.city) query = query.eq('city', filters.city)
  if (filters.isRemote === 'remote') query = query.eq('is_remote', true)
  else if (filters.isRemote === 'onsite') query = query.eq('is_remote', false)

  const { error, count } = await query
  if (error) throw error
  return count || 0
}