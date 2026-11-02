//shape definitions
export type JobStatus = 'Saved' | 'Applied' | 'Interview' | 'Offer'
import { Database } from '@/lib/supabase'

type JobRow = Database['public']['Tables']['job_postings_ingest']['Row']
export type SavedJobRow = Database['public']['Tables']['saved_jobs']['Row'] & {
  job_postings_ingest: Pick<JobRow, 'job_id' | 'company_name' | 'job_title' | 'job_href' | 'job_type' | 'locations' | 'is_remote'> | null
}

export interface SavedJob {
  saved_job_id: number
  job_id: string
  saved_at: string
  status: JobStatus
  notes: string | null
  company_name: string | null
  job_title: string | null
  job_href: string | null
  job_type: string | null
  locations: string[]
  
  is_remote: boolean | null
}

export const STATUS_OPTIONS: JobStatus[] = ['Saved', 'Applied', 'Interview', 'Offer']

export const STATUS_STYLE: Record<JobStatus, { color: string; background: string; border: string }> = {
  Saved:     { color: 'var(--palette-neutral-450)', background: 'var(--palette-neutral-820)', border: 'var(--palette-neutral-715)' },
  Applied:   { color: 'var(--palette-blue-400)', background: 'var(--palette-navy-800)', border: 'var(--palette-blue-700)' },
  Interview: { color: 'var(--palette-orange-400)', background: 'var(--palette-orange-950)', border: 'var(--palette-orange-700)' },
  Offer:     { color: 'var(--palette-green-400)', background: 'var(--palette-green-950)', border: 'var(--palette-green-700)' },
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
