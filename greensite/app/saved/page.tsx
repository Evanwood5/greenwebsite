'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'
import { DarkJobCard } from '@/components/jobs/JobList'

interface SavedJob {
  id: number
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

function BookmarkIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  )
}

export default function SavedJobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) loadSaved()
    else setLoading(false)
  }, [user?.id])

  const loadSaved = async () => {
    if (!user?.id) return
    setLoading(true)

    try {
      const { data: savedRows } = await supabase
        .from('saved_jobs')
        .select('job_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!savedRows || savedRows.length === 0) {
        setJobs([])
        return
      }

      const jobIds = savedRows.map((r: any) => r.job_id)
      const { data: jobRows } = await supabase
        .from('job_postings_ingest_test')
        .select('*')
        .in('job_id', jobIds)

      if (jobRows) {
        const merged: SavedJob[] = savedRows
          .map((row: any) => {
            const job = (jobRows as any[]).find((j: any) => j.job_id === row.job_id)
            if (!job) return null
            return { ...job, id: job.id || job.job_id, saved_at: row.created_at }
          })
          .filter(Boolean) as SavedJob[]
        setJobs(merged)
      }
    } catch (err) {
      console.error('Error loading saved jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const removeSaved = async (jobId: number) => {
    if (!user?.id) return
    try {
      await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', jobId)
      setJobs(prev => prev.filter(j => j.id !== jobId))
    } catch (err) {
      console.error('Error removing saved job:', err)
    }
  }

  return (
    <AppShell>
      <div style={{ maxWidth: '1100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#1a8a0d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookmarkIcon />
          </div>
          <div>
            <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '2px' }}>Saved Jobs</h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              {loading ? 'Loading...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} saved for later`}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: '#1e1e1e', borderRadius: '14px', height: '220px', border: '1px solid #2a2a2a' }} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ background: '#1e1e1e', borderRadius: '14px', padding: '60px 20px', textAlign: 'center', border: '1px solid #2a2a2a' }}>
            <p style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No saved jobs yet</p>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Bookmark jobs from the dashboard to find them here later.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {jobs.map((job) => (
              <DarkJobCard
                key={job.id}
                job={job}
                showSave={false}
                showDelete={true}
                onDelete={() => removeSaved(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
