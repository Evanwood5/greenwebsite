'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Mode, SignUpPath, Org } from '@/lib/types/auth'
import { labelStyle, inputStyle } from '@/lib/utils/auth'

const ORG_CHUNK_SIZE = 8

export function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4a5e4a"
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
      stroke="#4a5e4a"
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
      stroke="#2d6e28"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function DecorativeBackground() {
  return (
    <>
      <div
        className="absolute right-0 top-0 bottom-0 hidden lg:block"
        style={{ width: '360px', background: '#1e3a1e' }}
        aria-hidden
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>
      <div
        className="absolute left-14 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3"
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#1e3a1e', opacity: i === 2 ? 0.85 : 0.28 }}
          />
        ))}
      </div>
    </>
  )
}

export function AuthHeader({ mode, signUpPath }: { mode: Mode; signUpPath: SignUpPath }) {
  const isSignUp = mode === 'signup'
  return (
    <div>
      <p
        style={{
          color: '#2d6e28',
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '0.11em',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}
      >
        Greenify Access
      </p>
      <h1 style={{ color: '#1a2e1a', fontSize: '32px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '6px', minHeight: '35px' }}>
        {isSignUp ? 'Create your account' : 'Welcome back'}
      </h1>
      <p style={{ color: '#4a5e4a', fontSize: '14px', lineHeight: 1.6, marginBottom: '22px', minHeight: '42px' }}>
        {isSignUp
          ? signUpPath === 'school'
            ? 'Use your school email for campus-aware matching and early opportunities.'
            : 'Not in school right now? You can still join with a personal email.'
          : 'Sign in to manage your matches, saved jobs, and preferences.'}
      </p>
    </div>
  )
}

export function ModeTabs({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '6px', borderRadius: '12px', background: 'rgba(30,58,30,0.08)', marginBottom: '20px' }}>
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
              background: active ? '#1e3a1e' : 'transparent',
              color: active ? 'white' : '#355235',
            }}
          >
            {m === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        )
      })}
    </div>
  )
}

export function SignUpPathSelector({ path, onChange }: { path: SignUpPath; onChange: (p: SignUpPath) => void }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={labelStyle}>How are you joining?</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button
          type="button"
          onClick={() => onChange('school')}
          style={{
            border: path === 'school' ? '2px solid #2d6e28' : '1px solid rgba(30,58,30,0.2)',
            borderRadius: '12px',
            background: path === 'school' ? 'rgba(45,110,40,0.16)' : '#fffdf8',
            color: '#1a2e1a',
            textAlign: 'left',
            padding: '12px 14px',
            cursor: 'pointer',
            position: 'relative',
            boxShadow: path === 'school' ? '0 2px 8px rgba(45,110,40,0.15)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <p style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>School Email</p>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#2d6e28', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Recommended</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onChange('none')}
          style={{
            border: path === 'none' ? '1px solid #2d6e28' : '1px solid rgba(30,58,30,0.2)',
            borderRadius: '12px',
            background: path === 'none' ? 'rgba(45,110,40,0.12)' : '#fffdf8',
            color: '#1a2e1a',
            textAlign: 'left',
            padding: '12px 14px',
            cursor: 'pointer',
          }}
        >
          <p style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>No Organization</p>
        </button>
      </div>
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

  const filteredOrgs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return orgs
    return orgs.filter(
      (o) =>
        o.org_name?.toLowerCase().includes(q) ||
        o.email_domain?.toLowerCase().includes(q),
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

  return (
    <div style={{ marginBottom: '18px' }}>
      <label style={labelStyle}>School Organization</label>
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
            borderColor: open ? '#2d6e28' : 'rgba(30,58,30,0.22)',
            textAlign: 'left',
          }}
        >
          <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {selectedOrg ? (
              <>
                <span style={{ color: '#1a2e1a', fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedOrg.org_name}
                </span>
                <span style={{ color: '#4a5e4a', fontSize: '12px' }}>
                  @{selectedOrg.email_domain}
                </span>
              </>
            ) : (
              <span style={{ color: '#4a5e4a', fontSize: '14px' }}>
                Select your school
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
              background: '#fffdf8',
              border: '1px solid rgba(30,58,30,0.22)',
              borderRadius: '12px',
              boxShadow: '0 16px 34px rgba(30,58,30,0.16)',
              padding: '6px',
              zIndex: 120,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ position: 'relative', padding: '4px 4px 8px 4px' }}>
              <SearchIcon />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setVisibleLimit(ORG_CHUNK_SIZE)
                }}
                placeholder="Search schools..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: '9px',
                  border: '1px solid rgba(30,58,30,0.18)',
                  background: '#ffffff',
                  color: '#1a2e1a',
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
                <div style={{ padding: '12px', color: '#4a5e4a', fontSize: '13px', textAlign: 'center' }}>
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
                    onClick={() => {
                      onSelect(String(o.id))
                      setOpen(false)
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '9px',
                      background: active ? 'rgba(45,110,40,0.12)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: '#1a2e1a',
                      fontSize: '14px',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = 'rgba(30,58,30,0.06)'
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {o.org_name}
                      </span>
                      <span style={{ color: '#4a5e4a', fontSize: '12px' }}>
                        @{o.email_domain}
                      </span>
                    </span>
                    {active && <CheckIcon />}
                  </button>
                )
              })}
            </div>
            {loadingMore && (
              <div style={{ padding: '8px 12px 4px', color: '#4a5e4a', fontSize: '12px', textAlign: 'center' }}>
                Loading more schools...
              </div>
            )}
          </div>
        )}
      </div>
      {selectedOrg && (
        <p style={{ color: '#4a5e4a', fontSize: '12px', marginTop: '6px' }}>
          Your email must end with @{selectedOrg.email_domain}  
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
      <label style={labelStyle}>{label}</label>
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
      {hint && <p style={{ color: '#4a5e4a', fontSize: '12px', marginTop: '6px' }}>{hint}</p>}
    </div>
  )
}

export function MessageBanner({ message, type }: { message: string; type: 'error' | 'success' }) {
  return (
    <p
      style={{
        color: type === 'success' ? '#1f6b1a' : '#a33824',
        fontSize: '13px',
        marginBottom: '14px',
        textAlign: 'center',
        borderRadius: '10px',
        padding: '9px 10px',
        background: type === 'success' ? 'rgba(45,110,40,0.1)' : 'rgba(200,57,30,0.1)',
      }}
    >
      {message}
    </p>
  )
}

export function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: '100%',
        padding: '13px',
        borderRadius: '12px',
        background: '#1e3a1e',
        color: 'white',
        fontSize: '15px',
        fontWeight: 700,
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.72 : 1,
      }}
    >
      {label}
    </button>
  )
}

export function AuthSwitcher({ mode, onSwitch }: { mode: Mode; onSwitch: (m: Mode) => void }) {
  const isSignUp = mode === 'signup'
  return (
    <p style={{ color: '#4a5e4a', fontSize: '14px', textAlign: 'center' }}>
      {isSignUp ? 'Already have an account?' : "Need an account?"}{' '}
      <button
        type="button"
        onClick={() => onSwitch(isSignUp ? 'signin' : 'signup')}
        style={{ background: 'none', border: 'none', color: '#1a8a0d', cursor: 'pointer', fontSize: '14px', fontWeight: 700, padding: 0 }}
      >
        {isSignUp ? 'Sign in' : 'Create one'}
      </button>
    </p>
  )
}