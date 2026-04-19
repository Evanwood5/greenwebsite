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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function BookmarkOutlineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <div style={{ background: '#1e1e1e', borderRadius: '14px', padding: '20px', border: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
      {matchScore !== undefined && (
        <div style={{ position: 'absolute', top: '14px', right: '14px', background: '#14532d', color: '#4ade80', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', border: '1px solid #166534' }}>
          {matchScore}% Match
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BriefcaseIcon />
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingRight: matchScore !== undefined ? '80px' : '0' }}>
          <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 700, marginBottom: '2px', lineHeight: '1.3' }}>
            {job.job_title || 'Untitled Position'}
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>{job.company_name || 'Company not listed'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PinIcon />
          <span style={{ color: '#9ca3af', fontSize: '13px' }}>{location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ClockIcon />
          <span style={{ color: '#9ca3af', fontSize: '13px' }}>Posted {postedAgo(job.created_at)}</span>
        </div>
      </div>

      {job.job_type && (
        <div>
          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, background: '#1e3a5f', color: '#60a5fa', border: '1px solid #1d4ed8' }}>
            {job.job_type}
          </span>
        </div>
      )}

      <div style={{ borderTop: '1px solid #2a2a2a' }} />

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {job.job_href ? (
          <a
            href={job.job_href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#22c55e', color: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}
          >
            <ExternalLinkIcon />
            Apply
          </a>
        ) : (
          <span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', background: '#2a2a2a', color: '#6b7280', borderRadius: '8px', fontSize: '14px' }}>
            No link
          </span>
        )}

        {showSave && (
          <button style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#9ca3af', cursor: 'pointer' }} aria-label="Save job">
            <BookmarkOutlineIcon />
          </button>
        )}

        {showDelete && onDelete && (
          <button onClick={onDelete} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#9ca3af', cursor: 'pointer' }} aria-label="Remove saved job">
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ background: '#1e1e1e', borderRadius: '14px', padding: '20px', border: '1px solid #2a2a2a', height: '220px' }} />
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
        <p style={{ fontSize: '16px', marginBottom: '6px' }}>No jobs found</p>
        <p style={{ fontSize: '13px' }}>Try adjusting your filters or check back later</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
      {jobs.map((job) => (
        <DarkJobCard key={job.job_id} job={job} />
      ))}
    </div>
  )
}
