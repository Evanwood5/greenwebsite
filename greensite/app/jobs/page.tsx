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
    <div className="min-h-screen bg-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Mockup Title */}
        <h1 className="text-4xl md:text-5xl font-medium text-center text-gray-900 mb-16 italic font-sans">
          Scraping jobs directly from the source
        </h1>

        <div className="flex flex-col md:flex-row gap-12 items-start mb-12">
          {/* Sidebar Filters */}
          <FilterPanel
            onFiltersChange={handleFiltersChange}
            loading={loading || loadingMore}
          />

          {/* Main Container - Black Box */}
          <div className="flex-1 bg-black rounded-[50px] p-8 md:p-12 shadow-2xl relative min-h-[600px]">
            {/* Custom scrollbar area implicitly handled by JobList overflow */}
            <JobList jobs={jobs} loading={loading} />

            {/* Load More Button inside or after */}
            {hasMore && jobs.length > 0 && !loading && (
              <div className="flex justify-center mt-12 mb-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-gray-800 text-white px-8 py-4 rounded-2xl hover:bg-gray-700 disabled:bg-gray-900 transition-colors font-bold text-lg border border-gray-700"
                >
                  {loadingMore ? 'Loading...' : `Load More Jobs (${totalCount - jobs.length})`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Discord Bottom Bar */}
        <div className="bg-gray-500 rounded-[35px] p-8 mt-12 flex items-center justify-between shadow-lg">
          <p className="text-3xl font-medium text-gray-900">
            Get jobs custom jobs based on resume
          </p>
          <Link
            href="/notifications"
            className="w-16 h-16 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
          >
            <svg className="w-10 h-10 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}