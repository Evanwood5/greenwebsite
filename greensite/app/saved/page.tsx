'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'

// ── Types ─────────────────────────────────────────────────────────────────────

type JobStatus = 'Saved' | 'Applied' | 'Interview' | 'Offer'

interface SavedJob {
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
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '4px',
      padding: '12px 14px',
      minWidth: 0,
    }}>
      <p style={{ color: '#52525b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '6px', textTransform: 'uppercase' }}>
        {label}
      </p>
      <p style={{ color, fontSize: '24px', fontWeight: 700, lineHeight: 1 }}>{count}</p>
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
      const { error } = await supabase
        .from('saved_jobs')
        .update({ status: next })
        .eq('id', savedJobId)
      if (!error) onChange(savedJobId, next)
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
        borderRadius: '4px',
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
  const [saved, setSaved] = useState(false)

  const save = useCallback(async (text: string) => {
    setSaving(true)
    setSaved(false)
    await supabase
      .from('saved_jobs')
      .update({ notes: text })
      .eq('id', savedJobId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }, [savedJobId])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      save(value)
      ;(e.target as HTMLTextAreaElement).blur()
    }
  }

  const borderColor = saved ? 'rgba(74,222,128,0.3)' : saving ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.08)'

  return (
    <textarea
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={() => save(value)}
      onKeyDown={handleKeyDown}
      placeholder="Add a note... (Enter to save)"
      rows={2}
      style={{
        background: '#141414',
        border: `1px solid ${borderColor}`,
        borderRadius: '4px',
        color: '#a1a1aa',
        fontSize: '12px',
        padding: '6px 8px',
        width: '100%',
        resize: 'vertical',
        outline: 'none',
        lineHeight: '1.4',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
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
    await supabase.from('saved_jobs').delete().eq('id', savedJobId)
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
          <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>

            {/* Column headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 110px 130px 1.2fr 80px',
              gap: '12px',
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {['Job', 'Saved', 'Status', 'Notes', ''].map(h => (
                <span key={h} style={{ color: '#52525b', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {jobs.map((job, i) => (
              <div
                key={job.saved_job_id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 110px 130px 1.2fr 80px',
                  gap: '12px',
                  padding: '12px 16px',
                  alignItems: 'start',
                  borderBottom: i < jobs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                {/* Job title + company */}
                <div style={{ minWidth: 0, paddingTop: '2px' }}>
                  <a
                    href={job.job_href ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500, textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {job.job_title ?? 'Untitled'}
                  </a>
                  <span style={{ color: '#52525b', fontSize: '11px' }}>
                    {[job.company_name, job.city ? `${job.city}, ${job.state ?? ''}` : null, job.is_remote ? 'Remote' : null].filter(Boolean).join(' · ')}
                  </span>
                </div>

                {/* Date saved */}
                <span style={{ color: '#52525b', fontSize: '12px', paddingTop: '4px' }}>{formatDate(job.saved_at)}</span>

                {/* Status dropdown */}
                <div style={{ paddingTop: '2px' }}>
                  <StatusDropdown
                    savedJobId={job.saved_job_id}
                    current={job.status}
                    onChange={handleStatusChange}
                  />
                </div>

                {/* Notes textarea */}
                <NotesCell savedJobId={job.saved_job_id} initial={job.notes} />

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', paddingTop: '2px' }}>
                  <a
                    href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent((job.job_title ?? '') + ' ' + (job.company_name ?? ''))}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Search on LinkedIn"
                    style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 600, textDecoration: 'none', padding: '4px 7px', border: '1px solid rgba(96,165,250,0.25)', borderRadius: '4px', background: 'rgba(96,165,250,0.06)' }}
                  >
                    in
                  </a>
                  <button
                    onClick={() => handleDelete(job.saved_job_id)}
                    title="Remove"
                    style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#52525b', fontSize: '14px', cursor: 'pointer', padding: '2px 7px', lineHeight: 1 }}
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
