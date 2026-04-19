'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import FilterPanel, { FilterOptions } from '@/components/jobs/FIlterPanel'
import JobList from '@/components/jobs/JobList'
import { fetchJobsFromDB, Job } from '@/lib/jobsApi'

export default function JobsPage() {
  const { loading: authLoading } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState<FilterOptions>({
    jobType: '',
    isRemote: '',
    state: '',
    searchTerm: '',
    jobField: '',
    jobSubField: '',
    city: '',
  })

  const fetchJobs = async (page: number = 0, append: boolean = false) => {
    try {
      if (page === 0) {
        setLoading(true)
        setCurrentPage(0)
      } else {
        setLoadingMore(true)
      }
      setError(null)

      const { data, count, hasMore } = await fetchJobsFromDB(filters, page)

      if (append) {
        setJobs(prevJobs => {
          const existingIds = new Set(prevJobs.map((job: Job) => job.job_id))
          return [...prevJobs, ...data.filter((job: Job) => !existingIds.has(job.job_id))]
        })
      } else {
        setJobs(data)
      }

      setTotalCount(count)
      setHasMore(hasMore)
      setCurrentPage(page)

    } catch (error: any) {
      setError(error.message || 'Failed to fetch jobs')
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchJobs(0)
  }, [filters])

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(0)
    setJobs([])
  }

  const loadMore = () => {
    fetchJobs(currentPage + 1, true)
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1117]">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1117] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Job Opportunities</h1>
          <p className="text-gray-400">
            {totalCount > 0
              ? `${totalCount} job${totalCount !== 1 ? 's' : ''} available`
              : 'Discover your next career opportunity'}
          </p>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          onFiltersChange={handleFiltersChange}
          loading={loading || loadingMore}
        />

        {/* Jobs Count */}
        {jobs.length > 0 && !loading && (
          <div className="mb-6">
            <p className="text-sm text-gray-400">
              Showing {jobs.length} of {totalCount} job{totalCount !== 1 ? 's' : ''}
              {!hasMore && jobs.length === totalCount && ' (all jobs loaded)'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6">
            <div className="text-red-400">
              <p className="font-medium">Error loading jobs</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => fetchJobs(0)}
              className="mt-3 text-sm text-red-400 hover:text-red-300 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Jobs List */}
        <JobList jobs={jobs} loading={loading} />

        {/* Load More */}
        {hasMore && jobs.length > 0 && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="text-white px-8 py-3 rounded-xl transition-colors font-medium disabled:opacity-50"
              style={{ backgroundColor: '#29C115' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#24ab12')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#29C115')}
            >
              {loadingMore
                ? 'Loading...'
                : `Load More Jobs (${totalCount - jobs.length} remaining)`}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}