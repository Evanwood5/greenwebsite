'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Mode, Org } from '@/lib/types/auth'
import { labelStyle, inputStyle } from '@/lib/utils/auth'

const ORG_CHUNK_SIZE = 8

export function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--palette-forest-500)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--palette-forest-500)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%) translateY(-2px)', pointerEvents: 'none' }}
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--palette-forest-600)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}



export function AuthHeader({ mode }: { mode: Mode }) {
  const isSignUp = mode === 'signup'
  return (
    <div>
      <p
        style={{
          color: 'var(--palette-forest-600)',
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '0.11em',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}
      >
        Greenify Access
      </p>
      <h1 style={{ color: 'var(--palette-forest-700)', fontSize: '32px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '6px' }}>
        {isSignUp ? 'Create your account' : 'Welcome back'}
      </h1>
      <p style={{ color: 'var(--palette-forest-500)', fontSize: '14px', lineHeight: 1.6, marginBottom: '22px' }}>
        {isSignUp
          ? 'Join Greenify to discover job opportunities and get AI-powered matches.'
          : 'Sign in to manage your matches, saved jobs, and preferences.'}
      </p>
    </div>
  )
}

export function ModeTabs({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '6px', borderRadius: '12px', background: 'rgb(var(--palette-forest-800-rgb) / 0.08)', marginBottom: '20px' }}>
      {(['signin', 'signup'] as Mode[]).map((m) => {
        const active = mode === m
        return (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            style={{
              border: 'none',
              borderRadius: '9px',
              padding: '10px 12px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              background: active ? 'var(--palette-forest-800)' : 'transparent',
              color: active ? 'var(--palette-white)' : 'var(--palette-forest-650)',
            }}
          >
            {m === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        )
      })}
    </div>
  )
}

export function OrgDropdown({ orgs, selectedOrgId, loading, onSelect }: {
  orgs: Org[]
  selectedOrgId: string
  loading: boolean
  onSelect: (orgId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [visibleLimit, setVisibleLimit] = useState(ORG_CHUNK_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selectedOrg = orgs.find((o) => String(o.id) === selectedOrgId) ?? null
  const isNone = selectedOrgId === 'none'

  const filteredOrgs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return orgs
    return orgs.filter(
      (o) =>
        o.org_name?.toLowerCase().includes(q) ||
        false,
    )
  }, [orgs, query])
  const visibleOrgs = filteredOrgs.slice(0, visibleLimit)
  const hiddenCount = Math.max(filteredOrgs.length - visibleOrgs.length, 0)

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => searchRef.current?.focus(), 0)
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggleMenu = () => {
    if (!open) {
      setQuery('')
      setVisibleLimit(ORG_CHUNK_SIZE)
      setLoadingMore(false)
    }
    setOpen((v) => !v)
  }

  const maybeLoadMore = (scrollTop: number, clientHeight: number, scrollHeight: number) => {
    if (loading || loadingMore || hiddenCount <= 0) return
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 16
    if (!nearBottom) return
    setLoadingMore(true)
    window.setTimeout(() => {
      setVisibleLimit((current) => Math.min(current + ORG_CHUNK_SIZE, filteredOrgs.length))
      setLoadingMore(false)
    }, 140)
  }

  const displayLabel = isNone
    ? 'No school affiliation'
    : selectedOrg
      ? selectedOrg.org_name
      : 'Select your school (optional)'

  return (
    <div style={{ marginBottom: '18px' }}>
      <label style={labelStyle}>School Organization <span style={{ color: 'var(--palette-forest-600)', fontWeight: 500 }}>(current or alum)</span></label>
      <div ref={menuRef} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={toggleMenu}
          disabled={loading}
          aria-haspopup="listbox"
          aria-expanded={open}
          style={{
            ...inputStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            borderColor: open ? 'var(--palette-forest-600)' : 'rgb(var(--palette-forest-800-rgb) / 0.22)',
            textAlign: 'left',
          }}
        >
          <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {selectedOrg ? (
              <>
                <span style={{ color: 'var(--palette-forest-700)', fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedOrg.org_name}
                </span>
                <span style={{ color: 'var(--palette-forest-500)', fontSize: '12px' }}>
                </span>
              </>
            ) : (
              <span style={{ color: isNone ? 'var(--palette-forest-700)' : 'var(--palette-forest-500)', fontSize: '14px', fontWeight: isNone ? 600 : 400 }}>
                {displayLabel}
              </span>
            )}
          </span>
          <ChevronIcon open={open} />
        </button>

        {open && (
          <div
            role="listbox"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: 'var(--palette-cream-150)',
              border: '1px solid rgb(var(--palette-forest-800-rgb) / 0.22)',
              borderRadius: '12px',
              boxShadow: '0 16px 34px rgb(var(--palette-forest-800-rgb) / 0.16)',
              padding: '6px',
              zIndex: 120,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* None option */}
            <button
              type="button"
              role="option"
              aria-selected={isNone}
              onClick={() => { onSelect('none'); setOpen(false) }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '9px',
                background: isNone ? 'rgb(var(--palette-forest-600-rgb) / 0.12)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid rgb(var(--palette-forest-800-rgb) / 0.1)',
                marginBottom: '4px',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--palette-forest-600)',
                fontSize: '14px',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => { if (!isNone) e.currentTarget.style.background = 'rgb(var(--palette-forest-800-rgb) / 0.06)' }}
              onMouseLeave={(e) => { if (!isNone) e.currentTarget.style.background = 'transparent' }}
            >
              No school affiliation
              {isNone && <CheckIcon />}
            </button>

            <div style={{ position: 'relative', padding: '4px 4px 8px 4px' }}>
              <SearchIcon />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setVisibleLimit(ORG_CHUNK_SIZE) }}
                placeholder="Search schools..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: '9px',
                  border: '1px solid rgb(var(--palette-forest-800-rgb) / 0.18)',
                  background: 'var(--palette-white)',
                  color: 'var(--palette-forest-700)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div
              style={{ maxHeight: '240px', overflowY: 'auto' }}
              onScroll={(e) => {
                const target = e.currentTarget
                maybeLoadMore(target.scrollTop, target.clientHeight, target.scrollHeight)
              }}
            >
              {filteredOrgs.length === 0 && (
                <div style={{ padding: '12px', color: 'var(--palette-forest-500)', fontSize: '13px', textAlign: 'center' }}>
                  {loading ? 'Loading...' : 'No schools found'}
                </div>
              )}
              {visibleOrgs.map((o) => {
                const active = String(o.id) === selectedOrgId
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => { onSelect(String(o.id)); setOpen(false) }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '9px',
                      background: active ? 'rgb(var(--palette-forest-600-rgb) / 0.12)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: 'var(--palette-forest-700)',
                      fontSize: '14px',
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgb(var(--palette-forest-800-rgb) / 0.06)' }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {o.org_name}
                      </span>
                      <span style={{ color: 'var(--palette-forest-500)', fontSize: '12px' }}>
                      </span>
                    </span>
                    {active && <CheckIcon />}
                  </button>
                )
              })}
            </div>
            {loadingMore && (
              <div style={{ padding: '8px 12px 4px', color: 'var(--palette-forest-500)', fontSize: '12px', textAlign: 'center' }}>
                Loading more schools...
              </div>
            )}
          </div>
        )}
      </div>
      {selectedOrg && (
        <p style={{ color: 'var(--palette-forest-500)', fontSize: '12px', marginTop: '6px' }}>
        </p>
      )}
    </div>
  )
}

export function FormField({ label, type, value, onChange, placeholder, autoComplete, required, minLength, hint, marginBottom = 16 }: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  required?: boolean
  minLength?: number
  hint?: string
  marginBottom?: number
}) {
  return (
    <div style={{ marginBottom }}>
      <label style={labelStyle}>{label}{required && <span style={{ color: 'var(--palette-rust-600)', marginLeft: '3px' }}>*</span>}</label>
      <input
        type={type}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
      {hint && <p style={{ color: 'var(--palette-forest-500)', fontSize: '12px', marginTop: '6px' }}>{hint}</p>}
    </div>
  )
}

export function TermsCheckbox({ accepted, onChange }: { accepted: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px' }}>
      <input
        type="checkbox"
        id="terms-checkbox"
        checked={accepted}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: '2px', width: '15px', height: '15px', flexShrink: 0, accentColor: 'var(--palette-forest-700)', cursor: 'pointer' }}
      />
      <label htmlFor="terms-checkbox" style={{ color: 'var(--palette-forest-500)', fontSize: '13px', lineHeight: 1.5, cursor: 'pointer' }}>
        <span style={{ color: 'var(--palette-rust-600)', marginRight: '3px' }}>*</span>I agree to the{' '}
        <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--palette-blue-500)', textDecoration: 'none', fontWeight: 600 }}>
          Terms of Service
        </a>
        {' '}and{' '}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--palette-blue-500)', textDecoration: 'none', fontWeight: 600 }}>
          Privacy Policy
        </a>
      </label>
    </div>
  )
}

export function MessageBanner({ message, type }: { message: string; type: 'error' | 'success' }) {
  return (
    <p
      style={{
        color: type === 'success' ? 'var(--palette-green-650)' : 'var(--palette-rust-600)',
        fontSize: '13px',
        marginBottom: '14px',
        textAlign: 'center',
        borderRadius: '10px',
        padding: '9px 10px',
        background: type === 'success' ? 'rgb(var(--palette-forest-600-rgb) / 0.1)' : 'rgb(var(--palette-rust-500-rgb) / 0.1)',
      }}
    >
      {message}
    </p>
  )
}

export function SubmitButton({ loading, label, disabled }: { loading: boolean; label: string; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      style={{
        width: '100%',
        padding: '13px',
        borderRadius: '12px',
        background: 'var(--palette-forest-800)',
        color: 'var(--palette-white)',
        fontSize: '15px',
        fontWeight: 700,
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading || disabled ? 0.5 : 1,
      }}
    >
      {label}
    </button>
  )
}

export function AuthSwitcher({ mode, onSwitch }: { mode: Mode; onSwitch: (m: Mode) => void }) {
  const isSignUp = mode === 'signup'
  return (
    <p style={{ color: 'var(--palette-forest-500)', fontSize: '14px', textAlign: 'center' }}>
      {isSignUp ? 'Already have an account?' : 'Need an account?'}{' '}
      <button
        type="button"
        onClick={() => onSwitch(isSignUp ? 'signin' : 'signup')}
        style={{ background: 'none', border: 'none', color: 'var(--palette-green-550)', cursor: 'pointer', fontSize: '14px', fontWeight: 700, padding: 0 }}
      >
        {isSignUp ? 'Sign in' : 'Create one'}
      </button>
    </p>
  )
}
