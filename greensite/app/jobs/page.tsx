'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'
import JobList from '@/components/jobs/JobList'
import { fetchJobsFromDB, Job } from '@/lib/jobsApi'

interface FilterOptions {
  jobType: string
  isRemote: string
  state: string
  searchTerm: string
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

const JOBS_PER_PAGE = 20

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #333',
  background: '#1a1a1a',
  color: 'white',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function JobsPage() {
  const { loading: authLoading } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({ jobType: '', isRemote: '', state: '', searchTerm: '' })
  const [searchInput, setSearchInput] = useState('')

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('job_postings_ingest_test')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (filters.searchTerm) query = query.or(`job_title.ilike.%${filters.searchTerm}%,company_name.ilike.%${filters.searchTerm}%`)
    if (filters.jobType) query = query.eq('job_type', filters.jobType)
    if (filters.state) query = query.eq('state', filters.state)
    if (filters.isRemote === 'remote') query = query.eq('is_remote', true)
    else if (filters.isRemote === 'onsite') query = query.eq('is_remote', false)

    return query
  }, [filters])

  const fetchJobs = useCallback(async (page: number = 0, append: boolean = false) => {
    try {
      page === 0 ? setLoading(true) : setLoadingMore(true)
      setError(null)

      const { data, error: fetchError, count } = await buildQuery()
        .range(page * JOBS_PER_PAGE, (page + 1) * JOBS_PER_PAGE - 1)

      if (fetchError) throw fetchError

      if (data) {
        if (append) {
          setJobs(prev => {
            const existing = new Set(prev.map(j => j.id))
            return [...prev, ...data.filter(j => !existing.has(j.id))]
          })
        } else {
          setJobs(data)
        }
        setTotalCount(count || 0)
        setHasMore(count ? (page + 1) * JOBS_PER_PAGE < count : false)
        setCurrentPage(page)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch jobs')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [buildQuery])

  useEffect(() => { fetchJobs(0) }, [fetchJobs])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.searchTerm !== searchInput) {
        setFilters(prev => ({ ...prev, searchTerm: searchInput }))
        setJobs([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, filters.searchTerm])

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setJobs([])
  }

  const statCards = [
    { label: 'Total Jobs', value: totalCount > 0 ? totalCount.toLocaleString() : '...', color: '#4ade80' },
    { label: 'New This Week', value: '89', color: '#60a5fa' },
    { label: 'Saved Jobs', value: '0', color: '#facc15' },
    { label: 'Applications', value: '0', color: '#f472b6' },
  ]

  if (authLoading) {
    return (
      <AppShell>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#9ca3af' }}>
          Loading...
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div style={{ maxWidth: '1100px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Job Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {totalCount > 0 ? `${totalCount.toLocaleString()} opportunities from partner companies` : 'Loading opportunities...'}
          </p>
        </div>

        {/* Filters */}
        <div style={{ background: '#1e1e1e', borderRadius: '12px', marginBottom: '20px', border: '1px solid #2a2a2a' }}>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 20px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FilterIcon />
              Filters
            </span>
            {filtersOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>

          {filtersOpen && (
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid #2a2a2a' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', paddingTop: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }}>Search</label>
                  <input type="text" placeholder="Title or company..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }}>Job Type</label>
                  <select value={filters.jobType} onChange={(e) => handleFilterChange('jobType', e.target.value)} style={inputStyle}>
                    <option value="">All Types</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }}>Location</label>
                  <select value={filters.isRemote} onChange={(e) => handleFilterChange('isRemote', e.target.value)} style={inputStyle}>
                    <option value="">All Locations</option>
                    <option value="remote">Remote Only</option>
                    <option value="onsite">On-site Only</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }}>State</label>
                  <select value={filters.state} onChange={(e) => handleFilterChange('state', e.target.value)} style={inputStyle}>
                    <option value="">All States</option>
                    {['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {statCards.map((card) => (
            <div key={card.label} style={{ background: '#1e1e1e', borderRadius: '12px', padding: '16px 20px', border: '1px solid #2a2a2a' }}>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>{card.label}</p>
              <p style={{ color: card.color, fontSize: '28px', fontWeight: 700 }}>{card.value}</p>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: '#2a1a1a', border: '1px solid #7f1d1d', borderRadius: '10px', padding: '16px', marginBottom: '20px', color: '#fca5a5', fontSize: '14px' }}>
            {error}
            <button onClick={() => fetchJobs(0)} style={{ marginLeft: '12px', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}>
              Try again
            </button>
          </div>
        )}

        <JobList jobs={jobs} loading={loading} />

        {hasMore && jobs.length > 0 && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <button
              onClick={() => fetchJobs(currentPage + 1, true)}
              disabled={loadingMore}
              style={{ padding: '10px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: loadingMore ? 'not-allowed' : 'pointer', opacity: loadingMore ? 0.7 : 1 }}
            >
              {loadingMore ? 'Loading...' : `Load More (${totalCount - jobs.length} remaining)`}
            </button>
          </div>
        )}

      </div>
    </AppShell>
  )
}
