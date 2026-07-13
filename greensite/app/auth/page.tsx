'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

type Mode = 'signin' | 'signup'
type SignUpPath = 'school' | 'none'

type Org = {
  id: number
  name: string
  domain: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid rgba(30,58,30,0.22)',
  background: '#fffdf8',
  color: '#1a2e1a',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}

const panelCardStyle: React.CSSProperties = {
  background: '#f7f3ea',
  border: '1px solid rgba(30,58,30,0.18)',
  borderRadius: '20px',
  boxShadow: '0 30px 70px rgba(30,58,30,0.08)',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#1a2e1a',
  fontSize: '13px',
  fontWeight: 700,
  marginBottom: '8px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [signUpPath, setSignUpPath] = useState<SignUpPath>('school')
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
  const [visibleOrgLimit, setVisibleOrgLimit] = useState(8)
  const [orgsLoadingMore, setOrgsLoadingMore] = useState(false)
  const orgMenuRef = useRef<HTMLDivElement | null>(null)
  const orgSearchRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const isSignUp = mode === 'signup'

  const selectedOrg = useMemo(
    () => orgs.find((o) => String(o.id) === orgId) ?? null,
    [orgs, orgId],
  )

  const ORG_CHUNK_SIZE = 8
  const filteredOrgs = useMemo(() => {
    const q = orgQuery.trim().toLowerCase()
    if (!q) return orgs
    return orgs.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.domain.toLowerCase().includes(q),
    )
  }, [orgs, orgQuery])
  const visibleOrgs = filteredOrgs.slice(0, visibleOrgLimit)
  const hiddenCount = Math.max(filteredOrgs.length - visibleOrgs.length, 0)

  useEffect(() => {
    if (!isSignUp || signUpPath !== 'school' || orgs.length > 0) return
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
  }, [isSignUp, signUpPath, orgs.length])

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
    if (!orgMenuOpen) {
      setOrgQuery('')
      setVisibleOrgLimit(ORG_CHUNK_SIZE)
      setOrgsLoadingMore(false)
    }
  }, [orgMenuOpen])

  // Restore auth mode from URL when page loads.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const urlMode = new URLSearchParams(window.location.search).get('mode')
    if (urlMode === 'signup') {
      setMode('signup')
    }
  }, [])

  // Keep URL in sync so refresh preserves current mode.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (mode === 'signup') {
      url.searchParams.set('mode', 'signup')
    } else {
      url.searchParams.delete('mode')
    }
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
  }, [mode])

  const maybeLoadMoreOrgs = (scrollTop: number, clientHeight: number, scrollHeight: number) => {
    if (orgsLoading || orgsLoadingMore || hiddenCount <= 0) return
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 16
    if (!nearBottom) return

    setOrgsLoadingMore(true)
    window.setTimeout(() => {
      setVisibleOrgLimit((current) => Math.min(current + ORG_CHUNK_SIZE, filteredOrgs.length))
      setOrgsLoadingMore(false)
    }, 140)
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setMessage('')
    setPassword('')
    setConfirmPassword('')
    if (next === 'signin') {
      setSignUpPath('school')
      setOrgMenuOpen(false)
    }
  }

  const chooseSignUpPath = (nextPath: SignUpPath) => {
    setSignUpPath(nextPath)
    setMessage('')
    setOrgMenuOpen(false)
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

      const signUpMetadata: Record<string, string | number | null> = {
        sign_up_path: signUpPath,
      }

      if (signUpPath === 'school') {
        if (!selectedOrg) {
          setMessageType('error')
          setMessage('Please select your school organization.')
          return
        }

        const emailDomain = email.split('@')[1]?.toLowerCase().trim()
        const orgDomain = selectedOrg.domain.toLowerCase().trim()
        if (!emailDomain || emailDomain !== orgDomain) {
          setMessageType('error')
          setMessage(`Email must end with @${orgDomain} to join ${selectedOrg.name}.`)
          return
        }

        signUpMetadata.org_id = selectedOrg.id
        signUpMetadata.org_name = selectedOrg.name
      } else {
        signUpMetadata.org_id = null
        signUpMetadata.org_name = null
      }

      const emailRedirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/auth` : undefined

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: signUpMetadata,
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

  const emailPlaceholder = isSignUp
    ? signUpPath === 'school'
      ? selectedOrg
        ? `you@${selectedOrg.domain}`
        : 'student@university.edu'
      : 'you@example.com'
    : 'you@example.com'

  return (
    <div style={{ minHeight: '100vh', background: '#f0ece4', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main
        className="relative flex-1"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px 20px',
          overflowX: 'hidden',
          overflowY: 'visible',
        }}
      >
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

        <div className="w-full max-w-[520px] mx-auto relative z-10">
          <section style={{ ...panelCardStyle, padding: '32px 32px 28px' }}>
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

            <div>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '6px', borderRadius: '12px', background: 'rgba(30,58,30,0.08)', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => switchMode('signin')}
                style={{
                  border: 'none',
                  borderRadius: '9px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: !isSignUp ? '#1e3a1e' : 'transparent',
                  color: !isSignUp ? 'white' : '#355235',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                style={{
                  border: 'none',
                  borderRadius: '9px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: isSignUp ? '#1e3a1e' : 'transparent',
                  color: isSignUp ? 'white' : '#355235',
                }}
              >
                Sign Up
              </button>
            </div>

            <div>
              <form onSubmit={handleSubmit}>
                {isSignUp && (
                  <div style={{ marginBottom: '16px' }}>
                  <p style={labelStyle}>How are you joining?</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => chooseSignUpPath('school')}
                      style={{
                        border: signUpPath === 'school' ? '2px solid #2d6e28' : '1px solid rgba(30,58,30,0.2)',
                        borderRadius: '12px',
                        background: signUpPath === 'school' ? 'rgba(45,110,40,0.16)' : '#fffdf8',
                        color: '#1a2e1a',
                        textAlign: 'left',
                        padding: '12px 14px',
                        cursor: 'pointer',
                        position: 'relative',
                        boxShadow: signUpPath === 'school' ? '0 2px 8px rgba(45,110,40,0.15)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>School Email</p>
                        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#2d6e28', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Recommended</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => chooseSignUpPath('none')}
                      style={{
                        border: signUpPath === 'none' ? '1px solid #2d6e28' : '1px solid rgba(30,58,30,0.2)',
                        borderRadius: '12px',
                        background: signUpPath === 'none' ? 'rgba(45,110,40,0.12)' : '#fffdf8',
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
                )}

                {isSignUp && signUpPath === 'school' && (
                  <div style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>School Organization</label>
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
                        borderColor: orgMenuOpen ? '#2d6e28' : 'rgba(30,58,30,0.22)',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        {selectedOrg ? (
                          <>
                            <span style={{ color: '#1a2e1a', fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {selectedOrg.name}
                            </span>
                            <span style={{ color: '#4a5e4a', fontSize: '12px' }}>
                              @{selectedOrg.domain}
                            </span>
                          </>
                        ) : (
                          <span style={{ color: '#4a5e4a', fontSize: '14px' }}>
                            Select your school
                          </span>
                        )}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4a5e4a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          flexShrink: 0,
                          transform: orgMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
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
                          <input
                            ref={orgSearchRef}
                            type="text"
                            value={orgQuery}
                            onChange={(e) => {
                              setOrgQuery(e.target.value)
                              setVisibleOrgLimit(ORG_CHUNK_SIZE)
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
                            maybeLoadMoreOrgs(target.scrollTop, target.clientHeight, target.scrollHeight)
                          }}
                        >
                          {filteredOrgs.length === 0 && (
                            <div style={{ padding: '12px', color: '#4a5e4a', fontSize: '13px', textAlign: 'center' }}>
                              {orgsLoading ? 'Loading...' : 'No schools found'}
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
                                  borderRadius: '9px',
                                  background: active ? 'rgba(45,110,40,0.12)' : 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  color: '#1a2e1a',
                                  fontSize: '14px',
                                }}
                                onMouseEnter={(e) => {
                                  if (!active) (e.currentTarget.style.background = 'rgba(30,58,30,0.06)')
                                }}
                                onMouseLeave={(e) => {
                                  if (!active) (e.currentTarget.style.background = 'transparent')
                                }}
                              >
                                <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                  <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {o.name}
                                  </span>
                                  <span style={{ color: '#4a5e4a', fontSize: '12px' }}>
                                    @{o.domain}
                                  </span>
                                </span>
                                {active && (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6e28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </button>
                            )
                          })}
                        </div>
                        {orgsLoadingMore && (
                          <div style={{ padding: '8px 12px 4px', color: '#4a5e4a', fontSize: '12px', textAlign: 'center' }}>
                            Loading more schools...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedOrg && (
                    <p style={{ color: '#4a5e4a', fontSize: '12px', marginTop: '6px' }}>
                      Your email must end with @{selectedOrg.domain}
                    </p>
                  )}
                  </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Email</label>
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
                    <p style={{ color: '#4a5e4a', fontSize: '12px', marginTop: '6px' }}>
                      Use the email tied to your account
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: isSignUp ? '16px' : '20px' }}>
                  <label style={labelStyle}>Password</label>
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
                    <p style={{ color: '#4a5e4a', fontSize: '12px', marginTop: '6px' }}>
                      At least 8 characters
                    </p>
                  )}
                </div>

                {isSignUp && (
                  <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Confirm Password</label>
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
                <p
                  style={{
                    color: messageType === 'success' ? '#1f6b1a' : '#a33824',
                    fontSize: '13px',
                    marginBottom: '14px',
                    textAlign: 'center',
                    borderRadius: '10px',
                    padding: '9px 10px',
                    background: messageType === 'success' ? 'rgba(45,110,40,0.1)' : 'rgba(200,57,30,0.1)',
                  }}
                >
                  {message}
                </p>
              )}

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
                <p style={{ color: '#4a5e4a', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>
                  Forgot password?
                </p>
              )}

              <div style={{ borderTop: '1px solid rgba(30,58,30,0.16)', margin: '20px 0 16px' }} />

              <p style={{ color: '#4a5e4a', fontSize: '14px', textAlign: 'center' }}>
                {isSignUp ? 'Already have an account?' : "Need an account?"}{' '}
                <button
                  type="button"
                  onClick={() => switchMode(isSignUp ? 'signin' : 'signup')}
                  style={{ background: 'none', border: 'none', color: '#1a8a0d', cursor: 'pointer', fontSize: '14px', fontWeight: 700, padding: 0 }}
                >
                  {isSignUp ? 'Sign in' : 'Create one'}
                </button>
              </p>

            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
