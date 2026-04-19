'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'
import JobList from '@/components/jobs/JobList'
import { Job } from '@/lib/jobsApi'

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
  padding: '6px 10px',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: '#111',
  color: '#e4e4e7',
  fontSize: '12px',
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
            const existing = new Set(prev.map(j => j.job_id))
            return [...prev, ...data.filter(j => !existing.has(j.job_id))]
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
    { label: 'Total Jobs', value: totalCount > 0 ? totalCount.toLocaleString() : '...', color: '#29C115', bg: 'rgba(41,193,21,0.08)', border: 'rgba(41,193,21,0.15)' },
    { label: 'New This Week', value: '89', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.15)' },
    { label: 'Saved Jobs', value: '0', color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.15)' },
    { label: 'Applications', value: '0', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.15)' },
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
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '2px', letterSpacing: '-0.02em' }}>Job Dashboard</h1>
          <p style={{ color: '#52525b', fontSize: '12px' }}>
            {totalCount > 0 ? `${totalCount.toLocaleString()} opportunities from partner companies` : 'Loading opportunities...'}
          </p>
        </div>

        {/* Filters */}
        <div style={{ background: '#0d0d0d', borderRadius: '10px', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FilterIcon />
              Filters
            </span>
            {filtersOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>

          {filtersOpen && (
            <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', paddingTop: '12px' }}>
                <div>
                  <label style={{ display: 'block', color: '#52525b', fontSize: '11px', marginBottom: '4px' }}>Search</label>
                  <input type="text" placeholder="Title or company..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#52525b', fontSize: '11px', marginBottom: '4px' }}>Job Type</label>
                  <select value={filters.jobType} onChange={(e) => handleFilterChange('jobType', e.target.value)} style={inputStyle}>
                    <option value="">All Types</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#52525b', fontSize: '11px', marginBottom: '4px' }}>Location</label>
                  <select value={filters.isRemote} onChange={(e) => handleFilterChange('isRemote', e.target.value)} style={inputStyle}>
                    <option value="">All Locations</option>
                    <option value="remote">Remote Only</option>
                    <option value="onsite">On-site Only</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#52525b', fontSize: '11px', marginBottom: '4px' }}>State</label>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
          {statCards.map((card) => (
            <div key={card.label} style={{ background: card.bg, borderRadius: '10px', padding: '12px 14px', border: `1px solid ${card.border}` }}>
              <p style={{ color: '#52525b', fontSize: '11px', marginBottom: '6px', fontWeight: 500 }}>{card.label}</p>
              <p style={{ color: card.color, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>{card.value}</p>
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
              style={{ padding: '8px 20px', background: 'rgba(41,193,21,0.1)', color: '#29C115', border: '1px solid rgba(41,193,21,0.2)', borderRadius: '7px', fontWeight: 500, fontSize: '12px', cursor: loadingMore ? 'not-allowed' : 'pointer', opacity: loadingMore ? 0.6 : 1 }}
            >
              {loadingMore ? 'Loading...' : `Load More (${totalCount - jobs.length} remaining)`}
            </button>
          </div>
        )}

      </div>
    </AppShell>
  )
}
