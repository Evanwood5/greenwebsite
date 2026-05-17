'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import AppShell from '@/components/AppShell'
import { MICHIGAN_CITIES } from '@/lib/michiganCities'
import { JOB_FIELDS } from '@/lib/jobsApi'

interface TrackedCompany {
  id: string
  company: string
  filters: TrackingFilters
  addedAt: string
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

const STORAGE_KEY = 'greenify_tracked_companies'

const PURPLE = '#a78bfa'
const PURPLE_BG = 'rgba(139,92,246,0.12)'
const PURPLE_BG_LIGHT = 'rgba(139,92,246,0.07)'
const PURPLE_BORDER = 'rgba(139,92,246,0.3)'
const PURPLE_BORDER_STRONG = 'rgba(139,92,246,0.45)'

const sectionLabel: React.CSSProperties = {
  color: '#c4b5fd',
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  marginBottom: '6px',
  marginTop: '14px',
}

interface DropdownOption { label: string; value: string }

function DropdownSelect({ value, onChange, options, placeholder }: {
  value: string
  onChange: (v: string) => void
  options: DropdownOption[]
  placeholder?: string
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
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          borderRadius: '7px',
          border: `1px solid ${open ? PURPLE_BORDER_STRONG : 'rgba(139,92,246,0.18)'}`,
          background: open ? PURPLE_BG : PURPLE_BG_LIGHT,
          color: value ? '#e4e4e7' : '#9ca3af',
          fontSize: '12px',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'border-color 150ms, background 150ms',
          gap: '6px',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.label ?? placeholder ?? 'Select...'}
        </span>
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, color: PURPLE, transition: 'transform 150ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
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
          background: '#1a1625',
          border: `1px solid ${PURPLE_BORDER}`,
          borderRadius: '8px',
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
                  textAlign: 'left',
                  padding: '8px 10px',
                  fontSize: '12px',
                  background: isActive ? PURPLE_BG : 'transparent',
                  color: isActive ? '#ddd6fe' : '#c4c4c7',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 100ms',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = PURPLE_BG_LIGHT }}
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
  if (filters.subcategories.length) parts.push(filters.subcategories.join(', '))
  if (filters.level) parts.push(filters.level)
  if (filters.jobType) parts.push(filters.jobType)
  if (filters.location === 'remote') parts.push('Remote')
  else if (filters.location === 'onsite') parts.push('On-site')
  if (filters.city) parts.push(filters.city)
  return parts.length ? parts.join(' · ') : 'All jobs'
}

function CompanyInput({ value, onChange, onSelect, error }: {
  value: string
  onChange: (v: string) => void
  onSelect: (v: string) => void
  error: string
}) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/companies/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setSuggestions(data.companies ?? [])
        setShowSuggestions(true)
        setHighlighted(-1)
      } catch {
        setSuggestions([])
      }
    }, 250)
  }, [])

  useEffect(() => {
    fetchSuggestions(value)
  }, [value, fetchSuggestions])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, -1))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      onSelect(suggestions[highlighted])
      setShowSuggestions(false)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const canTrack = value.trim().length > 0

  return (
    <div ref={containerRef} style={{ position: 'relative', marginBottom: '6px' }}>
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: PURPLE, pointerEvents: 'none', zIndex: 1 }}
      >
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="e.g. Google, Ford, Stryker..."
        value={value}
        onChange={e => { onChange(e.target.value) }}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
        style={{
          width: '100%',
          padding: '11px 12px 11px 36px',
          borderRadius: '9px',
          border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : canTrack ? PURPLE_BORDER_STRONG : 'rgba(139,92,246,0.22)'}`,
          background: 'rgba(139,92,246,0.07)',
          color: '#f5f3ff',
          fontSize: '13px',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 150ms',
        }}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: '#1a1625',
          border: `1px solid ${PURPLE_BORDER}`,
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          zIndex: 200,
          overflow: 'hidden',
        }}>
          {suggestions.map((s, i) => (
            <button
              key={s}
              onMouseDown={e => { e.preventDefault(); onSelect(s); setShowSuggestions(false) }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'left',
                padding: '9px 12px',
                fontSize: '13px',
                background: i === highlighted ? PURPLE_BG : 'transparent',
                color: i === highlighted ? '#ddd6fe' : '#c4c4c7',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 80ms',
                gap: '8px',
              }}
              onMouseEnter={() => setHighlighted(i)}
              onMouseLeave={() => setHighlighted(-1)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TrackingPage() {
  const [company, setCompany] = useState('')
  const [filters, setFilters] = useState<TrackingFilters>(EMPTY_FILTERS)
  const [tracked, setTracked] = useState<TrackedCompany[]>([])
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setTracked(JSON.parse(raw))
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [])

  // Persist to localStorage whenever tracked changes (after initial load)
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracked))
  }, [tracked, loaded])

  const activeFilterCount = [
    filters.category,
    filters.level,
    filters.jobType,
    filters.location,
    filters.city,
    ...filters.subcategories,
  ].filter(Boolean).length
  const canTrack = company.trim().length > 0

  function handleTrack() {
    const name = company.trim()
    if (!name) { setError('Please enter a company name.'); return }
    if (tracked.some(t => t.company.toLowerCase() === name.toLowerCase())) {
      setError('You are already tracking this company.')
      return
    }
    setTracked(prev => [{
      id: crypto.randomUUID(),
      company: name,
      filters: { ...filters },
      addedAt: new Date().toISOString(),
    }, ...prev])
    setCompany('')
    setFilters(EMPTY_FILTERS)
    setError('')
  }

  function handleRemove(id: string) {
    setTracked(prev => prev.filter(t => t.id !== id))
  }

  return (
    <AppShell>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '9px',
            background: PURPLE_BG, border: `1px solid ${PURPLE_BORDER}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: PURPLE, flexShrink: 0,
          }}>
            <EyeIcon size={16} />
          </div>
          <div>
            <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '1px', letterSpacing: '-0.02em' }}>
              Company Tracking
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>
              Follow specific companies and filter the roles you care about.
            </p>
          </div>
        </div>

        {/* Setup card */}
        <div style={{
          background: '#1c1c1c',
          border: `1px solid rgba(255,255,255,0.18)`,
          borderRadius: '14px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset',
        }}>
          {/* Company input */}
          <p style={{ color: '#ede9fe', fontSize: '15px', fontWeight: 600, marginBottom: '12px', letterSpacing: '-0.01em' }}>
            Which company do you want to track?
          </p>

          <CompanyInput
            value={company}
            onChange={v => { setCompany(v); setError('') }}
            onSelect={v => { setCompany(v); setError('') }}
            error={error}
          />

          {error && (
            <p style={{ color: '#f87171', fontSize: '11px', marginBottom: '10px' }}>{error}</p>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: PURPLE_BORDER, margin: '18px 0 6px', opacity: 0.5 }} />

          {/* Filters header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <p style={{ ...sectionLabel, marginTop: 0, marginBottom: 0 }}>Narrow by filters (optional)</p>
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                style={{ background: 'none', border: 'none', color: PURPLE, fontSize: '11px', cursor: 'pointer', padding: 0, opacity: 0.8 }}
              >
                Clear filters
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginTop: '10px' }}>
            <div>
              <p style={sectionLabel}>Category</p>
              <DropdownSelect
                value={filters.category}
                onChange={v => setFilters(f => ({ ...f, category: v, subcategories: [] }))}
                placeholder="All"
                options={[
                  { label: 'All Categories', value: '' },
                  { label: 'Tech', value: 'Tech' },
                  { label: 'Engineering', value: 'Engineering' },
                  { label: 'Health', value: 'Health' },
                  { label: 'Business', value: 'Business' },
                ]}
              />
            </div>
            <div>
              <p style={sectionLabel}>Level</p>
              <DropdownSelect
                value={filters.level}
                onChange={v => setFilters(f => ({ ...f, level: v }))}
                placeholder="All"
                options={[
                  { label: 'All Levels', value: '' },
                  { label: 'Moderate', value: 'moderate' },
                  { label: 'Advanced', value: 'advanced' },
                ]}
              />
            </div>
            <div>
              <p style={sectionLabel}>Job Type</p>
              <DropdownSelect
                value={filters.jobType}
                onChange={v => setFilters(f => ({ ...f, jobType: v }))}
                placeholder="All"
                options={[
                  { label: 'All Types', value: '' },
                  { label: 'Full Time', value: 'Full Time' },
                  { label: 'Part Time', value: 'Part Time' },
                  { label: 'Internship', value: 'Internship' },
                ]}
              />
            </div>
            <div>
              <p style={sectionLabel}>Location</p>
              <DropdownSelect
                value={filters.location}
                onChange={v => setFilters(f => ({ ...f, location: v }))}
                placeholder="All"
                options={[
                  { label: 'All', value: '' },
                  { label: 'Remote Only', value: 'remote' },
                  { label: 'On-site Only', value: 'onsite' },
                ]}
              />
            </div>
            <div>
              <p style={sectionLabel}>City</p>
              <DropdownSelect
                value={filters.city}
                onChange={v => setFilters(f => ({ ...f, city: v }))}
                placeholder="All"
                options={[
                  { label: 'All Cities', value: '' },
                  ...MICHIGAN_CITIES
                    .filter(c => c.value !== 'MI:all')
                    .map(c => ({ label: c.label, value: c.label })),
                ]}
              />
            </div>
          </div>

          {/* Subcategory multi-select */}
          {filters.category && JOB_FIELDS[filters.category] && (
            <div style={{ marginTop: '14px' }}>
              <p style={{ ...sectionLabel, marginTop: 0, marginBottom: '8px' }}>
                Subcategories
                <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '10px', marginLeft: '6px', textTransform: 'none', letterSpacing: 0 }}>
                  — pick any, or leave blank for all
                </span>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {JOB_FIELDS[filters.category].map(sub => {
                  const selected = filters.subcategories.includes(sub)
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() =>
                        setFilters(f => ({
                          ...f,
                          subcategories: selected
                            ? f.subcategories.filter(s => s !== sub)
                            : [...f.subcategories, sub],
                        }))
                      }
                      style={{
                        padding: '5px 11px',
                        borderRadius: '6px',
                        border: `1px solid ${selected ? PURPLE_BORDER_STRONG : 'rgba(139,92,246,0.18)'}`,
                        background: selected ? PURPLE_BG : 'transparent',
                        color: selected ? '#ddd6fe' : '#71717a',
                        fontSize: '11px',
                        fontWeight: selected ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 120ms',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      {selected && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {sub}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Track button */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleTrack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 20px',
                borderRadius: '8px',
                background: canTrack ? PURPLE_BG : 'rgba(255,255,255,0.03)',
                border: `1px solid ${canTrack ? PURPLE_BORDER_STRONG : 'rgba(255,255,255,0.07)'}`,
                color: canTrack ? '#ddd6fe' : '#52525b',
                fontSize: '12px',
                fontWeight: 600,
                cursor: canTrack ? 'pointer' : 'not-allowed',
                transition: 'all 150ms',
                letterSpacing: '0.01em',
              }}
            >
              <EyeIcon size={13} />
              Track Company
            </button>
          </div>
        </div>

        {/* Expiry notice */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'rgba(251,191,36,0.06)',
          border: '1px solid rgba(251,191,36,0.18)',
          borderRadius: '8px',
          marginBottom: '14px',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <p style={{ color: '#fbbf24', fontSize: '11px', lineHeight: '1.5' }}>
            Matched jobs are shown for <strong>7 days</strong> then removed. Save any jobs you want to keep — saved jobs never expire.
          </p>
        </div>

        {/* Tracked companies list */}
        <div>
          <p style={{ color: '#c4b5fd', fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Tracked — {tracked.length}
          </p>

          {tracked.length === 0 ? (
            <div style={{
              background: '#1c1c1c',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '12px',
              padding: '52px 20px',
              textAlign: 'center',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset',
            }}>
              <div style={{ color: PURPLE, marginBottom: '12px', display: 'flex', justifyContent: 'center', opacity: 0.5 }}>
                <EyeIcon size={30} />
              </div>
              <p style={{ color: '#e4e4e7', fontSize: '14px', fontWeight: 500, marginBottom: '5px' }}>No companies tracked yet</p>
              <p style={{ color: '#9ca3af', fontSize: '12px' }}>Enter a company above and hit Track Company to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tracked.map(t => (
                <div
                  key={t.id}
                  style={{
                    background: 'rgba(139,92,246,0.06)',
                    border: `1px solid rgba(139,92,246,0.2)`,
                    borderRadius: '10px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: PURPLE_BG,
                      border: `1px solid ${PURPLE_BORDER}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: PURPLE,
                    }}>
                      <EyeIcon size={14} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: '#f5f3ff', fontSize: '13px', fontWeight: 500, marginBottom: '2px' }}>{t.company}</p>
                      <p style={{ color: '#a78bfa', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.8 }}>
                        {filterSummary(t.filters)}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{ color: '#7c6faf', fontSize: '11px' }}>
                      {new Date(t.addedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <button
                      onClick={() => handleRemove(t.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: 'transparent',
                        border: '1px solid transparent',
                        color: '#7c6faf',
                        cursor: 'pointer',
                        transition: 'all 150ms',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.1)'
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(248,113,113,0.2)'
                        ;(e.currentTarget as HTMLButtonElement).style.color = '#f87171'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'
                        ;(e.currentTarget as HTMLButtonElement).style.color = '#7c6faf'
                      }}
                      aria-label={`Remove ${t.company}`}
                    >
                      <XIcon size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AppShell>
  )
}
