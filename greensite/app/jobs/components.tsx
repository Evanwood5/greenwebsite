'use client'

import { useState, useEffect, useRef } from 'react'
import { JOB_FIELDS } from '@/lib/api/jobsApi'
import { FilterOptions } from './types'

// ── Filter Icon ───────────────────────────────────────────────────────────────

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

// ── Dropdown ──────────────────────────────────────────────────────────────────

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

// ── Stat Card ─────────────────────────────────────────────────────────────────

export function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p style={{ color: '#52525b', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</p>
      <p style={{ color, fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</p>
    </div>
  )
}

// ── Filter Panel ──────────────────────────────────────────────────────────────

const sectionLabelStyle: React.CSSProperties = {
  color: '#52525b',
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: '4px',
  marginTop: '12px',
}

export function FilterPanel({
  filters,
  searchInput,
  onSearchInputChange,
  onFilterChange,
  onClear,
  michiganCities,
}: {
  filters: FilterOptions
  searchInput: string
  onSearchInputChange: (v: string) => void
  onFilterChange: (key: keyof FilterOptions, value: string) => void
  onClear: () => void
  michiganCities: string[]
}) {
  const activeFilterCount = [filters.category, filters.subCategory, filters.level, filters.jobType, filters.isRemote, filters.city, filters.searchTerm].filter(Boolean).length

  return (
    <div style={{ width: '180px', flexShrink: 0, position: 'sticky', top: '0' }}>
      <div style={{ background: '#1e1e1e', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e4e4e7', fontSize: '12px', fontWeight: 600 }}>
            <FilterIcon />
            Filters
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={onClear}
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
            onChange={(e) => onSearchInputChange(e.target.value)}
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
              onClick={() => onSearchInputChange('')}
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
          onChange={(v) => onFilterChange('category', v)}
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
          onChange={(v) => onFilterChange('subCategory', v)}
          disabled={!filters.category}
          options={[
            { label: filters.category ? 'All Sub-categories' : 'Select a category first', value: '' },
            ...(filters.category ? (JOB_FIELDS[filters.category] ?? []).map(s => ({ label: s, value: s })) : []),
          ]}
        />

        <p style={sectionLabelStyle}>Level</p>
        <DropdownSelect
          value={filters.level}
          onChange={(v) => onFilterChange('level', v)}
          options={[
            { label: 'All Levels', value: '' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Advanced', value: 'advanced' },
          ]}
        />

        <p style={sectionLabelStyle}>Job Type</p>
        <DropdownSelect
          value={filters.jobType}
          onChange={(v) => onFilterChange('jobType', v)}
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
          onChange={(v) => onFilterChange('city', v)}
          options={[
            { label: 'All Cities', value: '' },
            ...michiganCities.map(c => ({ label: c, value: c }))
          ]}
        />

        <p style={sectionLabelStyle}>Remote</p>
        <DropdownSelect
          value={filters.isRemote}
          onChange={(v) => onFilterChange('isRemote', v)}
          options={[
            { label: 'All', value: '' },
            { label: 'Remote Only', value: 'remote' },
            { label: 'On-site Only', value: 'onsite' },
          ]}
        />
      </div>
    </div>
  )
}

// ── Other small pieces ────────────────────────────────────────────────────────

export function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', padding: '12px 14px', marginBottom: '20px', color: '#fca5a5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      {message}
      <button onClick={onRetry} style={{ marginLeft: 'auto', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '12px' }}>
        Try again
      </button>
    </div>
  )
}

export function LoadMoreButton({ totalRemaining, loading, onLoadMore }: { totalRemaining: number; loading: boolean; onLoadMore: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
      <button
        onClick={onLoadMore}
        disabled={loading}
        style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.05)', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '4px', fontWeight: 500, fontSize: '12px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
      >
        {loading ? 'Loading...' : `Load More (${totalRemaining} remaining)`}
      </button>
    </div>
  )
}