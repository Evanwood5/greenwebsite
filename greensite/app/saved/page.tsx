'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'

// ── Types ─────────────────────────────────────────────────────────────────────

type JobStatus = 'Saved' | 'Applied' | 'Interview' | 'Offer'

interface SavedJob {
  saved_job_id: number     // saved_jobs.id — used for API calls
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

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: JobStatus[] = ['Saved', 'Applied', 'Interview', 'Offer']

const STATUS_STYLE: Record<JobStatus, { color: string; background: string; border: string }> = {
  Saved:     { color: '#9ca3af', background: '#1a1a1a', border: '#374151' },
  Applied:   { color: '#60a5fa', background: '#1e3a5f', border: '#1d4ed8' },
  Interview: { color: '#fb923c', background: '#3b1f0a', border: '#c2410c' },
  Offer:     { color: '#4ade80', background: '#052e16', border: '#15803d' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{
      background: '#0d0d0d',
      border: `1px solid ${color}33`,
      borderRadius: '10px',
      padding: '16px 20px',
      minWidth: 0,
    }}>
      <p style={{ color, fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '6px', textTransform: 'uppercase' }}>
        {label}
      </p>
      <p style={{ color, fontSize: '28px', fontWeight: 700, lineHeight: 1 }}>{count}</p>
    </div>
  )
}

// ── Status Dropdown ───────────────────────────────────────────────────────────

function StatusDropdown({
  savedJobId,
  current,
  onChange,
}: {
  savedJobId: number
  current: JobStatus
  onChange: (id: number, status: JobStatus) => void
}) {
  const [loading, setLoading] = useState(false)
  const style = STATUS_STYLE[current]

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as JobStatus
    setLoading(true)
    try {
      const res = await fetch(`/api/saved-jobs/${savedJobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (res.ok) onChange(savedJobId, next)
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={loading}
      style={{
        background: style.background,
        color: style.color,
        border: `1px solid ${style.border}`,
        borderRadius: '6px',
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        outline: 'none',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {STATUS_OPTIONS.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}

// ── Notes Cell ────────────────────────────────────────────────────────────────

function NotesCell({
  savedJobId,
  initial,
}: {
  savedJobId: number
  initial: string | null
}) {
  const [value, setValue] = useState(initial ?? '')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await fetch(`/api/saved-jobs/${savedJobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: value }),
    })
    setSaving(false)
  }

  return (
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={save}
      placeholder="Add a note..."
      style={{
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid #2a2a2a',
        color: saving ? '#52525b' : '#a1a1aa',
        fontSize: '12px',
        padding: '2px 0',
        width: '100%',
        outline: 'none',
      }}
    />
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

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
      const { data, error: fetchError } = await supabase
        .from('saved_jobs')
        .select('id, saved_at, status, notes, job_id, job_postings_ingest_test(*)')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false })

      if (fetchError) throw fetchError

      const mapped: SavedJob[] = (data ?? [])
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

      setJobs(mapped)
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
    await fetch(`/api/saved-jobs/${savedJobId}`, { method: 'DELETE' })
    setJobs(prev => prev.filter(j => j.saved_job_id !== savedJobId))
  }

  // Stat counts
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
          <StatCard label="Total Saved" count={counts.total}     color="#a1a1aa" />
          <StatCard label="Applied"     count={counts.applied}   color="#60a5fa" />
          <StatCard label="Interview"   count={counts.interview} color="#fb923c" />
          <StatCard label="Offer"       count={counts.offer}     color="#4ade80" />
        </div>

        {error && (
          <div style={{ background: '#2a1a1a', border: '1px solid #7f1d1d', borderRadius: '10px', padding: '14px', marginBottom: '16px', color: '#fca5a5', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ background: '#0d0d0d', borderRadius: '8px', height: '52px', border: '1px solid rgba(255,255,255,0.07)' }} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ background: '#0d0d0d', borderRadius: '10px', padding: '60px 20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ color: 'white', fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>No saved jobs yet</p>
            <p style={{ color: '#52525b', fontSize: '12px' }}>Hit the bookmark on any job to save it here.</p>
          </div>
        ) : (
          <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 110px 120px 1fr 90px',
              gap: '12px',
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              {['Job Title', 'Date Saved', 'Status', 'Notes', ''].map(h => (
                <span key={h} style={{ color: '#52525b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {jobs.map((job, i) => (
              <div
                key={job.saved_job_id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 110px 120px 1fr 90px',
                  gap: '12px',
                  padding: '12px 16px',
                  alignItems: 'center',
                  borderBottom: i < jobs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                {/* Job title + company */}
                <div style={{ minWidth: 0 }}>
                  <a
                    href={job.job_href ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'white', fontSize: '13px', fontWeight: 500, textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {job.job_title ?? 'Untitled'}
                  </a>
                  <span style={{ color: '#52525b', fontSize: '11px' }}>
                    {job.company_name ?? ''}{job.city ? ` · ${job.city}, ${job.state ?? ''}` : ''}
                    {job.is_remote ? ' · Remote' : ''}
                  </span>
                </div>

                {/* Date saved */}
                <span style={{ color: '#71717a', fontSize: '12px' }}>{formatDate(job.saved_at)}</span>

                {/* Status dropdown */}
                <StatusDropdown
                  savedJobId={job.saved_job_id}
                  current={job.status}
                  onChange={handleStatusChange}
                />

                {/* Notes */}
                <NotesCell savedJobId={job.saved_job_id} initial={job.notes} />

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {job.job_href && (
                    <a
                      href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.job_title ?? '')}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Search on LinkedIn"
                      style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 600, textDecoration: 'none', padding: '3px 7px', border: '1px solid #1d4ed8', borderRadius: '4px' }}
                    >
                      in
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(job.saved_job_id)}
                    title="Remove"
                    style={{ background: 'none', border: '1px solid #3f3f46', borderRadius: '4px', color: '#52525b', fontSize: '14px', cursor: 'pointer', padding: '2px 7px', lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
