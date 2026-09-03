import { supabase } from '@/lib/db/supabase'
import { SavedJob, JobStatus } from '@/app/saved/types'

// ── Saved Jobs Service ────────────────────────────────────────────────────────
// All database calls related to the saved_jobs table.

export async function getSavedJobs(userId: string): Promise<SavedJob[]> {
  const { data, error } = await supabase
    .from('saved_jobs')
    .select('id, saved_at, status, notes, job_id, job_postings_ingest_test(*)')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })

  if (error) throw error

  return (data ?? [])
    .map((row: any) => {
      const job = row.job_postings_ingest_test
      if (!job) return null
      return {
        saved_job_id: row.id,
        job_id:       job.job_id,
        saved_at:     row.saved_at,
        status:       (row.status ?? 'Saved') as JobStatus,
        notes:        row.notes ?? null,
        company_name: job.company_name,
        job_title:    job.job_title,
        job_href:     job.job_href,
        job_type:     job.job_type,
        city:         job.city,
        state:        job.state,
        is_remote:    job.is_remote,
      }
    })
    .filter(Boolean) as SavedJob[]
}

export async function updateJobStatus(savedJobId: number, status: JobStatus): Promise<void> {
  const { error } = await supabase
    .from('saved_jobs')
    .update({ status })
    .eq('id', savedJobId)
  if (error) throw error
}

export async function updateJobNotes(savedJobId: number, notes: string): Promise<void> {
  const { error } = await supabase
    .from('saved_jobs')
    .update({ notes })
    .eq('id', savedJobId)
  if (error) throw error
}

export async function deleteSavedJob(savedJobId: number): Promise<void> {
  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('id', savedJobId)
  if (error) throw error
}

export async function getSavedJobIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('saved_jobs')
    .select('job_id')
    .eq('user_id', userId)
  if (error) throw error
  return data?.map(r => r.job_id) ?? []
}

export async function toggleJobSaved(userId: string, jobId: string, willBeSaved: boolean): Promise<void> {
  if (willBeSaved) {
    const { error } = await supabase.from('saved_jobs').insert({ user_id: userId, job_id: jobId })
    if (error) throw error
  } else {
    const { error } = await supabase.from('saved_jobs').delete().eq('user_id', userId).eq('job_id', jobId)
    if (error) throw error
  }
}
