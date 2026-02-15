'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import FilterPanel, { FilterOptions } from '@/components/jobs/FIlterPanel'
import JobList from '@/components/jobs/JobList'

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

export default function JobsPage() {
  const { user, loading: authLoading } = useAuth()
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
    searchTerm: ''
  })
  const JOBS_PER_PAGE = 20

  const buildQuery = () => {
    let query = supabase
      .from('job_postings_ingest_test')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.searchTerm) {
      query = query.or(`job_title.ilike.%${filters.searchTerm}%,company_name.ilike.%${filters.searchTerm}%`)
    }

    if (filters.jobType) {
      query = query.eq('job_type', filters.jobType)
    }

    if (filters.state) {
      query = query.eq('state', filters.state)
    }

    if (filters.isRemote === 'remote') {
      query = query.eq('is_remote', true)
    } else if (filters.isRemote === 'onsite') {
      query = query.eq('is_remote', false)
    }

    return query
  }

  const fetchJobs = async (page: number = 0, append: boolean = false) => {
    try {
      if (page === 0) {
        setLoading(true)
        setCurrentPage(0)
      } else {
        setLoadingMore(true)
      }
      setError(null)

      const query = buildQuery()
      const { data, error: fetchError, count } = await query
        .range(page * JOBS_PER_PAGE, (page + 1) * JOBS_PER_PAGE - 1)

      if (fetchError) {
        throw fetchError
      }

      if (data) {
        if (append) {
          // Prevent duplicates by filtering out jobs that already exist
          setJobs(prevJobs => {
            const existingIds = new Set(prevJobs.map(job => job.id))
            const newJobs = data.filter(job => !existingIds.has(job.id))
            return [...prevJobs, ...newJobs]
          })
        } else {
          setJobs(data)
        }
        
        setTotalCount(count || 0)
        
        // Check if there are more jobs to load
        const totalLoaded = (page + 1) * JOBS_PER_PAGE
        setHasMore(count ? totalLoaded < count : false)
        
        // Always update currentPage to the page we just loaded
        setCurrentPage(page)
      }
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
  }, [filters]) // Refetch when filters change

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(0)
    setJobs([]) // Clear jobs to avoid showing old results while loading
  }

  const loadMore = () => {
    const nextPage = currentPage + 1
    fetchJobs(nextPage, true)
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
          <p className="text-gray-600">
            {totalCount > 0 ? `${totalCount} job${totalCount !== 1 ? 's' : ''} available` : 'Discover your next career opportunity'}
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
            <p className="text-sm text-gray-600">
              Showing {jobs.length} of {totalCount} job{totalCount !== 1 ? 's' : ''}
              {!hasMore && jobs.length === totalCount && ' (all jobs loaded)'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-700">
              <p className="font-medium">Error loading jobs</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => fetchJobs(0)}
              className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Jobs List */}
        <JobList jobs={jobs} loading={loading} />

        {/* Load More Button */}
        {hasMore && jobs.length > 0 && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
            >
              {loadingMore ? 'Loading...' : `Load More Jobs (${totalCount - jobs.length} remaining)`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}