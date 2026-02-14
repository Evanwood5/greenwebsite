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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2 mb-4">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <p className="text-lg font-medium mb-2">No jobs found</p>
          <p className="text-sm">Try adjusting your filters or check back later for new opportunities</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job, index) => (
        <JobCard key={job.id || `job-${index}-${job.created_at}`} job={job} />
      ))}
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        {/* Job Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {job.job_title || 'Untitled Position'}
        </h3>
        
        {/* Company */}
        <p className="text-blue-600 font-medium mb-3">
          {job.company_name || 'Company Not Specified'}
        </p>
        
        {/* Job Details */}
        <div className="flex-1 space-y-2 mb-4">
          {job.job_type && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium mr-2">Type:</span>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                {job.job_type}
              </span>
            </div>
          )}
          
          {(job.city || job.state || job.is_remote !== null) && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium mr-2">Location:</span>
              <span>
                {job.is_remote ? (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Remote
                  </span>
                ) : (
                  `${job.city ? job.city : ''}${job.city && job.state ? ', ' : ''}${job.state ? job.state : ''}`
                )}
              </span>
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            Posted: {new Date(job.created_at).toLocaleDateString()}
          </div>
        </div>
        
        {/* Apply Button */}
        {job.job_href && (
          <a
            href={job.job_href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center text-sm font-medium"
          >
            View Job
          </a>
        )}
      </div>
    </div>
  )
}