import { supabase } from '@/lib/db/supabase'
import { fetchJobsByIds } from '@/lib/services/jobs'
import { TrackedCompany, TrackingFilters, MatchRow } from '@/lib/types/tracking'
import { Job } from '@/lib/types/jobs'
import { Json } from '@/lib/supabase'


// All database calls related to company tracking (user_company_preferences)
// and daily matches (user_company_matches).

const MATCH_WINDOW_DAYS = 7


export async function listTrackedCompanies(userId: string): Promise<TrackedCompany[]> {
  const { data, error } = await supabase
    .from('user_company_preferences')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id,
    company_name: row.company_name,
    filters: row.filters as unknown as TrackingFilters,
    created_at: row.created_at ?? '',
  }))
}

export async function createTrackedCompany(
  userId: string,
  companyName: string,
  filters: TrackingFilters,
): Promise<TrackedCompany> {
  const { data, error } = await supabase
    .from('user_company_preferences')
    .insert({ user_id: userId, company_name: companyName, filters: filters as unknown as Json })
    .select()
    .single()

  if (error) throw error
  return {
  id: data.id,
  company_name: data.company_name,
  filters: data.filters as unknown as TrackingFilters,
  created_at: data.created_at,
} as TrackedCompany
}

export async function deleteTrackedCompany(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('user_company_preferences')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

export async function getMatchedJobs(userId: string, tracked: TrackedCompany[]): Promise<Job[]> {
  if (tracked.length === 0) return []

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - MATCH_WINDOW_DAYS)

  const { data: matchRows, error } = await supabase
    .from('user_company_matches')
    .select('job_id, created_at')
    .eq('user_id', userId)
    .gte('created_at', cutoff.toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error
  const matches = (matchRows ?? []) as MatchRow[]
  if (matches.length === 0) return []

  const jobIds = matches.map(m => m.job_id)
  const jobs = await fetchJobsByIds(jobIds)

  const trackedCompanyNames = tracked.map(t => t.company_name.toLowerCase())
  return jobs.filter(job => {
    const company = job.company_name?.toLowerCase() ?? ''
    return trackedCompanyNames.some(name =>
      company.includes(name) || name.includes(company),
    )
  })
}
