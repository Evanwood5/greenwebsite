export type JobStatus = 'Saved' | 'Applied' | 'Interview' | 'Offer'

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
  city: string | null
  state: string | null
  is_remote: boolean | null
}

export const STATUS_OPTIONS: JobStatus[] = ['Saved', 'Applied', 'Interview', 'Offer']

export const STATUS_STYLE: Record<JobStatus, { color: string; background: string; border: string }> = {
  Saved:     { color: '#9ca3af', background: '#1a1a1a', border: '#374151' },
  Applied:   { color: '#60a5fa', background: '#1e3a5f', border: '#1d4ed8' },
  Interview: { color: '#fb923c', background: '#3b1f0a', border: '#c2410c' },
  Offer:     { color: '#4ade80', background: '#052e16', border: '#15803d' },
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
