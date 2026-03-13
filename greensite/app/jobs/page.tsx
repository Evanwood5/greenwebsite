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
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-green-100">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Authentication Required
          </h2>

          <p className="text-gray-600 mb-8">
            Please sign in to access our full list of Michigan job opportunities and custom matching.
          </p>

          <Link
            href="/auth"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition shadow-md hover:shadow-lg"
          >
            Sign In to Continue
          </Link>

          <p className="mt-6 text-sm text-gray-500 italic">
            Get personalized job matches based on your resume and preferences.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Job Opportunities
          </h1>
          <p className="text-xl text-gray-600 italic">
            Scraping jobs directly from the source
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          {/* Sidebar Filters */}
          <FilterPanel
            onFiltersChange={handleFiltersChange}
            loading={loading || loadingMore}
          />

          {/* Main Container - Clean Card */}
          <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-green-100 min-h-[600px]">
            <JobList jobs={jobs} loading={loading} />

            {/* Load More Button */}
            {hasMore && jobs.length > 0 && !loading && (
              <div className="flex justify-center mt-12 mb-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 disabled:bg-green-400 transition-colors font-bold text-lg"
                >
                  {loadingMore ? 'Loading...' : `Load More Jobs (${totalCount - jobs.length})`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Discord Notifications Section */}
        <div className="bg-green-600 rounded-3xl p-8 mt-12 flex flex-col md:flex-row items-center justify-between shadow-lg text-white">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Discord Notifications</h2>
            <p className="text-green-100">
              Get custom jobs matching your resume delivered instantly.
            </p>
          </div>
          <Link
            href="/notifications"
            className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-sm"
          >
            Connect Discord
          </Link>
        </div>
      </div>
    </div>
  )
}