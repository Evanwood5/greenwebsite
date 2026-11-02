'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { Job } from '@/lib/types/jobs'
import { useAuth } from '@/contexts/AuthContext'
import LinkedInButton from '@/components/ui/LinkedInButton'

interface JobListProps {
  jobs: Job[]
  loading?: boolean
  fieldCategoryMap?: Record<number, string>
  fieldSubCategoryMap?: Record<number, string>
  savedJobIds?: string[]
  onSaveToggle?: (jobId: string, willBeSaved: boolean) => void
}

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}


function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--palette-green-500)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--palette-neutral-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--palette-neutral-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

function postedAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1d ago'
  if (days < 7) return `${days}d ago`
  if (days < 14) return '1w ago'
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function JobTypeBadge({ type }: { type: string }) {
  const styles: Record<string, React.CSSProperties> = {
    'Full Time':  { background: 'rgb(var(--palette-blue-400-rgb) / 0.08)',  color: 'var(--palette-blue-400)', border: '1px solid rgb(var(--palette-blue-400-rgb) / 0.2)' },
    'Part Time':  { background: 'rgb(var(--palette-orange-500-rgb) / 0.08)',  color: 'var(--palette-orange-500)', border: '1px solid rgb(var(--palette-orange-500-rgb) / 0.2)' },
    'Contract':   { background: 'rgb(var(--palette-purple-400-rgb) / 0.08)', color: 'var(--palette-purple-400)', border: '1px solid rgb(var(--palette-purple-400-rgb) / 0.2)' },
    'Internship': { background: 'rgb(var(--palette-amber-400-rgb) / 0.08)',  color: 'var(--palette-amber-400)', border: '1px solid rgb(var(--palette-amber-400-rgb) / 0.2)' },
  }
  const s = styles[type] ?? { background: 'rgb(var(--palette-green-500-rgb) / 0.06)', color: 'var(--palette-green-500)', border: '1px solid rgb(var(--palette-green-500-rgb) / 0.15)' }
  return (
    <span style={{ display: 'inline-block', padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: 500, whiteSpace: 'nowrap', ...s }}>
      {type}
    </span>
  )
}

function LevelBadge({ level }: { level: string }) {
  const normalized = level.toLowerCase()
  let style: React.CSSProperties
  if (normalized.includes('entry') || normalized.includes('junior')) {
    style = { background: 'rgb(var(--palette-green-500-rgb) / 0.08)', color: 'var(--palette-green-500)', border: '1px solid rgb(var(--palette-green-500-rgb) / 0.2)' }
  } else if (normalized.includes('moderate')) {
    style = { background: 'rgb(var(--palette-red-300-rgb) / 0.06)', color: 'var(--palette-red-300)', border: '1px solid rgb(var(--palette-red-300-rgb) / 0.14)' }
  } else if (normalized.includes('advanced')) {
    style = { background: 'rgb(var(--palette-red-500-rgb) / 0.08)', color: 'var(--palette-red-500)', border: '1px solid rgb(var(--palette-red-500-rgb) / 0.18)' }
  } else if (normalized.includes('mid') || normalized.includes('associate')) {
    style = { background: 'rgb(var(--palette-blue-400-rgb) / 0.08)', color: 'var(--palette-blue-400)', border: '1px solid rgb(var(--palette-blue-400-rgb) / 0.2)' }
  } else if (normalized.includes('senior') || normalized.includes('lead') || normalized.includes('principal')) {
    style = { background: 'rgb(var(--palette-purple-400-rgb) / 0.08)', color: 'var(--palette-purple-400)', border: '1px solid rgb(var(--palette-purple-400-rgb) / 0.2)' }
  } else {
    style = { background: 'rgb(var(--palette-neutral-500-rgb) / 0.1)', color: 'var(--palette-neutral-500)', border: '1px solid rgb(var(--palette-neutral-500-rgb) / 0.2)' }
  }
  return (
    <span style={{ display: 'inline-block', padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: 500, whiteSpace: 'nowrap', ...style }}>
      {level}
    </span>
  )
}

// Kept for use by saved jobs and custom jobs pages
export function DarkJobCard({
  job,
  showSave = true,
  showDelete = false,
  onDelete,
  matchScore,
  fieldSubCategoryMap,
}: {
  job: Job
  showSave?: boolean
  showDelete?: boolean
  onDelete?: () => void
  matchScore?: number
  fieldSubCategoryMap?: Record<number, string>
}) {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user?.id || !showSave) return
    supabase
      .from('saved_jobs')
      .select('job_id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('job_id', job.job_id)
      .then(({ count }) => setSaved((count ?? 0) > 0))
  }, [user?.id, job.job_id, showSave])

  const toggleSave = async () => {
    if (!user?.id || saving) return
    setSaving(true)
    if (saved) {
      await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', job.job_id)
      setSaved(false)
    } else {
      await supabase.from('saved_jobs').insert({
        user_id: user.id,
        job_id: job.job_id,
        saved_at: new Date().toISOString(),
      })
      setSaved(true)
    }
    setSaving(false)
  }

  const locs = Array.isArray(job.locations) ? job.locations as string[] : []
  const location = locs.length ? locs.join(', ') : (job.is_remote ? 'Remote' : 'Not listed')
  const cat = inferCategory(job.job_title)
  const meta = CATEGORY_META[cat] ?? CATEGORY_META.other
  const subCategory = job.job_field_id != null ? fieldSubCategoryMap?.[job.job_field_id] : undefined

  return (
    <div style={{
      background: 'var(--palette-neutral-870)',
      borderRadius: '10px',
      padding: '14px',
      border: '1px solid rgb(var(--palette-white-rgb) / 0.35)',
      boxShadow: 'inset 0 1px 0 rgb(var(--palette-white-rgb) / 0.18), 0 0 20px rgb(var(--palette-white-rgb) / 0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      position: 'relative',
    }}>
      {matchScore !== undefined && (
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgb(var(--palette-green-500-rgb) / 0.08)', color: 'var(--palette-green-500)',
          fontSize: '10px', fontWeight: 600, padding: '2px 7px',
          borderRadius: '4px', border: '1px solid rgb(var(--palette-green-500-rgb) / 0.15)',
        }}>
          {matchScore}% Match
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '7px', background: meta.bg, color: meta.color, border: `1px solid color-mix(in srgb, ${meta.color} 18.8235%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {meta.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingRight: matchScore !== undefined ? '72px' : '0' }}>
          <h3 style={{ color: 'var(--palette-neutral-200)', fontSize: '13px', fontWeight: 600, marginBottom: '2px', lineHeight: '1.35', letterSpacing: '-0.01em' }}>
            {job.job_title || 'Untitled Position'}
          </h3>
          <p style={{ color: 'var(--palette-neutral-500)', fontSize: '11px' }}>{job.company_name || 'Company not listed'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <PinIcon />
          <span style={{ color: 'var(--palette-neutral-600)', fontSize: '11px' }}>{location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ClockIcon />
          <span style={{ color: 'var(--palette-neutral-600)', fontSize: '11px' }}>Posted {postedAgo(job.created_at)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
        {job.job_type && <JobTypeBadge type={job.job_type} />}
        {job.experience_level && <LevelBadge level={job.experience_level} />}
        {subCategory && (
          <span style={{
            display: 'inline-block', padding: '2px 7px', borderRadius: '4px',
            fontSize: '10px', fontWeight: 500, whiteSpace: 'nowrap',
            background: 'rgb(var(--palette-white-rgb) / 0.05)',
            color: 'var(--palette-neutral-500)',
            border: '1px solid rgb(var(--palette-white-rgb) / 0.08)',
          }}>
            {subCategory}
          </span>
        )}
      </div>

      <div style={{ borderTop: '1px solid rgb(var(--palette-white-rgb) / 0.06)' }} />

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {job.job_href ? (
          <a href={job.job_href} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '7px 10px', background: 'var(--palette-green-500)', color: 'var(--palette-white)', borderRadius: '6px', fontWeight: 500, fontSize: '12px', textDecoration: 'none' }}>
            <ExternalLinkIcon /> Apply
          </a>
        ) : (
          <span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7px 10px', background: 'rgb(var(--palette-white-rgb) / 0.03)', color: 'var(--palette-neutral-600)', borderRadius: '6px', fontSize: '12px', border: '1px solid rgb(var(--palette-white-rgb) / 0.05)' }}>
            No link
          </span>
        )}

        {/* LinkedIn */}
        <LinkedInButton companyName={job.company_name} size={32} />

        {/* Unsave / delete */}
        {showDelete && onDelete && (
          <button
            onClick={onDelete}
            aria-label="Unsave job"
            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgb(var(--palette-red-500-rgb) / 0.1)', color: 'var(--palette-red-500)', borderRadius: '6px', border: '1px solid rgb(var(--palette-red-500-rgb) / 0.25)', cursor: 'pointer', flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgb(var(--palette-red-500-rgb) / 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgb(var(--palette-red-500-rgb) / 0.1)')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--palette-red-500)" stroke="var(--palette-red-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </button>
        )}

        {/* Save toggle — red bookmark */}
        {showSave && (
          <button
            onClick={toggleSave}
            disabled={saving}
            aria-label={saved ? 'Unsave job' : 'Save job'}
            style={{
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: saved ? 'rgb(var(--palette-red-500-rgb) / 0.18)' : 'rgb(var(--palette-red-500-rgb) / 0.08)',
              color: 'var(--palette-red-500)', borderRadius: '6px',
              border: `1px solid ${saved ? 'rgb(var(--palette-red-500-rgb) / 0.4)' : 'rgb(var(--palette-red-500-rgb) / 0.22)'}`,
              cursor: saving ? 'wait' : 'pointer', flexShrink: 0,
              transition: 'background 150ms, border-color 150ms',
            }}
            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = 'rgb(var(--palette-red-500-rgb) / 0.25)' }}
            onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = saved ? 'rgb(var(--palette-red-500-rgb) / 0.18)' : 'rgb(var(--palette-red-500-rgb) / 0.08)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? 'var(--palette-red-500)' : 'none'} stroke="var(--palette-red-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

type JobCategory = 'tech' | 'engineering' | 'business' | 'health' | 'other'

function inferCategory(title: string | null): JobCategory {
  const t = (title ?? '').toLowerCase()
  if (/software|developer|devops|cloud|data science|machine learning|cyber|security|it |sre|backend|frontend|full.?stack|ai |ml |platform|database|network|infrastructure|sysadmin|systems admin/.test(t)) return 'tech'
  if (/mechanical|electrical|civil|chemical|industrial|manufacturing|embedded|firmware|hardware|structural|aerospace|process engineer/.test(t)) return 'engineering'
  if (/health|medical|nurse|clinical|pharma|bio|patient|therapist|physician|surgery|dental|radiology|care|ehr|hospital/.test(t)) return 'health'
  if (/analyst|finance|accounting|marketing|sales|operations|strategy|manager|mba|consultant|business|hr |human resources|recruiter|supply chain|procurement|logistics/.test(t)) return 'business'
  return 'other'
}

const CATEGORY_META: Record<JobCategory, { icon: React.ReactNode; color: string; bg: string }> = {
  tech: {
    color: 'var(--palette-blue-400)',
    bg: 'rgb(var(--palette-blue-400-rgb) / 0.08)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  engineering: {
    color: 'var(--palette-orange-500)',
    bg: 'rgb(var(--palette-orange-500-rgb) / 0.08)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
  business: {
    color: 'var(--palette-purple-400)',
    bg: 'rgb(var(--palette-purple-400-rgb) / 0.08)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  health: {
    color: 'var(--palette-rose-500)',
    bg: 'rgb(var(--palette-rose-500-rgb) / 0.08)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  other: {
    color: 'var(--palette-neutral-500)',
    bg: 'rgb(var(--palette-neutral-500-rgb) / 0.08)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
  },
}

function JobTableRow({ job, isLast, index, fieldCategoryMap, fieldSubCategoryMap, isSaved: initialSaved, onSaveToggle }: {
  job: Job
  isLast?: boolean
  index?: number
  fieldCategoryMap?: Record<number, string>
  fieldSubCategoryMap?: Record<number, string>
  isSaved?: boolean
  onSaveToggle?: (jobId: string, willBeSaved: boolean) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [saved, setSaved] = useState(initialSaved ?? false)

  useEffect(() => { setSaved(initialSaved ?? false) }, [initialSaved])

  function handleSave(e: React.MouseEvent) {
    e.stopPropagation()
    const next = !saved
    setSaved(next)
    onSaveToggle?.(job.job_id, next)
  }
  const locs2 = Array.isArray(job.locations) ? job.locations as string[] : []
  const location = job.is_remote ? 'Remote' : locs2.join(', ') || '—'

  const cellStyle: React.CSSProperties = {
    padding: '10px 10px',
    fontSize: '13px',
    color: 'var(--palette-neutral-400)',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? 'rgb(var(--palette-white-rgb) / 0.06)' : (index ?? 0) % 2 === 1 ? 'rgb(var(--palette-white-rgb) / 0.025)' : 'transparent', transition: 'background 120ms', cursor: 'default', borderBottom: isLast ? 'none' : '1px solid rgb(var(--palette-white-rgb) / 0.06)' }}
    >
      {/* Category icon — from DB fieldCategoryMap, fall back to title inference */}
      <td style={{ ...cellStyle, width: '36px', paddingRight: '4px' }}>
        {(() => {
          const dbCat = job.job_field_id != null ? fieldCategoryMap?.[job.job_field_id] : undefined
          const cat = (dbCat as JobCategory | undefined) ?? inferCategory(job.job_title)
          const meta = CATEGORY_META[cat] ?? CATEGORY_META.other
          return (
            <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: meta.bg, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              {meta.icon}
            </div>
          )
        })()}
      </td>

      {/* Title + company */}
      <td style={{ ...cellStyle, whiteSpace: 'normal', overflow: 'hidden' }}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--palette-neutral-200)', fontWeight: 500, fontSize: '13px' }} title={job.job_title ?? ''}>
          {job.job_title || 'Untitled Position'}
        </div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--palette-neutral-600)', fontSize: '11px', marginTop: '2px' }}>
          {job.company_name || ''}
        </div>
      </td>

      {/* Level */}
      <td style={{ ...cellStyle, width: '95px' }}>
        {job.experience_level
          ? <LevelBadge level={job.experience_level} />
          : <span style={{ color: 'var(--palette-neutral-700)', fontSize: '11px' }}>—</span>}
      </td>

      {/* Sub-category */}
      <td style={{ ...cellStyle, width: '120px', color: 'var(--palette-neutral-600)', fontSize: '11px' }}>
        {job.job_field_id != null && fieldSubCategoryMap?.[job.job_field_id]
          ? <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap' }}>{fieldSubCategoryMap[job.job_field_id]}</span>
          : <span style={{ color: 'var(--palette-neutral-700)' }}>—</span>}
      </td>

      {/* Type */}
      <td style={{ ...cellStyle, width: '100px' }}>
        {job.job_type
          ? <JobTypeBadge type={job.job_type} />
          : <span style={{ color: 'var(--palette-neutral-700)', fontSize: '11px' }}>—</span>}
      </td>

      {/* Location */}
      <td style={{ ...cellStyle, width: '115px', color: 'var(--palette-neutral-500)', fontSize: '12px' }}>
        {location}
      </td>

      {/* Posted */}
      <td style={{ ...cellStyle, width: '62px', color: 'var(--palette-neutral-600)', fontSize: '12px' }}>
        {postedAgo(job.created_at)}
      </td>

      {/* Actions */}
      <td style={{ ...cellStyle, width: '100px', textAlign: 'right', paddingRight: '12px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          {/* Save */}
          <button
            aria-label={saved ? 'Unsave job' : 'Save job'}
            onClick={handleSave}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '28px', height: '28px',
              background: saved ? 'rgb(var(--palette-red-500-rgb) / 0.15)' : 'rgb(var(--palette-red-500-rgb) / 0.08)',
              color: 'var(--palette-red-500)', borderRadius: '5px',
              border: saved ? '1px solid rgb(var(--palette-red-500-rgb) / 0.35)' : '1px solid rgb(var(--palette-red-500-rgb) / 0.2)',
              cursor: 'pointer', transition: 'background 150ms, border-color 150ms', flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgb(var(--palette-red-500-rgb) / 0.22)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = saved ? 'rgb(var(--palette-red-500-rgb) / 0.15)' : 'rgb(var(--palette-red-500-rgb) / 0.08)')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? 'var(--palette-red-500)' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </button>

          {/* LinkedIn */}
          <LinkedInButton companyName={job.company_name} />

          {/* Apply */}
          {job.job_href ? (
            <a
              href={job.job_href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Apply for job"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '28px', height: '28px', background: 'rgb(var(--palette-green-500-rgb) / 0.1)',
                color: 'var(--palette-green-500)', borderRadius: '5px',
                textDecoration: 'none', border: '1px solid rgb(var(--palette-green-500-rgb) / 0.2)',
                transition: 'background 150ms', flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgb(var(--palette-green-500-rgb) / 0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgb(var(--palette-green-500-rgb) / 0.1)')}
            >
              <ExternalLinkIcon />
            </a>
          ) : (
            <span style={{ color: 'var(--palette-neutral-700)', fontSize: '12px' }}>—</span>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function JobList({ jobs, loading, fieldCategoryMap, fieldSubCategoryMap, savedJobIds, onSaveToggle }: JobListProps) {
  const savedSet = new Set(savedJobIds ?? [])
  if (loading) {
    return (
      <div style={{ background: 'var(--palette-neutral-800)', borderRadius: '4px', border: '1px solid rgb(var(--palette-white-rgb) / 0.06)', overflow: 'hidden' }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ height: '44px', borderBottom: '1px solid rgb(var(--palette-white-rgb) / 0.04)', background: i % 2 === 0 ? 'transparent' : 'rgb(var(--palette-white-rgb) / 0.01)' }} />
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--palette-neutral-600)' }}>
        <p style={{ fontSize: '14px', marginBottom: '4px', color: 'var(--palette-neutral-500)' }}>No jobs found</p>
        <p style={{ fontSize: '12px' }}>Try adjusting your filters or check back later</p>
      </div>
    )
  }

  const thStyle: React.CSSProperties = {
    padding: '8px 10px',
    fontSize: '10px',
    fontWeight: 700,
    color: 'var(--palette-neutral-500)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textAlign: 'left',
    borderBottom: '1px solid rgb(var(--palette-white-rgb) / 0.1)',
    whiteSpace: 'nowrap',
  }

  return (
    <div style={{ background: 'var(--palette-neutral-800)', borderRadius: '4px', border: '1px solid rgb(var(--palette-white-rgb) / 0.06)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '44px' }} />
          <col style={{ width: '280px' }} />
          <col style={{ width: '95px' }} />
          <col style={{ width: '120px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '115px' }} />
          <col style={{ width: '62px' }} />
          <col style={{ width: '100px' }} />
        </colgroup>
        <thead>
          <tr style={{ background: 'var(--palette-neutral-860)' }}>
            <th style={{ ...thStyle, width: '36px' }}></th>
            <th style={thStyle}>Position</th>
            <th style={thStyle}>Level</th>
            <th style={thStyle}>Sub-category</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Posted</th>
            <th style={{ ...thStyle, textAlign: 'right', paddingRight: '16px' }}></th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, i) => (
            <JobTableRow
              key={job.job_id}
              job={job}
              index={i}
              isLast={i === jobs.length - 1}
              fieldCategoryMap={fieldCategoryMap}
              fieldSubCategoryMap={fieldSubCategoryMap}
              isSaved={savedSet.has(job.job_id)}
              onSaveToggle={onSaveToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
