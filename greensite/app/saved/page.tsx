'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/layout/AppShell'
import { getSavedJobs, deleteSavedJob } from '@/lib/services/savedJobs'
import { SavedJob, JobStatus } from './types'
import { StatCard, JobsTable } from './components'

export default function SavedJobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSaved = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getSavedJobs(user.id)
      setJobs(data)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load saved jobs')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) loadSaved()
    else setLoading(false)
  }, [user?.id, loadSaved])

  const handleStatusChange = (savedJobId: number, status: JobStatus) => {
    setJobs(prev => prev.map(j => j.saved_job_id === savedJobId ? { ...j, status } : j))
  }

  const handleDelete = async (savedJobId: number) => {
    await deleteSavedJob(savedJobId)
    setJobs(prev => prev.filter(j => j.saved_job_id !== savedJobId))
  }

  const counts = {
    total:     jobs.length,
    applied:   jobs.filter(j => j.status === 'Applied').length,
    interview: jobs.filter(j => j.status === 'Interview').length,
    offer:     jobs.filter(j => j.status === 'Offer').length,
  }

  return (
    <AppShell>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '2px', letterSpacing: '-0.02em' }}>Saved Jobs</h1>
          <p style={{ color: '#52525b', fontSize: '12px' }}>
            {loading ? 'Loading...' : `${counts.total} job${counts.total !== 1 ? 's' : ''} saved`}
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
          <StatCard label="Total Saved" count={counts.total}     color="#a1a1aa" />
          <StatCard label="Applied"     count={counts.applied}   color="#60a5fa" />
          <StatCard label="Interview"   count={counts.interview} color="#fb923c" />
          <StatCard label="Offer"       count={counts.offer}     color="#4ade80" />
        </div>

        {error && (
          <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '4px', padding: '14px', marginBottom: '16px', color: '#fca5a5', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ background: '#1e1e1e', borderRadius: '4px', height: '52px', border: '1px solid rgba(255,255,255,0.06)' }} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ background: '#1e1e1e', borderRadius: '4px', padding: '60px 20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color: '#e4e4e7', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>No saved jobs yet</p>
            <p style={{ color: '#52525b', fontSize: '12px' }}>Hit the bookmark on any job to save it here.</p>
          </div>
        ) : (
          <JobsTable jobs={jobs} onStatusChange={handleStatusChange} onDelete={handleDelete} />
        )}

      </div>
    </AppShell>
  )
}
