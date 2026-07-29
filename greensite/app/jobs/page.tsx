'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'
import JobList from '@/components/jobs/JobList'
import { Job, JOB_FIELDS, fetchSubCategoryFieldIds } from '@/lib/jobsApi'
import { MICHIGAN_CITIES } from '@/lib/michiganCities'

// Stable IDs that never change — avoids async race condition on first load
// Other/Irrelevant field id from job_field_counts
const IRRELEVANT_FIELD_ID = 29244

interface FilterOptions {
  category: string
  subCategory: string
  level: string
  jobType: string
  isRemote: string
  city: string
  searchTerm: string
}

const sectionLabelStyle: React.CSSProperties = {
  color: '#52525b',
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: '4px',
  marginTop: '12px',
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

const JOBS_PER_PAGE = 20

interface DropdownOption { label: string; value: string; icon?: React.ReactNode; iconColor?: string }

function DropdownSelect({ value, onChange, options, disabled }: { value: string; onChange: (v: string) => void; options: DropdownOption[]; disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value) ?? options[0]
  const hasValue = Boolean(value)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', opacity: disabled ? 0.45 : 1 }}>
      <button
        onClick={() => { if (!disabled) setOpen(o => !o) }}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 10px',
          borderRadius: '4px',
          border: hasValue
            ? '1px solid rgba(255,255,255,0.18)'
            : `1px solid ${open ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
          background: hasValue
            ? 'rgba(255,255,255,0.07)'
            : open ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
          color: hasValue ? '#e4e4e7' : open ? '#e4e4e7' : '#52525b',
          fontSize: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          transition: 'border-color 150ms, background 150ms, color 150ms',
          gap: '6px',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
          {selected.icon && (
            <span style={{ flexShrink: 0, color: hasValue ? '#e4e4e7' : selected.iconColor ?? '#52525b', display: 'flex', alignItems: 'center' }}>
              {selected.icon}
            </span>
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected.label}</span>
        </span>
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, color: hasValue ? '#a1a1aa' : '#52525b', transition: 'transform 150ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: '#1e1e1e',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '4px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          zIndex: 100,
          overflow: 'hidden',
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {options.map(opt => {
            const isActive = opt.value === value
            return (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left',
                  padding: '8px 10px',
                  fontSize: '12px',
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: isActive ? '#ffffff' : '#a1a1aa',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 100ms',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                {opt.icon && (
                  <span style={{ flexShrink: 0, color: opt.iconColor ?? '#52525b', display: 'flex', alignItems: 'center' }}>
                    {opt.icon}
                  </span>
                )}
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
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
  const [filters, setFilters] = useState<FilterOptions>(() => {
    const empty: FilterOptions = { category: '', subCategory: '', level: '', jobType: '', isRemote: '', city: '', searchTerm: '' }
    if (typeof window === 'undefined') return empty
    try {
      const saved = localStorage.getItem('jobFilters')
      return saved ? { ...empty, ...JSON.parse(saved) } : empty
    } catch { return empty }
  })
  const [searchInput, setSearchInput] = useState(() => {
    if (typeof window === 'undefined') return ''
    try {
      const saved = localStorage.getItem('jobFilters')
      return saved ? JSON.parse(saved).searchTerm ?? '' : ''
    } catch { return '' }
  })
  const [categoryFieldIds, setCategoryFieldIds] = useState<number[]>([])
  const [subCategoryFieldIds, setSubCategoryFieldIds] = useState<number[]>([])
  const [fieldCategoryMap, setFieldCategoryMap] = useState<Record<number, string>>({})
  const [fieldSubCategoryMap, setFieldSubCategoryMap] = useState<Record<number, string>>({})

  useEffect(() => {
    localStorage.setItem('jobFilters', JSON.stringify(filters))
  }, [filters])

  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setSavedJobIds(new Set(data?.map((r: any) => r.job_id) ?? []))
      })
  }, [user?.id])

  const handleSaveToggle = async (jobId: string, willBeSaved: boolean) => {
    if (!user?.id) return
    setSavedJobIds(prev => {
      const next = new Set(prev)
      willBeSaved ? next.add(jobId) : next.delete(jobId)
      return next
    })
    if (willBeSaved) {
      await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: jobId })
    } else {
      await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', jobId)
    }
  }

  // Build fieldCategoryMap and fieldSubCategoryMap for job icons and subcategory display
  useEffect(() => {
    supabase
      .from('job_field_counts')
      .select('id, category, subcategory')
      .then(({ data }) => {
        const catMap: Record<number, string> = {}
        const subMap: Record<number, string> = {}
        data?.forEach(r => {
          catMap[r.id] = r.category.toLowerCase()
          subMap[r.id] = r.subcategory
        })
        setFieldCategoryMap(catMap)
        setFieldSubCategoryMap(subMap)
      })
  }, [])

  useEffect(() => {
    if (!filters.category) { setCategoryFieldIds([]); return }
    supabase
      .from('job_field_counts')
      .select('id')
      .ilike('category', filters.category)
      .then(({ data }) => setCategoryFieldIds(data?.map(r => r.id) ?? []))
  }, [filters.category])

  useEffect(() => {
    if (!filters.category || !filters.subCategory) { setSubCategoryFieldIds([]); return }
    fetchSubCategoryFieldIds(filters.category, filters.subCategory)
      .then(setSubCategoryFieldIds)
  }, [filters.category, filters.subCategory])

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('job_postings_ingest_test')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .eq('is_relevant', true)
      // Always exclude irrelevant jobs — hardcoded to avoid async race condition
      .neq('job_field_id', IRRELEVANT_FIELD_ID)

    if (filters.searchTerm) query = query.or(`job_title.ilike.%${filters.searchTerm}%,company_name.ilike.%${filters.searchTerm}%`)
    if (filters.category) {
      const activeIds = filters.subCategory ? subCategoryFieldIds : categoryFieldIds
      if (activeIds.length > 0) query = query.in('job_field_id', activeIds)
      else query = query.eq('job_field_id', -1)
    }
    if (filters.level) query = query.eq('experience_level', filters.level)
    if (filters.jobType) query = query.eq('job_type', filters.jobType)
    if (filters.city) query = query.eq('city', filters.city)
    if (filters.isRemote === 'remote') query = query.eq('is_remote', true)
    else if (filters.isRemote === 'onsite') query = query.eq('is_remote', false)

    return query
  }, [filters, categoryFieldIds, subCategoryFieldIds])

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

  const buildCountQuery = useCallback((dateFrom: Date) => {
  let query = supabase
    .from('job_postings_ingest_test')
    .select('*', { count: 'exact', head: true })
    .eq('is_relevant', true)
    .neq('job_field_id', IRRELEVANT_FIELD_ID)
    .gte('created_at', dateFrom.toISOString())

  if (filters.searchTerm) query = query.or(`job_title.ilike.%${filters.searchTerm}%,company_name.ilike.%${filters.searchTerm}%`)
  if (filters.category) {
    const activeIds = filters.subCategory ? subCategoryFieldIds : categoryFieldIds
    if (activeIds.length > 0) query = query.in('job_field_id', activeIds)
    else query = query.eq('job_field_id', -1)
  }
  if (filters.level) query = query.eq('experience_level', filters.level)
  if (filters.jobType) query = query.eq('job_type', filters.jobType)
  if (filters.city) query = query.eq('city', filters.city)
  if (filters.isRemote === 'remote') query = query.eq('is_remote', true)
  else if (filters.isRemote === 'onsite') query = query.eq('is_remote', false)

  return query
}, [filters, categoryFieldIds, subCategoryFieldIds])

const fetchNewThisMonthCount = useCallback(async () => {
  const start = new Date(Date.now() - 30 * 86400000)
  const { count } = await buildCountQuery(start)
  setNewThisMonthCount(count || 0)
}, [buildCountQuery])

const fetchNewThisWeekCount = useCallback(async () => {
  const start = new Date(Date.now() - 7 * 86400000)
  const { count } = await buildCountQuery(start)
  setNewThisWeekCount(count || 0)
}, [buildCountQuery])


  useEffect(() => { fetchJobs(0) }, [fetchJobs])
  useEffect(() => { fetchNewThisMonthCount() }, [fetchNewThisMonthCount])
  useEffect(() => { fetchNewThisWeekCount() }, [fetchNewThisWeekCount])

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

  const statCards = [
    { label: 'Past 30 Days', value: newThisMonthCount > 0 ? newThisMonthCount.toLocaleString() : '...', color: '#4ade80', labelColor: '#6ee7a0', bg: 'rgba(41,193,21,0.13)', border: 'rgba(41,193,21,0.28)' },
    { label: 'Past 7 Days', value: newThisWeekCount > 0 ? newThisWeekCount.toLocaleString() : '...', color: '#93c5fd', labelColor: '#7dd3fc', bg: 'rgba(96,165,250,0.13)', border: 'rgba(96,165,250,0.28)' },
    { label: 'Saved Jobs', value: savedJobIds.size.toString(), color: '#fb923c', labelColor: '#fdba74', bg: 'rgba(249,115,22,0.13)', border: 'rgba(249,115,22,0.28)' },
    { label: 'Tracking', value: '0', color: '#c4b5fd', labelColor: '#ddd6fe', bg: 'rgba(139,92,246,0.18)', border: 'rgba(139,92,246,0.38)' },
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

  const activeFilterCount = [filters.category, filters.subCategory, filters.level, filters.jobType, filters.isRemote, filters.city, filters.searchTerm].filter(Boolean).length

  return (
    <AppShell>
      <div style={{ display: 'flex', gap: '20px', maxWidth: '1300px', margin: '0 auto', alignItems: 'flex-start' }}>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
            {statCards.map((card) => (
              <div key={card.label} style={{ background: card.bg, borderRadius: '4px', padding: '12px 14px', border: `1px solid ${card.border}` }}>
                <p style={{ color: (card as any).labelColor ?? '#71717a', fontSize: '11px', marginBottom: '6px', fontWeight: 500 }}>{card.label}</p>
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

          <JobList
            jobs={jobs}
            loading={loading}
            fieldCategoryMap={fieldCategoryMap}
            fieldSubCategoryMap={fieldSubCategoryMap}
            savedJobIds={[...savedJobIds]}
            onSaveToggle={handleSaveToggle}
          />

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

        {/* Right filter panel */}
        <div style={{ width: '180px', flexShrink: 0, position: 'sticky', top: '0' }}>
          <div style={{ background: '#1e1e1e', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e4e4e7', fontSize: '12px', fontWeight: 600 }}>
                <FilterIcon />
                Filters
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { const empty = { category: '', subCategory: '', level: '', jobType: '', isRemote: '', city: '', searchTerm: '' }; setFilters(empty); setSearchInput(''); localStorage.setItem('jobFilters', JSON.stringify(empty)) }}
                  style={{ background: 'none', border: 'none', color: '#52525b', fontSize: '11px', cursor: 'pointer', padding: '0' }}
                >
                  Clear all
                </button>
              )}
            </div>

            <div style={{ position: 'relative', margin: '10px 0 14px' }}>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: '#52525b', pointerEvents: 'none' }}
              >
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Title or company..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 28px 8px 28px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: '#141414',
                  color: '#e4e4e7',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#52525b', cursor: 'pointer', padding: '0', lineHeight: 1, fontSize: '14px' }}
                >
                  ×
                </button>
              )}
            </div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '4px' }} />

            <p style={sectionLabelStyle}>Category</p>
            <DropdownSelect
              value={filters.category}
              onChange={(v) => handleFilterChange('category', v)}
              options={[
                { label: 'All Categories', value: '' },
                {
                  label: 'Tech', value: 'Tech', iconColor: '#60a5fa',
                  icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
                },
                {
                  label: 'Engineering', value: 'Engineering', iconColor: '#f97316',
                  icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
                },
                {
                  label: 'Health', value: 'Health', iconColor: '#f43f5e',
                  icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
                },
                {
                  label: 'Business', value: 'Business', iconColor: '#a78bfa',
                  icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                },
              ]}
            />

            <p style={{ ...sectionLabelStyle, color: filters.category ? '#71717a' : '#3f3f46' }}>Sub-category</p>
            <DropdownSelect
              value={filters.subCategory}
              onChange={(v) => handleFilterChange('subCategory', v)}
              disabled={!filters.category}
              options={[
                { label: filters.category ? 'All Sub-categories' : 'Select a category first', value: '' },
                ...(filters.category ? (JOB_FIELDS[filters.category] ?? []).map(s => ({ label: s, value: s })) : []),
              ]}
            />

            <p style={sectionLabelStyle}>Level</p>
            <DropdownSelect
              value={filters.level}
              onChange={(v) => handleFilterChange('level', v)}
              options={[
                { label: 'All Levels', value: '' },
                { label: 'Moderate', value: 'moderate' },
                { label: 'Advanced', value: 'advanced' },
              ]}
            />

            <p style={sectionLabelStyle}>Job Type</p>
            <DropdownSelect
              value={filters.jobType}
              onChange={(v) => handleFilterChange('jobType', v)}
              options={[
                { label: 'All Types', value: '' },
                { label: 'Full Time', value: 'Full Time' },
                { label: 'Part Time', value: 'Part Time' },
                { label: 'Internship', value: 'Internship' },
              ]}
            />

            <p style={sectionLabelStyle}>City</p>
            <DropdownSelect
              value={filters.city}
              onChange={(v) => handleFilterChange('city', v)}
              options={[
                { label: 'All Cities', value: '' },
                ...MICHIGAN_CITIES
                  .filter(c => c.value !== 'MI:all')
                  .map(c => ({ label: c.label, value: c.label }))
              ]}
            />

            <p style={sectionLabelStyle}>Remote</p>
            <DropdownSelect
              value={filters.isRemote}
              onChange={(v) => handleFilterChange('isRemote', v)}
              options={[
                { label: 'All', value: '' },
                { label: 'Remote Only', value: 'remote' },
                { label: 'On-site Only', value: 'onsite' },
              ]}
            />
          </div>
        </div>

      </div>
    </AppShell>
  )
}
