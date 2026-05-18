'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

type Mode = 'signin' | 'signup'

type Org = {
  id: number
  name: string
  domain: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid #333',
  background: '#1a1a1a',
  color: 'white',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [orgs, setOrgs] = useState<Org[]>([])
  const [orgsLoading, setOrgsLoading] = useState(false)
  const [orgId, setOrgId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success'>('error')
  const [orgMenuOpen, setOrgMenuOpen] = useState(false)
  const [orgQuery, setOrgQuery] = useState('')
  const orgMenuRef = useRef<HTMLDivElement | null>(null)
  const orgSearchRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const isSignUp = mode === 'signup'

  const selectedOrg = useMemo(
    () => orgs.find((o) => String(o.id) === orgId) ?? null,
    [orgs, orgId],
  )

  const ORG_VISIBLE_LIMIT = 6
  const filteredOrgs = useMemo(() => {
    const q = orgQuery.trim().toLowerCase()
    if (!q) return orgs
    return orgs.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.domain.toLowerCase().includes(q),
    )
  }, [orgs, orgQuery])
  const visibleOrgs = filteredOrgs.slice(0, ORG_VISIBLE_LIMIT)
  const hiddenCount = Math.max(filteredOrgs.length - visibleOrgs.length, 0)

  useEffect(() => {
    if (!isSignUp || orgs.length > 0) return
    let cancelled = false
    setOrgsLoading(true)
    supabase
      .from('orgs')
      .select('id, name, domain')
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setMessageType('error')
          setMessage('Could not load organizations. Please try again.')
        } else if (data) {
          setOrgs(data as Org[])
        }
        setOrgsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isSignUp, orgs.length])

  useEffect(() => {
    if (!orgMenuOpen) return
    // Focus the search input when the menu opens
    const t = window.setTimeout(() => orgSearchRef.current?.focus(), 0)
    const onClick = (e: MouseEvent) => {
      if (orgMenuRef.current && !orgMenuRef.current.contains(e.target as Node)) {
        setOrgMenuOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOrgMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [orgMenuOpen])

  // Clear search when closing the menu
  useEffect(() => {
    if (!orgMenuOpen) setOrgQuery('')
  }, [orgMenuOpen])

  const switchMode = (next: Mode) => {
    setMode(next)
    setMessage('')
    setPassword('')
    setConfirmPassword('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setMessageType('error')
          setMessage(error.message)
        } else if (data.user) {
          router.push('/jobs')
        }
        return
      }

      // Sign up flow
      if (!selectedOrg) {
        setMessageType('error')
        setMessage('Please select your organization.')
        return
      }
      if (password.length < 8) {
        setMessageType('error')
        setMessage('Password must be at least 8 characters.')
        return
      }
      if (password !== confirmPassword) {
        setMessageType('error')
        setMessage('Passwords do not match.')
        return
      }

      const emailDomain = email.split('@')[1]?.toLowerCase().trim()
      const orgDomain = selectedOrg.domain.toLowerCase().trim()
      if (!emailDomain || emailDomain !== orgDomain) {
        setMessageType('error')
        setMessage(`Email must end with @${orgDomain} to join ${selectedOrg.name}.`)
        return
      }

      const emailRedirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/auth` : undefined

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            org_id: selectedOrg.id,
            org_name: selectedOrg.name,
          },
        },
      })

      if (error) {
        setMessageType('error')
        setMessage(error.message)
      } else if (data.user && !data.session) {
        setMessageType('success')
        setMessage('Account created! Check your email to confirm your address before signing in.')
      } else if (data.session) {
        router.push('/jobs')
      }
    } catch {
      setMessageType('error')
      setMessage('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const emailPlaceholder = isSignUp && selectedOrg
    ? `you@${selectedOrg.domain}`
    : 'student@university.edu'

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', minHeight: 'calc(100vh - 80px)' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '28px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
              <line x1="12" y1="12" x2="12" y2="16"/>
              <line x1="10" y1="14" x2="14" y2="14"/>
            </svg>
            <span style={{ color: 'white', fontSize: '20px', fontWeight: 700 }}>Greenify</span>
          </div>

          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>
            {isSignUp ? 'Sign up with your university email' : 'Sign in with your university email'}
          </p>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Organization
                </label>
                <div ref={orgMenuRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => !orgsLoading && setOrgMenuOpen((v) => !v)}
                    disabled={orgsLoading}
                    aria-haspopup="listbox"
                    aria-expanded={orgMenuOpen}
                    style={{
                      ...inputStyle,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      cursor: orgsLoading ? 'not-allowed' : 'pointer',
                      borderColor: orgMenuOpen ? '#29C115' : '#333',
                      transition: 'border-color 0.15s ease',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      {selectedOrg ? (
                        <>
                          <span style={{ color: 'white', fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedOrg.name}
                          </span>
                          <span style={{ color: '#6b7280', fontSize: '12px' }}>
                            @{selectedOrg.domain}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>
                          {orgsLoading ? 'Loading organizations...' : 'Select your organization'}
                        </span>
                      )}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        flexShrink: 0,
                        transform: orgMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {orgMenuOpen && (
                    <div
                      role="listbox"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        background: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                        borderRadius: '10px',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
                        padding: '6px',
                        zIndex: 50,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ position: 'relative', padding: '4px 4px 8px 4px' }}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#6b7280"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%) translateY(-2px)', pointerEvents: 'none' }}
                        >
                          <circle cx="11" cy="11" r="7" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                          ref={orgSearchRef}
                          type="text"
                          value={orgQuery}
                          onChange={(e) => setOrgQuery(e.target.value)}
                          placeholder="Search organizations..."
                          style={{
                            width: '100%',
                            padding: '9px 12px 9px 34px',
                            borderRadius: '8px',
                            border: '1px solid #2a2a2a',
                            background: '#111',
                            color: 'white',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                        {filteredOrgs.length === 0 && (
                          <div style={{ padding: '12px', color: '#6b7280', fontSize: '13px', textAlign: 'center' }}>
                            {orgsLoading ? 'Loading...' : 'No organizations found'}
                          </div>
                        )}
                        {visibleOrgs.map((o) => {
                          const active = String(o.id) === orgId
                          return (
                            <button
                              key={o.id}
                              type="button"
                              role="option"
                              aria-selected={active}
                              onClick={() => {
                                setOrgId(String(o.id))
                                setOrgMenuOpen(false)
                              }}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                background: active ? 'rgba(41,193,21,0.12)' : 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                color: 'white',
                                fontSize: '14px',
                                transition: 'background 0.12s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (!active) (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')
                              }}
                              onMouseLeave={(e) => {
                                if (!active) (e.currentTarget.style.background = 'transparent')
                              }}
                            >
                              <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {o.name}
                                </span>
                                <span style={{ color: '#6b7280', fontSize: '12px' }}>
                                  @{o.domain}
                                </span>
                              </span>
                              {active && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>
                          )
                        })}
                      </div>
                      {hiddenCount > 0 && (
                        <div style={{ padding: '8px 12px 4px', color: '#6b7280', fontSize: '12px', textAlign: 'center', borderTop: '1px solid #222', marginTop: '4px' }}>
                          {hiddenCount} more — keep typing to narrow results
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {selectedOrg && (
                  <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '6px' }}>
                    Your email must end with @{selectedOrg.domain}
                  </p>
                )}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={emailPlaceholder}
                style={inputStyle}
              />
              {!isSignUp && (
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '6px' }}>
                  Must be from a partnered university
                </p>
              )}
            </div>

            <div style={{ marginBottom: isSignUp ? '20px' : '24px' }}>
              <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                required
                minLength={isSignUp ? 8 : undefined}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
              {isSignUp && (
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '6px' }}>
                  At least 8 characters
                </p>
              )}
            </div>

            {isSignUp && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            {message && (
              <p style={{ color: messageType === 'success' ? '#29C115' : '#ef4444', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', background: '#29C115', color: 'white', fontSize: '15px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading
                ? isSignUp
                  ? 'Creating account...'
                  : 'Signing in...'
                : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
            </button>
          </form>

          {!isSignUp && (
            <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>
              Forgot password?
            </p>
          )}

          <div style={{ borderTop: '1px solid #222', margin: '24px 0' }} />

          <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => switchMode(isSignUp ? 'signin' : 'signup')}
              style={{ background: 'none', border: 'none', color: '#29C115', cursor: 'pointer', fontSize: '14px', fontWeight: 600, padding: 0 }}
            >
              {isSignUp ? 'Sign in' : 'Create an account'}
            </button>
          </p>

          {!isSignUp && (
            <p style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>
              Need partnership access?{' '}
              <a href="mailto:partnerships@greenify.io" style={{ color: '#29C115', textDecoration: 'none' }}>
                Contact your university
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
