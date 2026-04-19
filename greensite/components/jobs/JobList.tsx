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

export default function JobList({ jobs, loading }: JobListProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#1e1e1e] rounded-xl border border-gray-800/50 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-700 rounded mb-4 w-3/4"></div>
            <div className="h-8 bg-gray-700 rounded mt-4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">
          <p className="text-lg font-medium mb-2">No jobs found</p>
          <p className="text-sm">Try adjusting your filters or check back later for new opportunities</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.job_id} job={job} />
      ))}
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  const location = [job.city, job.state].filter(Boolean).join(', ')

  return (
    <div className="bg-[#1e1e1e] rounded-xl border border-gray-600/60 p-6 hover:border-gray-500/80 transition-all duration-200 flex flex-col h-full">

      {/* Header: Icon + Title + Company */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(41, 193, 21, 0.1)' }}
        >
          <svg
            className="w-5 h-5"
            style={{ color: '#29C115' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-base leading-tight line-clamp-2">
            {job.job_title || 'Untitled Position'}
          </h3>
          <p className="text-gray-400 text-sm mt-0.5">
            {job.company_name || 'Company Not Specified'}
          </p>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>{job.is_remote ? 'Remote' : (location || 'Location not specified')}</span>
      </div>

      {/* Posted date */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
      </div>

      {/* Job Type Badge */}
      {job.job_type && (
        <div className="mb-4">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${job.job_type.toLowerCase().includes('intern')
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}>
            {job.job_type}
          </span>
        </div>
      )}

      <div className="flex-1" />

      {/* Apply + Bookmark */}
      <div className="flex gap-2 mt-2">
        {job.job_href ? (
          <a
            href={job.job_href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-white py-2 px-4 rounded-lg text-xs font-medium transition-colors"
            style={{ backgroundColor: '#29C115' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#24ab12')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#29C115')}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Apply
          </a>
        ) : (
          <div className="flex-1 bg-gray-800 text-gray-500 py-2 px-4 rounded-lg text-xs font-medium text-center cursor-not-allowed">
            No Link Available
          </div>
        )}

        <button className="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-lg hover:border-amber-500/50 hover:text-amber-400 text-gray-400 transition-colors flex-shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z"
            />
          </svg>
        </button>
      </div>

    </div>
  )
}