import { supabase } from '@/lib/db/supabase'
import { MATCH_EXPIRY_DAYS, MatchRow } from '@/lib/types/matches'
// All database calls related to the user_job_matches table (resume-based
// matches for custom jobs). Matches expire after MATCH_EXPIRY_DAYS.

export async function getRecentMatchRows(userId: string): Promise<MatchRow[]> {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - MATCH_EXPIRY_DAYS)

  const { data, error } = await supabase
    .from('user_job_matches')
    .select('job_id, created_at')
    .eq('user_id', userId)
    .gte('created_at', cutoff.toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) 
}