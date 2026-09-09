'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/layout/AppShell'
import JobList from '@/components/jobs/JobList'
import { getFieldMaps, resolveFieldIds, fetchJobs, countJobsSince } from '@/lib/services/jobs'
import { getSavedJobIds, toggleJobSaved } from '@/lib/services/savedJobs'
import { JOBS_PER_PAGE, Job, FilterOptions, EMPTY_FILTERS } from './types'
import { StatCard, FilterPanel, ErrorBanner, LoadMoreButton } from './components'

function loadFiltersFromStorage(): FilterOptions {
  const empty = { ...EMPTY_FILTERS }
  if (typeof window === 'undefined') return empty
  try {
    const saved = localStorage.getItem('jobFilters')
    return saved ? { ...empty, ...JSON.parse(saved) } : empty
  } catch { return empty }
}

export default function JobsPage() {
  const { user, loading: authLoading } = useAuth()
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set())
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [newThisMonthCount, setNewThisMonthCount] = useState(0)
  const [newThisWeekCount, setNewThisWeekCount] = useState(0)
  const [michiganCities, setMichiganCities] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterOptions>(loadFiltersFromStorage)
  const [searchInput, setSearchInput] = useState(() => {
    if (typeof window === 'undefined') return ''
    try {
      const saved = localStorage.getItem('jobFilters')
      return saved ? JSON.parse(saved).searchTerm ?? '' : ''
    } catch { return '' }
  })
  const [fieldCategoryMap, setFieldCategoryMap] = useState<Record<number, string>>({})
  const [fieldSubCategoryMap, setFieldSubCategoryMap] = useState<Record<number, string>>({})
  const requestRef = useRef(0)
  const fieldIdCacheRef = useRef(new Map<string, number[]>())

  useEffect(() => {
    fetch('/api/cities')
      .then(r => r.json())
      .then(data => setMichiganCities(data.cities ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('jobFilters', JSON.stringify(filters))
  }, [filters])

  useEffect(() => {
    if (!user?.id) return
    getSavedJobIds(user.id)
      .then(ids => setSavedJobIds(new Set(ids)))
      .catch(() => {})
  }, [user?.id])

  const handleSaveToggle = async (jobId: string, willBeSaved: boolean) => {
    if (!user?.id) return
    setSavedJobIds(prev => {
      const next = new Set(prev)
      if (willBeSaved) next.add(jobId)
      else next.delete(jobId)
      return next
    })
    try {
      await toggleJobSaved(user.id, jobId, willBeSaved)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update saved job')
    }
  }

  // Build fieldCategoryMap and fieldSubCategoryMap for job icons and subcategory display
  useEffect(() => {
    getFieldMaps().then(({ category, subCategory }) => {
      setFieldCategoryMap(category)
      setFieldSubCategoryMap(subCategory)
    })
  }, [])

  const resolveFieldIdsCached = useCallback(async (category: string, subCategory: string): Promise<number[]> => {
    if (!category) return []
    const key = `${category}|${subCategory}`
    const cached = fieldIdCacheRef.current.get(key)
    if (cached) return cached
    const ids = await resolveFieldIds(category, subCategory)
    fieldIdCacheRef.current.set(key, ids)
    return ids
  }, [])

  const refreshAll = useCallback(async () => {
    const requestId = ++requestRef.current
    setLoading(true)
    setError(null)
    try {
      const fieldIds = await resolveFieldIdsCached(filters.category, filters.subCategory)
      const monthStart = new Date(Date.now() - 30 * 86400000)
      const weekStart = new Date(Date.now() - 7 * 86400000)

      const [jobsResult, monthResult, weekResult] = await Promise.all([
        fetchJobs(filters, fieldIds, 0, JOBS_PER_PAGE - 1),
        countJobsSince(filters, fieldIds, monthStart),
        countJobsSince(filters, fieldIds, weekStart),
      ])

      if (requestId !== requestRef.current) return

      setJobs(jobsResult.data)
      setTotalCount(jobsResult.count)
      setHasMore(jobsResult.hasMore)
      setCurrentPage(0)
      setNewThisMonthCount(monthResult)
      setNewThisWeekCount(weekResult)
    } catch (err: unknown) {
      if (requestId !== requestRef.current) return
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
    } finally {
      if (requestId === requestRef.current) setLoading(false)
    }
  }, [filters, resolveFieldIdsCached])

  const loadMore = useCallback(async () => {
    if (!hasMore) return
    const requestId = ++requestRef.current
    setLoadingMore(true)
    try {
      const fieldIds = await resolveFieldIdsCached(filters.category, filters.subCategory)
      const result = await fetchJobs(
        filters,
        fieldIds,
        (currentPage + 1) * JOBS_PER_PAGE,
        (currentPage + 2) * JOBS_PER_PAGE - 1,
      )

      if (requestId !== requestRef.current) return

      setJobs(prev => {
        const existing = new Set(prev.map(j => j.job_id))
        return [...prev, ...result.data.filter(j => !existing.has(j.job_id))]
      })
      setTotalCount(result.count)
      setHasMore(result.hasMore)
      setCurrentPage(currentPage + 1)
    } catch (err: unknown) {
      if (requestId !== requestRef.current) return
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
    } finally {
      if (requestId === requestRef.current) setLoadingMore(false)
    }
  }, [filters, resolveFieldIdsCached, hasMore, currentPage])

  useEffect(() => { refreshAll() }, [refreshAll])

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
    setFilters(prev => key === 'category'
      ? { ...prev, category: value, subCategory: '' }
      : { ...prev, [key]: value }
    )
    setJobs([])
  }

  const handleClearFilters = () => {
    setFilters({ ...EMPTY_FILTERS })
    setSearchInput('')
    localStorage.setItem('jobFilters', JSON.stringify(EMPTY_FILTERS))
  }

  const statCards = [
    { label: 'Past 30 Days', value: loading ? '...' : newThisMonthCount.toLocaleString(), color: '#4ade80' },
    { label: 'Past 7 Days',  value: loading ? '...' : newThisWeekCount.toLocaleString(),  color: '#93c5fd' },
    { label: 'Saved Jobs',   value: savedJobIds.size.toString(),                          color: '#fb923c' },
    { label: 'Tracking',     value: '0',                                                  color: '#c4b5fd' },
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
      <div style={{ display: 'flex', gap: '20px', maxWidth: '1300px', margin: '0 auto', alignItems: 'flex-start' }}>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
            {statCards.map((card) => (
              <StatCard key={card.label} label={card.label} value={card.value} color={card.color} />
            ))}
          </div>

          {error && <ErrorBanner message={error} onRetry={refreshAll} />}

          <JobList
            jobs={jobs}
            loading={loading}
            fieldCategoryMap={fieldCategoryMap}
            fieldSubCategoryMap={fieldSubCategoryMap}
            savedJobIds={[...savedJobIds]}
            onSaveToggle={handleSaveToggle}
          />

          {hasMore && jobs.length > 0 && !loading && (
            <LoadMoreButton
              totalRemaining={totalCount - jobs.length}
              loading={loadingMore}
              onLoadMore={loadMore}
            />
          )}
        </div>

        {/* Right filter panel */}
        <FilterPanel
          filters={filters}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
          michiganCities={michiganCities}
        />

      </div>
    </AppShell>
  )
}