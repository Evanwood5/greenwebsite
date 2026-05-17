'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'
import { DarkJobCard } from '@/components/jobs/JobList'
import { fetchFieldSubCategoryMap } from '@/lib/jobsApi'

interface SavedJob {
  job_id: string
  created_at: string
  company_name: string | null
  job_title: string | null
  job_href: string | null
  job_type: string | null
  city: string | null
  state: string | null
  is_remote: boolean | null
  saved_at: string
}

export default function SavedJobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fieldSubCategoryMap, setFieldSubCategoryMap] = useState<Record<number, string>>({})

  useEffect(() => {
    if (user?.id) loadSaved()
    else setLoading(false)
  }, [user?.id])

  const loadSaved = async () => {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    try {
      const [{ data, error: fetchError }, subCatMap] = await Promise.all([
        supabase
          .from('saved_jobs')
          .select('*, job_postings_ingest_test(*)')
          .eq('user_id', user.id)
          .order('saved_at', { ascending: false }),
        fetchFieldSubCategoryMap(),
      ])
      setFieldSubCategoryMap(subCatMap)

      if (fetchError) throw fetchError

      const mapped: SavedJob[] = (data ?? [])
        .map((row: any) => {
          const job = row.job_postings_ingest_test
          if (!job) return null
          return { ...job, saved_at: row.saved_at }
        })
        .filter(Boolean) as SavedJob[]

      setJobs(mapped)
    } catch (err: any) {
      console.error('Error loading saved jobs:', err)
      setError(err.message ?? 'Failed to load saved jobs')
    } finally {
      setLoading(false)
    }
  }

  const removeSaved = async (jobId: string) => {
    if (!user?.id) return
    await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', jobId)
    setJobs(prev => prev.filter(j => j.job_id !== jobId))
  }

  return (
    <AppShell>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '2px', letterSpacing: '-0.02em' }}>Saved Jobs</h1>
          <p style={{ color: '#52525b', fontSize: '12px' }}>
            {loading ? 'Loading...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} saved for later`}
          </p>
        </div>

        {error && (
          <div style={{ background: '#2a1a1a', border: '1px solid #7f1d1d', borderRadius: '10px', padding: '14px', marginBottom: '16px', color: '#fca5a5', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: '#0d0d0d', borderRadius: '10px', height: '180px', border: '1px solid rgba(255,255,255,0.07)' }} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{
            background: '#0d0d0d',
            borderRadius: '10px',
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <p style={{ color: 'white', fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>No saved jobs yet</p>
            <p style={{ color: '#52525b', fontSize: '12px' }}>
              Hit the red bookmark on any job to save it here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {jobs.map((job) => (
              <DarkJobCard
                key={job.job_id}
                job={job}
                showSave={false}
                showDelete={true}
                onDelete={() => removeSaved(job.job_id)}
                fieldSubCategoryMap={fieldSubCategoryMap}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
