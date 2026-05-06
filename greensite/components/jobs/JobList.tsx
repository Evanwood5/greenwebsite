import { useState, useEffect } from 'react'

interface Job {
  job_id: string
  created_at: string
  company_name: string | null
  job_title: string | null
  job_href: string | null
  job_type: string | null
  city: string | null
  state: string | null
  is_remote: boolean | null
  experience_level?: string | null
  job_field_id?: number | null
}

interface JobListProps {
  jobs: Job[]
  loading?: boolean
  fieldCategoryMap?: Record<number, string>
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

function BookmarkOutlineIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    'Full Time':  { background: 'rgba(96,165,250,0.08)',  color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' },
    'Part Time':  { background: 'rgba(249,115,22,0.08)',  color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' },
    'Contract':   { background: 'rgba(167,139,250,0.08)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' },
    'Internship': { background: 'rgba(251,191,36,0.08)',  color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' },
  }
  const s = styles[type] ?? { background: 'rgba(41,193,21,0.06)', color: '#29C115', border: '1px solid rgba(41,193,21,0.15)' }
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
    style = { background: 'rgba(41,193,21,0.08)', color: '#29C115', border: '1px solid rgba(41,193,21,0.2)' }
  } else if (normalized.includes('mid') || normalized.includes('associate')) {
    style = { background: 'rgba(96,165,250,0.08)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }
  } else if (normalized.includes('senior') || normalized.includes('lead') || normalized.includes('principal')) {
    style = { background: 'rgba(167,139,250,0.08)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }
  } else {
    style = { background: 'rgba(113,113,122,0.1)', color: '#71717a', border: '1px solid rgba(113,113,122,0.2)' }
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
}: {
  job: Job
  showSave?: boolean
  showDelete?: boolean
  onDelete?: () => void
  matchScore?: number
}) {
  const location = [job.city, job.state].filter(Boolean).join(', ') || (job.is_remote ? 'Remote' : 'Not listed')
  const cat = inferCategory(job.job_title)
  const meta = CATEGORY_META[cat] ?? CATEGORY_META.other

  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '10px',
      padding: '14px',
      border: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      position: 'relative',
    }}>
      {matchScore !== undefined && (
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(41,193,21,0.08)', color: '#29C115',
          fontSize: '10px', fontWeight: 600, padding: '2px 7px',
          borderRadius: '4px', border: '1px solid rgba(41,193,21,0.15)',
        }}>
          {matchScore}% Match
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '7px', background: meta.bg, color: meta.color, border: `1px solid ${meta.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {meta.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingRight: matchScore !== undefined ? '72px' : '0' }}>
          <h3 style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 600, marginBottom: '2px', lineHeight: '1.35', letterSpacing: '-0.01em' }}>
            {job.job_title || 'Untitled Position'}
          </h3>
          <p style={{ color: '#71717a', fontSize: '11px' }}>{job.company_name || 'Company not listed'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <PinIcon />
          <span style={{ color: '#52525b', fontSize: '11px' }}>{location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ClockIcon />
          <span style={{ color: '#52525b', fontSize: '11px' }}>Posted {postedAgo(job.created_at)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {job.job_type && <JobTypeBadge type={job.job_type} />}
        {job.experience_level && <LevelBadge level={job.experience_level} />}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {job.job_href ? (
          <a href={job.job_href} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '7px 10px', background: '#29C115', color: 'white', borderRadius: '6px', fontWeight: 500, fontSize: '12px', textDecoration: 'none' }}>
            <ExternalLinkIcon /> Apply
          </a>
        ) : (
          <span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7px 10px', background: 'rgba(255,255,255,0.03)', color: '#52525b', borderRadius: '6px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            No link
          </span>
        )}

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(job.company_name ?? '')}&origin=FACETED_SEARCH&geoUrn=%5B%22103051080%22%5D`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Search on LinkedIn"
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.08)', color: '#3b82f6', borderRadius: '6px', border: '1px solid rgba(59,130,246,0.2)', textDecoration: 'none', flexShrink: 0 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.16)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.08)')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>

        {/* Unsave bookmark */}
        {showDelete && onDelete && (
          <button
            onClick={onDelete}
            aria-label="Unsave job"
            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer', flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </button>
        )}

        {showSave && (
          <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#52525b', cursor: 'pointer' }} aria-label="Save job">
            <BookmarkOutlineIcon />
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
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.08)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  engineering: {
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
  business: {
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  health: {
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.08)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  other: {
    color: '#71717a',
    bg: 'rgba(113,113,122,0.08)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
  },
}

function JobTableRow({ job, isLast, fieldCategoryMap, isSaved: initialSaved, onSaveToggle }: {
  job: Job
  isLast?: boolean
  fieldCategoryMap?: Record<number, string>
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
  const location = job.is_remote ? 'Remote' : [job.city, job.state].filter(Boolean).join(', ') || '—'

  const cellStyle: React.CSSProperties = {
    padding: '10px 10px',
    fontSize: '13px',
    color: '#a1a1aa',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? 'rgba(255,255,255,0.03)' : 'transparent', transition: 'background 120ms', cursor: 'default', borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Category icon — prefer DB category, fall back to title inference */}
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
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#e4e4e7', fontWeight: 500, fontSize: '13px' }} title={job.job_title ?? ''}>
          {job.job_title || 'Untitled Position'}
        </div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#52525b', fontSize: '11px', marginTop: '2px' }}>
          {job.company_name || ''}
        </div>
      </td>

      {/* Level */}
      <td style={{ ...cellStyle, width: '95px' }}>
        {job.experience_level
          ? <LevelBadge level={job.experience_level} />
          : <span style={{ color: '#3f3f46', fontSize: '11px' }}>—</span>}
      </td>

      {/* Type */}
      <td style={{ ...cellStyle, width: '100px' }}>
        {job.job_type
          ? <JobTypeBadge type={job.job_type} />
          : <span style={{ color: '#3f3f46', fontSize: '11px' }}>—</span>}
      </td>

      {/* Location */}
      <td style={{ ...cellStyle, width: '115px', color: '#71717a', fontSize: '12px' }}>
        {location}
      </td>

      {/* Posted */}
      <td style={{ ...cellStyle, width: '62px', color: '#52525b', fontSize: '12px' }}>
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
              background: saved ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
              color: '#ef4444', borderRadius: '5px',
              border: saved ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(239,68,68,0.2)',
              cursor: 'pointer', transition: 'background 150ms, border-color 150ms', flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.22)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = saved ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? '#ef4444' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </button>

          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(job.company_name ?? '')}&origin=FACETED_SEARCH&geoUrn=%5B%22103051080%22%5D`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Find company employees on LinkedIn"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '28px', height: '28px', background: 'rgba(59,130,246,0.08)',
              color: '#3b82f6', borderRadius: '5px', border: '1px solid rgba(59,130,246,0.2)',
              textDecoration: 'none', transition: 'background 150ms', flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.16)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.08)')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* Apply */}
          {job.job_href ? (
            <a
              href={job.job_href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Apply for job"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '28px', height: '28px', background: 'rgba(41,193,21,0.1)',
                color: '#29C115', borderRadius: '5px',
                textDecoration: 'none', border: '1px solid rgba(41,193,21,0.2)',
                transition: 'background 150ms', flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(41,193,21,0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(41,193,21,0.1)')}
            >
              <ExternalLinkIcon />
            </a>
          ) : (
            <span style={{ color: '#3f3f46', fontSize: '12px' }}>—</span>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function JobList({ jobs, loading, fieldCategoryMap, savedJobIds, onSaveToggle }: JobListProps) {
  const savedSet = new Set(savedJobIds ?? [])
  if (loading) {
    return (
      <div style={{ background: '#191919', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.09)', overflow: 'hidden' }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ height: '44px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }} />
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0', color: '#52525b' }}>
        <p style={{ fontSize: '14px', marginBottom: '4px', color: '#71717a' }}>No jobs found</p>
        <p style={{ fontSize: '12px' }}>Try adjusting your filters or check back later</p>
      </div>
    )
  }

  const thStyle: React.CSSProperties = {
    padding: '8px 10px',
    fontSize: '10px',
    fontWeight: 600,
    color: '#52525b',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    whiteSpace: 'nowrap',
  }

  return (
    <div style={{ background: '#191919', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.09)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '44px' }} />
          <col style={{ width: '320px' }} />
          <col style={{ width: '95px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '115px' }} />
          <col style={{ width: '62px' }} />
          <col style={{ width: '100px' }} />
        </colgroup>
        <thead>
          <tr style={{ background: '#141414' }}>
            <th style={{ ...thStyle, width: '36px' }}></th>
            <th style={thStyle}>Position</th>
            <th style={thStyle}>Level</th>
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
              isLast={i === jobs.length - 1}
              fieldCategoryMap={fieldCategoryMap}
              isSaved={savedSet.has(job.job_id)}
              onSaveToggle={onSaveToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
