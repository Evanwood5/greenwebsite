'use client'

import { useState, useEffect, useCallback } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useAuth } from '@/contexts/AuthContext'
import { JOB_FIELDS } from '@/lib/api/jobsApi'
import {
  listTrackedCompanies,
  createTrackedCompany,
  deleteTrackedCompany,
  getMatchedJobs,
} from '@/lib/services/tracking'
import {
  MAX_TRACKED,
  TrackedCompany,
  TrackingFilters,
  EMPTY_FILTERS,
  DropdownOption,
} from './types'
import { Job } from '@/app/jobs/types'
import {
  TrackCompanyCard,
  TrackedList,
  MatchedJobsPanel,
  CapNotice,
  EyeIcon,
} from './components'

export default function TrackingPage() {
  const { user } = useAuth()
  const [company, setCompany] = useState('')
  const [companyValid, setCompanyValid] = useState(false)
  const [companyOptions, setCompanyOptions] = useState<string[]>([])
  const [companyLoading, setCompanyLoading] = useState(true)
  const [filters, setFilters] = useState<TrackingFilters>(EMPTY_FILTERS)
  const [tracked, setTracked] = useState<TrackedCompany[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [companyCities, setCompanyCities] = useState<string[]>([])
  const [allCityOptions, setAllCityOptions] = useState<DropdownOption[]>([])

  useEffect(() => {
    fetch('/api/cities')
      .then(r => r.json())
      .then(data => setAllCityOptions([
        { label: 'All Cities', value: '' },
        ...(data.cities ?? []).map((c: string) => ({ label: c, value: c }))
      ]))
      .catch(() => setAllCityOptions([{ label: 'All Cities', value: '' }]))
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/companies/list')
        const data = await res.json()
        if (!cancelled) {
          setCompanyOptions(Array.isArray(data?.companies) ? data.companies.filter((c: string) => typeof c === 'string') : [])
        }
      } catch {
        if (!cancelled) setCompanyOptions([])
      } finally {
        if (!cancelled) setCompanyLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const loadMatches = useCallback(async (entries: TrackedCompany[]) => {
    if (!user?.id) return
    if (entries.length === 0) { setMatchedJobs([]); return }
    setLoadingJobs(true)
    try {
      const jobs = await getMatchedJobs(user.id, entries)
      setMatchedJobs(jobs)
    } catch (err) { console.error('Error loading matched jobs:', err) }
    finally { setLoadingJobs(false) }
  }, [user?.id])

  const loadTracking = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const data = await listTrackedCompanies(user.id)
      setTracked(data)
      if (data.length > 0) loadMatches(data)
    } catch (err) { console.error('Error loading tracking:', err) }
    finally { setLoading(false) }
  }, [user?.id, loadMatches])

  useEffect(() => {
    if (user?.id) loadTracking()
  }, [user?.id, loadTracking])

  useEffect(() => {
    if (!companyValid || !company) {
      setCompanyCities([])
      setFilters(EMPTY_FILTERS)
      return
    }
    let cancelled = false
    fetch(`/api/companies/locations?company=${encodeURIComponent(company)}`)
      .then(r => r.json())
      .then(data => { if (!cancelled) setCompanyCities(data.cities ?? []) })
      .catch(() => { if (!cancelled) setCompanyCities([]) })
    return () => { cancelled = true }
  }, [company, companyValid])

  const atLimit = tracked.length >= MAX_TRACKED
  const activeFilterCount = [filters.category, filters.level, filters.jobType, filters.location, ...filters.city, ...filters.subcategories].filter(Boolean).length
  const canTrack = companyValid && !atLimit
  const cityOptions: DropdownOption[] = companyCities.length > 0
    ? [{ label: 'All Cities', value: '' }, ...companyCities.map(c => ({ label: c, value: c }))]
    : allCityOptions
  const subcategoryList = filters.category ? (JOB_FIELDS[filters.category] ?? []) : []

  const handleCompanyChange = (v: string) => { setCompany(v); setCompanyValid(false); setError('') }
  const handleCompanySelect = (v: string) => { setCompany(v); setCompanyValid(true); setError('') }

  const handleFilterChange = (update: Partial<TrackingFilters>) => {
    setFilters(f => ({ ...f, ...update }))
  }

  const handleCategoryChange = (v: string) => {
    setFilters(f => ({ ...f, category: v, subcategories: [] }))
  }

  const handleSubcategoryToggle = (sub: string) => {
    setFilters(f => ({
      ...f,
      subcategories: f.subcategories.includes(sub)
        ? f.subcategories.filter(s => s !== sub)
        : [...f.subcategories, sub],
    }))
  }

  const handleClearFilters = () => setFilters(EMPTY_FILTERS)

  async function handleTrack() {
    if (!user?.id) return
    if (atLimit) { setError(`You can track up to ${MAX_TRACKED} companies.`); return }
    const name = company.trim()
    if (!name) { setError('Please enter a company name.'); return }
    if (tracked.some(t => t.company_name.toLowerCase() === name.toLowerCase())) {
      setError('You are already tracking this company.'); return
    }
    setSaving(true)
    try {
      const created = await createTrackedCompany(user.id, name, filters)
      setTracked(prev => [created, ...prev])
      setCompany('')
      setCompanyValid(false)
      setFilters(EMPTY_FILTERS)
      setError('')
    } catch (err) { console.error('Error saving tracking:', err); setError('Failed to save. Please try again.') }
    finally { setSaving(false) }
  }

  async function handleRemove(id: string) {
    if (!user?.id) return
    try {
      await deleteTrackedCompany(user.id, id)
      const next = tracked.filter(t => t.id !== id)
      setTracked(next)
      loadMatches(next)
    } catch (err) { console.error('Error removing tracking:', err) }
  }

  return (
    <AppShell>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', flexShrink: 0 }}>
            <EyeIcon size={16} />
          </div>
          <div>
            <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '1px', letterSpacing: '-0.02em' }}>Company Tracking</h1>
            <p style={{ color: '#52525b', fontSize: '12px' }}>Follow specific companies and filter the roles you care about. New matching jobs are delivered daily.</p>
          </div>
        </div>

        <CapNotice max={MAX_TRACKED} />

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '14px', alignItems: 'start' }}>

          {/* Left — setup + tracked list */}
          <div>
            {!atLimit && (
              <TrackCompanyCard
                company={company}
                companyOptions={companyOptions}
                companyValid={companyValid}
                companyLoading={companyLoading}
                error={error}
                filters={filters}
                activeFilterCount={activeFilterCount}
                cityOptions={cityOptions}
                subcategoryList={subcategoryList}
                canTrack={canTrack}
                saving={saving}
                onCompanyChange={handleCompanyChange}
                onCompanySelect={handleCompanySelect}
                onFilterChange={handleFilterChange}
                onCategoryChange={handleCategoryChange}
                onSubcategoryToggle={handleSubcategoryToggle}
                onClearFilters={handleClearFilters}
                onTrack={handleTrack}
              />
            )}

            <TrackedList tracked={tracked} loading={loading} max={MAX_TRACKED} onRemove={handleRemove} />
          </div>

          {/* Right — matched jobs */}
          <MatchedJobsPanel jobs={matchedJobs} loading={loadingJobs} trackedCount={tracked.length} />

        </div>
      </div>
    </AppShell>
  )
}