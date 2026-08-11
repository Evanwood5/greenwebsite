'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { MICHIGAN_CITIES } from '@/lib/michiganCities'
import { JOB_FIELDS } from '@/lib/jobsApi'
import { DarkJobCard } from '@/components/jobs/JobList'

const MAX_TRACKED = 2

interface TrackedCompany {
  id: string
  company_name: string
  filters: TrackingFilters
  created_at: string
}

interface TrackingFilters {
  category: string
  subcategories: string[]
  level: string
  jobType: string
  location: string
  city: string
}

const EMPTY_FILTERS: TrackingFilters = {
  category: '',
  subcategories: [],
  level: '',
  jobType: '',
  location: '',
  city: '',
}

const ACCENT = '#a78bfa'
const ACTIVE_BG = 'rgba(255,255,255,0.08)'
const ACTIVE_BG_LIGHT = 'rgba(255,255,255,0.04)'
const BORDER = 'rgba(255,255,255,0.10)'
const BORDER_STRONG = 'rgba(255,255,255,0.18)'

const sectionLabel: React.CSSProperties = {
  color: '#52525b',
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: '4px',
  marginTop: '12px',
}

interface DropdownOption { label: string; value: string }

const CITY_OPTIONS: DropdownOption[] = [
  { label: 'All Cities', value: '' },
  ...MICHIGAN_CITIES
    .filter(c => c.value !== 'MI:all')
    .map(c => ({ label: c.label, value: c.label })),
]

function DropdownSelect({ value, onChange, options, placeholder, disabled }: {
  value: string
  onChange: (v: string) => void
  options: DropdownOption[]
  placeholder?: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value)

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
          border: value
            ? '1px solid rgba(255,255,255,0.18)'
            : `1px solid ${open ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
          background: value
            ? 'rgba(255,255,255,0.07)'
            : open ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
          color: value ? '#e4e4e7' : open ? '#e4e4e7' : '#52525b',
          fontSize: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          transition: 'border-color 150ms, background 150ms, color 150ms',
          gap: '6px',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.label ?? placeholder ?? 'Select...'}
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, color: value ? '#a1a1aa' : '#52525b', transition: 'transform 150ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          zIndex: 100, overflow: 'hidden', maxHeight: '200px', overflowY: 'auto',
        }}>
          {options.map(opt => {
            const isActive = opt.value === value
            return (
              <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', textAlign: 'left',
                  padding: '8px 10px', fontSize: '12px',
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: isActive ? '#ffffff' : '#a1a1aa',
                  border: 'none', cursor: 'pointer', transition: 'background 100ms',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function EyeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function XIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function filterSummary(filters: TrackingFilters): string {
  const parts: string[] = []
  if (filters.category) parts.push(filters.category)
  if (filters.subcategories?.length) parts.push(filters.subcategories.join(', '))
  if (filters.level) parts.push(filters.level)
  if (filters.jobType) parts.push(filters.jobType)
  if (filters.location === 'remote') parts.push('Remote')
  else if (filters.location === 'onsite') parts.push('On-site')
  if (filters.city) parts.push(filters.city)
  return parts.length ? parts.join(' \u00b7 ') : 'All jobs'
}

interface CompanySuggestion {
  company: string
  jobCount: number
}

function CompanyInput({ value, onChange, onSelect, error }: {
  value: string
  onChange: (v: string) => void
  onSelect: (v: string) => void
  error: string
}) {
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const justSelectedRef = useRef(false)

  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/companies/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        const companies: CompanySuggestion[] = Array.isArray(data?.companies)
          ? data.companies
            .filter((c: any) => typeof c?.company === 'string')
            .map((c: any) => ({ company: c.company, jobCount: c.jobCount ?? 0 }))
          : []
        setSuggestions(companies)
        setShowSuggestions(true)
        setHighlighted(-1)
      } catch {
        setSuggestions([])
      }
    }, 250)
  }, [])

  useEffect(() => {
    if (justSelectedRef.current) {
      justSelectedRef.current = false
      setSuggestions([])
      setHighlighted(-1)
      return
    }
    fetchSuggestions(value)
  }, [value, fetchSuggestions])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(name: string) {
    justSelectedRef.current = true
    onSelect(name)
    setShowSuggestions(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, -1)) }
    else if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); handleSelect(suggestions[highlighted].company) }
    else if (e.key === 'Escape') setShowSuggestions(false)
  }

  const canTrack = value.trim().length > 0

  return (
    <div ref={containerRef} style={{ position: 'relative', marginBottom: '6px' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#52525b', pointerEvents: 'none', zIndex: 1 }}>
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="e.g. Google, Ford, Stryker..."
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
        style={{
          width: '100%', padding: '9px 12px 9px 36px', borderRadius: '4px',
          border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : canTrack ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)'}`,
          background: '#141414', color: '#e4e4e7', fontSize: '13px',
          outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms',
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          zIndex: 200, overflow: 'hidden',
        }}>
          {suggestions.map((s, i) => (
            <button key={s.company}
              onMouseDown={e => { e.preventDefault(); handleSelect(s.company) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', textAlign: 'left',
                padding: '9px 12px', fontSize: '13px',
                background: i === highlighted ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: i === highlighted ? '#ffffff' : '#a1a1aa',
                border: 'none', cursor: 'pointer', transition: 'background 80ms', gap: '8px',
              }}
              onMouseEnter={() => setHighlighted(i)}
              onMouseLeave={() => setHighlighted(-1)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.5 }}>
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              {s.company}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TrackingPage() {
  const { user } = useAuth()
  const [company, setCompany] = useState('')
  const [filters, setFilters] = useState<TrackingFilters>(EMPTY_FILTERS)
  const [tracked, setTracked] = useState<TrackedCompany[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [matchedJobs, setMatchedJobs] = useState<any[]>([])
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set())

  useEffect(() => { if (user?.id) { loadTracking(); loadSavedJobs() } }, [user?.id])

  const loadSavedJobs = async () => {
    if (!user?.id) return
    const { data } = await supabase.from('saved_jobs').select('job_id').eq('user_id', user.id)
    setSavedJobIds(new Set(data?.map((r: any) => r.job_id) ?? []))
  }

  const loadTracking = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_company_tracking').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      if (error) throw error
      setTracked(data || [])
      if (data && data.length > 0) loadMatchedJobs(data)
    } catch (err) { console.error('Error loading tracking:', err) }
    finally { setLoading(false) }
  }

  const loadMatchedJobs = async (trackingData?: TrackedCompany[]) => {
    if (!user?.id) return
    const entries = trackingData || tracked
    if (entries.length === 0) { setMatchedJobs([]); return }
    setLoadingJobs(true)
    try {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - 7)
      const { data: matchRows } = await supabase
        .from('user_job_matches').select('job_id, created_at')
        .eq('user_id', user.id).gte('created_at', cutoff.toISOString()).order('created_at', { ascending: false })
      if (!matchRows || matchRows.length === 0) { setMatchedJobs([]); return }
      const jobIds = matchRows.map((m: any) => m.job_id)
      const trackedCompanyNames = entries.map(t => t.company_name.toLowerCase())
      const { data: jobRows } = await supabase
        .from('job_postings_ingest_test').select('*').in('job_id', jobIds)
      if (jobRows) {
        const filtered = jobRows.filter((j: any) =>
          trackedCompanyNames.some(name =>
            j.company_name?.toLowerCase().includes(name) ||
            name.includes(j.company_name?.toLowerCase() ?? '')
          )
        )
        setMatchedJobs(filtered)
      }
    } catch (err) { console.error('Error loading matched jobs:', err) }
    finally { setLoadingJobs(false) }
  }

  const atLimit = tracked.length >= MAX_TRACKED
  const activeFilterCount = [filters.category, filters.level, filters.jobType, filters.location, filters.city, ...filters.subcategories].filter(Boolean).length
  const canTrack = company.trim().length > 0 && !atLimit

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
      const { data, error } = await supabase
        .from('user_company_tracking').insert({ user_id: user.id, company_name: name, filters }).select().single()
      if (error) throw error
      setTracked(prev => [data, ...prev])
      setCompany('')
      setFilters(EMPTY_FILTERS)
      setError('')
    } catch (err) { console.error('Error saving tracking:', err); setError('Failed to save. Please try again.') }
    finally { setSaving(false) }
  }

  async function handleRemove(id: string) {
    if (!user?.id) return
    try {
      await supabase.from('user_company_tracking').delete().eq('id', id).eq('user_id', user.id)
      const next = tracked.filter(t => t.id !== id)
      setTracked(next)
      loadMatchedJobs(next)
    } catch (err) { console.error('Error removing tracking:', err) }
  }

  const handleSaveToggle = async (jobId: string, willBeSaved: boolean) => {
    if (!user?.id) return
    setSavedJobIds(prev => { const next = new Set(prev); willBeSaved ? next.add(jobId) : next.delete(jobId); return next })
    if (willBeSaved) await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: jobId })
    else await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', jobId)
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

        {/* Cap notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', marginBottom: '16px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ color: '#71717a', fontSize: '11px' }}>
            You can track up to <strong>{MAX_TRACKED} companies</strong>. Matched jobs appear below and are kept for 7 days — save any you want to keep.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '14px', alignItems: 'start' }}>

          {/* Left — setup + tracked list */}
          <div>
            {/* Setup card */}
            {!atLimit && (
              <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '14px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                  <p style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em', margin: 0 }}>Track a company</p>
                  <Link
                    href="/dashboard"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      color: '#a78bfa', fontSize: '11px', fontWeight: 600,
                      textDecoration: 'none', whiteSpace: 'nowrap',
                      transition: 'opacity 150ms',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                  >
                    Company options
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>

                <CompanyInput value={company} onChange={v => { setCompany(v); setError('') }} onSelect={v => { setCompany(v); setError('') }} error={error} />
                {error && <p style={{ color: '#f87171', fontSize: '11px', marginBottom: '8px' }}>{error}</p>}

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '14px 0 4px' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <p style={{ ...sectionLabel, marginTop: 0, marginBottom: 0 }}>Filters (optional)</p>
                  {activeFilterCount > 0 && (
                    <button onClick={() => setFilters(EMPTY_FILTERS)} style={{ background: 'none', border: 'none', color: '#52525b', fontSize: '11px', cursor: 'pointer', padding: 0 }}>Clear</button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                  <div>
                    <p style={sectionLabel}>Category</p>
                    <DropdownSelect value={filters.category} onChange={v => setFilters(f => ({ ...f, category: v, subcategories: [] }))} placeholder="All"
                      options={[{ label: 'All Categories', value: '' }, { label: 'Tech', value: 'Tech' }, { label: 'Engineering', value: 'Engineering' }, { label: 'Health', value: 'Health' }, { label: 'Business', value: 'Business' }]} />
                  </div>
                  <div>
                    <p style={sectionLabel}>Level</p>
                    <DropdownSelect value={filters.level} onChange={v => setFilters(f => ({ ...f, level: v }))} placeholder="All"
                      options={[{ label: 'All Levels', value: '' }, { label: 'Moderate', value: 'moderate' }, { label: 'Advanced', value: 'advanced' }]} />
                  </div>
                  <div>
                    <p style={sectionLabel}>Job Type</p>
                    <DropdownSelect value={filters.jobType} onChange={v => setFilters(f => ({ ...f, jobType: v }))} placeholder="All"
                      options={[{ label: 'All Types', value: '' }, { label: 'Full Time', value: 'Full Time' }, { label: 'Part Time', value: 'Part Time' }, { label: 'Internship', value: 'Internship' }]} />
                  </div>
                  <div>
                    <p style={sectionLabel}>Location</p>
                    <DropdownSelect value={filters.location} onChange={v => setFilters(f => ({ ...f, location: v }))} placeholder="All"
                      options={[{ label: 'All', value: '' }, { label: 'Remote Only', value: 'remote' }, { label: 'On-site Only', value: 'onsite' }]} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={sectionLabel}>City</p>
                    <DropdownSelect
                      value={filters.city}
                      onChange={v => setFilters(f => ({ ...f, city: v }))}
                      placeholder="All cities"
                      options={CITY_OPTIONS}
                    />
                  </div>
                </div>

                {/* Subcategory chips */}
                {filters.category && JOB_FIELDS[filters.category] && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ ...sectionLabel, marginTop: 0, marginBottom: '8px' }}>
                      Subcategories
                      <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '10px', marginLeft: '6px', textTransform: 'none', letterSpacing: 0 }}>— leave blank for all</span>
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {JOB_FIELDS[filters.category].map(sub => {
                        const selected = filters.subcategories.includes(sub)
                        return (
                          <button key={sub} type="button"
                            onClick={() => setFilters(f => ({ ...f, subcategories: selected ? f.subcategories.filter(s => s !== sub) : [...f.subcategories, sub] }))}
                            style={{
                              padding: '4px 10px', borderRadius: '4px',
                              border: `1px solid ${selected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
                              background: selected ? 'rgba(255,255,255,0.08)' : 'transparent',
                              color: selected ? '#e4e4e7' : '#52525b',
                              fontSize: '11px', fontWeight: selected ? 600 : 400,
                              cursor: 'pointer', transition: 'all 120ms',
                              display: 'flex', alignItems: 'center', gap: '4px',
                            }}>
                            {selected && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                            {sub}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleTrack} disabled={!canTrack || saving}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 16px', borderRadius: '4px',
                      background: canTrack ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${canTrack ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
                      color: canTrack ? '#e4e4e7' : '#52525b',
                      fontSize: '12px', fontWeight: 600, cursor: canTrack && !saving ? 'pointer' : 'not-allowed', transition: 'all 150ms',
                    }}>
                    <EyeIcon size={13} />
                    {saving ? 'Saving...' : 'Track Company'}
                  </button>
                </div>
              </div>
            )}

            {/* Tracked list */}
            <div>
              <p style={{ color: '#52525b', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Tracked — {tracked.length} / {MAX_TRACKED}
              </p>

              {loading ? (
                <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '24px', textAlign: 'center' }}>
                  <p style={{ color: '#52525b', fontSize: '12px' }}>Loading...</p>
                </div>
              ) : tracked.length === 0 ? (
                <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '32px 20px', textAlign: 'center' }}>
                  <div style={{ color: '#3f3f46', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}><EyeIcon size={26} /></div>
                  <p style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>No companies tracked yet</p>
                  <p style={{ color: '#52525b', fontSize: '11px' }}>Enter a company above to get started.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {tracked.map(t => (
                    <div key={t.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#71717a' }}>
                          <EyeIcon size={12} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 500, marginBottom: '2px' }}>{t.company_name}</p>
                          <p style={{ color: '#52525b', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{filterSummary(t.filters as TrackingFilters)}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <span style={{ color: '#3f3f46', fontSize: '10px' }}>{new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <button onClick={() => handleRemove(t.id)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '4px', background: 'transparent', border: '1px solid transparent', color: '#52525b', cursor: 'pointer', transition: 'all 150ms' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.1)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(248,113,113,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = '#f87171' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#52525b' }}
                          aria-label={`Remove ${t.company_name}`}>
                          <XIcon size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — matched jobs */}
          <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 600 }}>Matched Jobs</span>
              {!loadingJobs && matchedJobs.length > 0 && (
                <span style={{ color: '#3f3f46', fontSize: '11px' }}>{matchedJobs.length} result{matchedJobs.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            <div style={{ padding: '12px 16px 16px' }}>
              {/* Expiry notice */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 11px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', marginBottom: '14px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <p style={{ color: '#71717a', fontSize: '11px' }}>
                  Matched jobs shown for <strong>7 days</strong>. Save jobs you want to keep — saved jobs never expire.
                </p>
              </div>

              {loadingJobs ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {[...Array(4)].map((_, i) => <div key={i} style={{ background: '#141414', borderRadius: '4px', height: '160px', border: '1px solid rgba(255,255,255,0.06)' }} />)}
                </div>
              ) : matchedJobs.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <div style={{ color: '#3f3f46', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <p style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>No matches yet</p>
                  <p style={{ color: '#52525b', fontSize: '11px' }}>
                    {tracked.length === 0 ? 'Track a company to start getting matches.' : 'Matches arrive once per day during the nightly run.'}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {matchedJobs.map(job => (
                    <DarkJobCard key={job.job_id} job={job} showSave={true} showDelete={false} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
