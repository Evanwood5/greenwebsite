import { Database } from '@/lib/supabase'
export type { MatchedJob } from '@/lib/types/resume'
export { mergeMatchedJobs, errorMessage } from '@/lib/utils/resume'

export type MatchRow = Pick<Database['public']['Tables']['user_job_matches']['Row'], 'job_id' | 'created_at'>

export const MATCH_EXPIRY_DAYS = 7

export interface StatCardData {
  label: string
  value: string
  color: string
}