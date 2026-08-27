'use client'

import { useState, useCallback } from 'react'
import { updateJobStatus, updateJobNotes } from '@/lib/services/savedJobs'
import { JobStatus, SavedJob, STATUS_OPTIONS, STATUS_STYLE, formatDate } from './types'

// ── Stat Card ─────────────────────────────────────────────────────────────────

export function StatCard({ label, count, color }: { label: string; count: number; color: string }) {
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

export function StatusDropdown({
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
      await updateJobStatus(savedJobId, next)
      onChange(savedJobId, next)
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

export function NotesCell({ savedJobId, initial }: { savedJobId: number; initial: string | null }) {
  const [value, setValue] = useState(initial ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = useCallback(async (text: string) => {
    setSaving(true)
    setSaved(false)
    await updateJobNotes(savedJobId, text)
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

  const borderColor = saved ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.08)'

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

// ── Jobs Table ────────────────────────────────────────────────────────────────

export function JobsTable({
  jobs,
  onStatusChange,
  onDelete,
}: {
  jobs: SavedJob[]
  onStatusChange: (id: number, status: JobStatus) => void
  onDelete: (id: number) => void
}) {
  return (
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
            <StatusDropdown savedJobId={job.saved_job_id} current={job.status} onChange={onStatusChange} />
          </div>

          {/* Notes */}
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
              onClick={() => onDelete(job.saved_job_id)}
              title="Remove"
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#52525b', fontSize: '14px', cursor: 'pointer', padding: '2px 7px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
