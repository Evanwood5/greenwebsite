'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { DropdownOption, TrackingFilters, sectionLabel, filterSummary } from './types'
import { TrackedCompany } from './types'
import { Job } from '@/app/jobs/types'
import { DarkJobCard } from '@/components/jobs/JobList'

export function EyeIcon({ size = 16 }: { size?: number }) {
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

export function DropdownSelect({ value, onChange, options, placeholder, disabled, searchable }: {
  value: string
  onChange: (v: string) => void
  options: DropdownOption[]
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const selected = options.find(o => o.value === value)

  const filteredOptions = searchable && searchQuery
    ? options.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [open, searchable])

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', opacity: disabled ? 0.45 : 1 }}>
      <button
        onClick={() => { if (!disabled) { setSearchQuery(''); setOpen(o => !o) } }}
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
          zIndex: 100, overflow: 'hidden',
        }}>
          {searchable && (
            <div style={{ padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%', padding: '5px 8px', borderRadius: '3px',
                  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                  color: '#e4e4e7', fontSize: '11px', outline: 'none',
                }}
              />
            </div>
          )}
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredOptions.length === 0 ? (
              <p style={{ padding: '8px 10px', fontSize: '11px', color: '#52525b', fontStyle: 'italic' }}>No matches</p>
            ) : filteredOptions.map(opt => {
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
        </div>
      )}
    </div>
  )
}

export function CityMultiSelect({ value, onChange, options }: {
  value: string[]
  onChange: (v: string[]) => void
  options: DropdownOption[]
}) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = searchQuery
    ? options.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    if (open && searchInputRef.current) searchInputRef.current.focus()
  }, [open])

  function toggle(cityValue: string) {
    if (cityValue === '') {
      onChange([])
    } else if (value.includes(cityValue)) {
      onChange(value.filter(c => c !== cityValue))
    } else {
      onChange([...value, cityValue])
    }
  }

  const buttonLabel = value.length === 0
    ? 'All Cities'
    : value.length === 1
      ? value[0]
      : `${value.length} cities`

  return (
    <div>
      <div ref={ref} style={{ position: 'relative', width: '100%' }}>
        <button
          onClick={() => { setSearchQuery(''); setOpen(o => !o) }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '7px 10px', borderRadius: '4px',
            border: value.length
              ? '1px solid rgba(255,255,255,0.18)'
              : `1px solid ${open ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
            background: value.length
              ? 'rgba(255,255,255,0.07)'
              : open ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
            color: value.length ? '#e4e4e7' : open ? '#e4e4e7' : '#52525b',
            fontSize: '12px', cursor: 'pointer', textAlign: 'left',
            transition: 'border-color 150ms, background 150ms, color 150ms', gap: '6px',
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{buttonLabel}</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0, color: value.length ? '#a1a1aa' : '#52525b', transition: 'transform 150ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden',
          }}>
            <div style={{ padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <input
                ref={searchInputRef} type="text" placeholder="Search..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%', padding: '5px 8px', borderRadius: '3px',
                  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                  color: '#e4e4e7', fontSize: '11px', outline: 'none',
                }}
              />
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {filteredOptions.length === 0 ? (
                <p style={{ padding: '8px 10px', fontSize: '11px', color: '#52525b', fontStyle: 'italic' }}>No matches</p>
              ) : filteredOptions.map(opt => {
                const isAll = opt.value === ''
                const isActive = !isAll && value.includes(opt.value)
                return (
                  <button key={opt.value} onClick={() => toggle(opt.value)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 10px', fontSize: '12px',
                      background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: isAll ? '#52525b' : isActive ? '#ffffff' : '#a1a1aa',
                      border: 'none', cursor: 'pointer', transition: 'background 100ms',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                  >
                    {!isAll && (
                      <span style={{
                        width: '14px', height: '14px', borderRadius: '3px', flexShrink: 0,
                        border: `1px solid ${isActive ? '#a78bfa' : 'rgba(255,255,255,0.2)'}`,
                        background: isActive ? '#a78bfa' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isActive && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                      </span>
                    )}
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
          {value.map(city => (
            <span key={city} style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '3px 8px', borderRadius: '4px',
              background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)',
              color: '#c4b5fd', fontSize: '11px',
            }}>
              {city}
              <button onClick={() => toggle(city)}
                style={{
                  background: 'none', border: 'none', color: '#c4b5fd', cursor: 'pointer',
                  padding: 0, lineHeight: 1, fontSize: '12px',
                }}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function CompanyInput({ value, onChange, onSelect, valid, error, options, loading }: {
  value: string
  onChange: (v: string) => void
  onSelect: (v: string) => void
  valid: boolean
  error: string
  options: string[]
  loading: boolean
}) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const [atBottom, setAtBottom] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const scrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startAutoScroll() {
    if (scrollTimerRef.current) return
    scrollTimerRef.current = setInterval(() => {
      const el = listRef.current
      if (!el) return
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) { stopAutoScroll(); return }
      el.scrollTop += 2
    }, 16)
  }

  function stopAutoScroll() {
    if (scrollTimerRef.current) { clearInterval(scrollTimerRef.current); scrollTimerRef.current = null }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) { setOpen(false); stopAutoScroll() }
    }
    document.addEventListener('mousedown', handleClick)
    return () => { document.removeEventListener('mousedown', handleClick); stopAutoScroll() }
  }, [])

  function handleListScroll() {
    const el = listRef.current
    setAtBottom(!!el && el.scrollTop + el.clientHeight >= el.scrollHeight - 1)
  }

  const query = value.trim().toLowerCase()
  const filtered = options.filter(c => c.toLowerCase().includes(query))

  function handleSelect(name: string) {
    onSelect(name)
    setOpen(false)
    setHighlighted(-1)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true) }
      return
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, -1)) }
    else if (e.key === 'Enter') {
      if (highlighted >= 0 && filtered[highlighted]) { e.preventDefault(); handleSelect(filtered[highlighted]) }
      else if (filtered.length === 1) { e.preventDefault(); handleSelect(filtered[0]) }
    }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', marginBottom: '6px' }}>
      <div style={{ position: 'relative' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#52525b', pointerEvents: 'none', zIndex: 1 }}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search a company to track..."
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); setHighlighted(-1); setAtBottom(false) }}
          onFocus={() => { setOpen(true); setAtBottom(false) }}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%', padding: '9px 12px 9px 36px', borderRadius: '4px',
            border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : valid ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)'}`,
            background: '#141414', color: '#e4e4e7', fontSize: '13px',
            outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms',
          }}
        />
        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            zIndex: 200, overflow: 'hidden',
          }}>
            {loading ? (
              <div style={{ padding: '9px 12px', fontSize: '12px', color: '#52525b' }}>Loading companies...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '9px 12px', fontSize: '12px', color: '#71717a' }}>
                {query ? `No results for "${value.trim()}"` : 'No companies available'}
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <div
                  ref={listRef}
                  onScroll={handleListScroll}
                  style={{
                    maxHeight: '360px', overflowY: 'auto',
                    paddingBottom: filtered.length > 12 ? '36px' : 0,
                    boxSizing: 'border-box',
                  }}
                >
                  {filtered.map((name, i) => (
                    <button key={name}
                      ref={i === highlighted ? el => { el?.scrollIntoView({ block: 'nearest' }) } : undefined}
                      onMouseDown={e => { e.preventDefault(); handleSelect(name) }}
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
                      {name}
                    </button>
                  ))}
                </div>
                {filtered.length > 12 && (
                  <div
                    onMouseEnter={startAutoScroll}
                    onMouseLeave={stopAutoScroll}
                    style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: '36px',
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '6px',
                      background: 'linear-gradient(to top, #1e1e1e 40%, rgba(30,30,30,0))',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'opacity 150ms', opacity: atBottom ? 0.25 : 1 }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {valid && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px',
          padding: '6px 10px', borderRadius: '4px',
          background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span style={{ color: '#71717a', fontSize: '11px', whiteSpace: 'nowrap' }}>Selected</span>
          <span style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{value}</span>
          <button
            onClick={() => onChange('')}
            aria-label="Clear selected company"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '3px', background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', padding: 0, transition: 'color 150ms' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#71717a' }}
          >
            <XIcon size={10} />
          </button>
        </div>
      )}
    </div>
  )
}

const CATEGORY_OPTIONS: DropdownOption[] = [
  { label: 'All Categories', value: '' },
  { label: 'Tech', value: 'Tech' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Health', value: 'Health' },
  { label: 'Business', value: 'Business' },
]

const LEVEL_OPTIONS: DropdownOption[] = [
  { label: 'All Levels', value: '' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Advanced', value: 'advanced' },
]

const JOB_TYPE_OPTIONS: DropdownOption[] = [
  { label: 'All Types', value: '' },
  { label: 'Full Time', value: 'Full Time' },
  { label: 'Part Time', value: 'Part Time' },
  { label: 'Internship', value: 'Internship' },
]

const REMOTE_OPTIONS: DropdownOption[] = [
  { label: 'All', value: '' },
  { label: 'Remote Only', value: 'remote' },
  { label: 'On-site Only', value: 'onsite' },
]

export function TrackCompanyCard({
  company,
  companyOptions,
  companyValid,
  companyLoading,
  error,
  filters,
  activeFilterCount,
  cityOptions,
  subcategoryList,
  canTrack,
  saving,
  onCompanyChange,
  onCompanySelect,
  onFilterChange,
  onCategoryChange,
  onSubcategoryToggle,
  onClearFilters,
  onTrack,
}: {
  company: string
  companyOptions: string[]
  companyValid: boolean
  companyLoading: boolean
  error: string
  filters: TrackingFilters
  activeFilterCount: number
  cityOptions: DropdownOption[]
  subcategoryList: string[]
  canTrack: boolean
  saving: boolean
  onCompanyChange: (v: string) => void
  onCompanySelect: (v: string) => void
  onFilterChange: (update: Partial<TrackingFilters>) => void
  onCategoryChange: (v: string) => void
  onSubcategoryToggle: (sub: string) => void
  onClearFilters: () => void
  onTrack: () => void
}) {
  return (
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

      <CompanyInput value={company} onChange={onCompanyChange} onSelect={onCompanySelect} valid={companyValid} error={error} options={companyOptions} loading={companyLoading} />
      {error && <p style={{ color: '#f87171', fontSize: '11px', marginBottom: '8px' }}>{error}</p>}

      {(companyValid && company) && (
        <>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '14px 0 4px' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <p style={{ ...sectionLabel, marginTop: 0, marginBottom: 0 }}>Filters (optional)</p>
            {activeFilterCount > 0 && (
              <button onClick={onClearFilters} style={{ background: 'none', border: 'none', color: '#52525b', fontSize: '11px', cursor: 'pointer', padding: 0 }}>Clear</button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
            <div>
              <p style={sectionLabel}>Category</p>
              <DropdownSelect value={filters.category} onChange={onCategoryChange} placeholder="All" options={CATEGORY_OPTIONS} />
            </div>
            <div>
              <p style={sectionLabel}>Level</p>
              <DropdownSelect value={filters.level} onChange={v => onFilterChange({ level: v })} placeholder="All" options={LEVEL_OPTIONS} />
            </div>
            <div>
              <p style={sectionLabel}>Job Type</p>
              <DropdownSelect value={filters.jobType} onChange={v => onFilterChange({ jobType: v })} placeholder="All" options={JOB_TYPE_OPTIONS} />
            </div>
            <div>
              <p style={sectionLabel}>Remote</p>
              <DropdownSelect value={filters.location} onChange={v => onFilterChange({ location: v })} placeholder="All" options={REMOTE_OPTIONS} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <p style={sectionLabel}>City</p>
              <CityMultiSelect
                value={filters.city}
                onChange={v => onFilterChange({ city: v })}
                options={cityOptions}
              />
            </div>
          </div>

          {filters.category && subcategoryList.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <p style={{ ...sectionLabel, marginTop: 0, marginBottom: '8px' }}>
                Subcategories
                <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '10px', marginLeft: '6px', textTransform: 'none', letterSpacing: 0 }}>— leave blank for all</span>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {subcategoryList.map(sub => {
                  const selected = filters.subcategories.includes(sub)
                  return (
                    <button key={sub} type="button"
                      onClick={() => onSubcategoryToggle(sub)}
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
        </>
      )}

      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onTrack} disabled={!canTrack || saving}
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
  )
}

export function TrackedList({ tracked, loading, max, onRemove }: {
  tracked: TrackedCompany[]
  loading: boolean
  max: number
  onRemove: (id: string) => void
}) {
  return (
    <div>
      <p style={{ color: '#52525b', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
        Tracked — {tracked.length} / {max}
      </p>

      {loading ? (
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '24px', textAlign: 'center' }}>
          <p style={{ color: '#52525b', fontSize: '12px' }}>Loading...</p>
        </div>
      ) : tracked.length === 0 ? (
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '32px 20px', textAlign: 'center' }}>
          <div style={{ color: '#3f3f46', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}><EyeIcon size={26} /></div>
          <p style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>No companies tracked yet</p>
          <p style={{ color: '#52525b', fontSize: '11px' }}>Search and select a company above to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {tracked.map(t => (
            <TrackedCompanyItem key={t.id} company={t} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  )
}

function TrackedCompanyItem({ company, onRemove }: { company: TrackedCompany; onRemove: (id: string) => void }) {
  const summary = filterSummary(company.filters)
  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: '4px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#71717a' }}>
          <EyeIcon size={12} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 500, marginBottom: '2px' }}>{company.company_name}</p>
          <p style={{ color: '#52525b', fontSize: '10px', overflowX: 'auto', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>{summary}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <span style={{ color: '#3f3f46', fontSize: '10px' }}>{new Date(company.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <button onClick={() => onRemove(company.id)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '4px', background: 'transparent', border: '1px solid transparent', color: '#52525b', cursor: 'pointer', transition: 'all 150ms' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.1)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(248,113,113,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = '#f87171' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#52525b' }}
          aria-label={`Remove ${company.company_name}`}>
          <XIcon size={10} />
        </button>
      </div>
    </div>
  )
}

export function CapNotice({ max }: { max: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', marginBottom: '16px' }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p style={{ color: '#71717a', fontSize: '11px' }}>
        You can track up to <strong>{max} companies</strong>. Matched jobs appear below and are kept for 7 days — save any you want to keep.
      </p>
    </div>
  )
}

export function MatchedJobsPanel({ jobs, loading, trackedCount }: {
  jobs: Job[]
  loading: boolean
  trackedCount: number
}) {
  return (
    <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 600 }}>Matched Jobs</span>
        {!loading && jobs.length > 0 && (
          <span style={{ color: '#3f3f46', fontSize: '11px' }}>{jobs.length} result{jobs.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      <div style={{ padding: '12px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 11px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', marginBottom: '14px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <p style={{ color: '#71717a', fontSize: '11px' }}>
            Matched jobs shown for <strong>7 days</strong>. Save jobs you want to keep — saved jobs never expire.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {[...Array(4)].map((_, i) => <div key={i} style={{ background: '#141414', borderRadius: '4px', height: '160px', border: '1px solid rgba(255,255,255,0.06)' }} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ color: '#3f3f46', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>No matches yet</p>
            <p style={{ color: '#52525b', fontSize: '11px' }}>
              {trackedCount === 0 ? 'Track a company to start getting matches.' : 'Matches arrive once per day during the nightly run.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {jobs.map(job => (
              <DarkJobCard key={job.job_id} job={job} showSave={true} showDelete={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
