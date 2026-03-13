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
    <div className="bg-gray-400/80 rounded-[40px] p-10 hover:bg-gray-400 transition-colors relative group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-3xl font-bold text-white leading-tight pr-20">
          {job.job_title || 'Untitled Position'}
        </h3>
        {job.job_href && (
          <a
            href={job.job_href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 text-2xl font-bold hover:text-red-600 transition-colors"
          >
            Apply
          </a>
        )}
      </div>

      <p className="text-2xl font-semibold text-gray-700">
        {job.city || 'Grand Rapids'}
      </p>
    </div>
  )
}