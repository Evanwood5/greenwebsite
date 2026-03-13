interface Job {
  id: number
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
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-3xl p-8 animate-pulse h-40" />
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <p className="text-lg font-medium mb-2">No jobs found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 overflow-y-auto pr-4 max-h-[600px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      {jobs.map((job, index) => (
        <JobCard key={job.id || `job-${index}-${job.created_at}`} job={job} />
      ))}
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white border border-green-100 rounded-3xl p-8 hover:shadow-md transition-all relative group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-900 leading-tight pr-20 group-hover:text-green-600 transition-colors">
          {job.job_title || 'Untitled Position'}
        </h3>
        {job.job_href && (
          <a
            href={job.job_href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-50 text-green-600 text-sm font-bold rounded-lg hover:bg-green-600 hover:text-white transition-all"
          >
            Apply
          </a>
        )}
      </div>

      <div className="flex items-center text-gray-500 font-medium">
        <span className="text-sm">
          {job.city || 'Grand Rapids'}, {job.state || 'MI'}
        </span>
        <span className="mx-2">•</span>
        <span className="text-sm">
          {job.job_type || 'Full-time'}
        </span>
      </div>
    </div>
  )
}