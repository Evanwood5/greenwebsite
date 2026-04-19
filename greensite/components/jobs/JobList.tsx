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
}

interface JobListProps {
  jobs: Job[]
  loading?: boolean
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

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 14) return '1 week ago'
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

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
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(41,193,21,0.08)',
          color: '#29C115',
          fontSize: '10px',
          fontWeight: 600,
          padding: '2px 7px',
          borderRadius: '4px',
          border: '1px solid rgba(41,193,21,0.15)',
        }}>
          {matchScore}% Match
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '7px',
          background: 'rgba(41,193,21,0.08)',
          border: '1px solid rgba(41,193,21,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <BriefcaseIcon />
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingRight: matchScore !== undefined ? '72px' : '0' }}>
          <h3 style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 600, marginBottom: '2px', lineHeight: '1.35', letterSpacing: '-0.01em' }}>
            {job.job_title || 'Untitled Position'}
          </h3>
          <p style={{ color: '#71717a', fontSize: '11px' }}>{job.company_name || 'Company not listed'}</p>
        </div>
      </div>

      {/* Meta */}
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

      {/* Job type badge */}
      {job.job_type && (
        <div>
          <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 500,
            ...(job.job_type === 'Full Time'
              ? { background: 'rgba(96,165,250,0.08)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.15)' }
              : job.job_type === 'Part Time'
              ? { background: 'rgba(249,115,22,0.08)', color: '#f97316', border: '1px solid rgba(249,115,22,0.15)' }
              : job.job_type === 'Contract'
              ? { background: 'rgba(167,139,250,0.08)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.15)' }
              : job.job_type === 'Internship'
              ? { background: 'rgba(251,191,36,0.08)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.15)' }
              : { background: 'rgba(41,193,21,0.06)', color: '#29C115', border: '1px solid rgba(41,193,21,0.12)' }),
          }}>
            {job.job_type}
          </span>
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {job.job_href ? (
          <a
            href={job.job_href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '7px 10px',
              background: '#29C115',
              color: 'white',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '12px',
              textDecoration: 'none',
            }}
          >
            <ExternalLinkIcon />
            Apply
          </a>
        ) : (
          <span style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '7px 10px',
            background: 'rgba(255,255,255,0.03)',
            color: '#52525b',
            borderRadius: '6px',
            fontSize: '12px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            No link
          </span>
        )}

        {showSave && (
          <button style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            color: '#52525b',
            cursor: 'pointer',
          }} aria-label="Save job">
            <BookmarkOutlineIcon />
          </button>
        )}

        {showDelete && onDelete && (
          <button onClick={onDelete} style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            color: '#52525b',
            cursor: 'pointer',
          }} aria-label="Remove saved job">
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  )
}

export default function JobList({ jobs, loading }: JobListProps) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ background: '#1a1a1a', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255,255,255,0.07)', height: '180px' }} />
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
      {jobs.map((job) => (
        <DarkJobCard key={job.job_id} job={job} />
      ))}
    </div>
  )
}
