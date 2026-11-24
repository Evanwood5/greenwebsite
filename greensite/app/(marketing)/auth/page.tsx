'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Mode, Org } from '@/lib/types/auth'
import { signIn, signUp } from '@/lib/services/auth'
import { listOrgs } from '@/lib/services/profile'
import { panelCardStyle, parseMetadataOrgId } from '@/lib/utils/auth'
import {
  AuthHeader,
  AuthSwitcher,
  FormField,
  MessageBanner,
  ModeTabs,
  OrgDropdown,
  SubmitButton,
  TermsCheckbox,
} from './components'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [orgs, setOrgs] = useState<Org[]>([])
  const [orgsLoading, setOrgsLoading] = useState(false)
  const [orgId, setOrgId] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success'>('error')
  const router = useRouter()

  const isSignUp = mode === 'signup'

  // Derive signUpPath from orgId selection
  const signUpPath = orgId === 'none' || orgId === '' ? 'none' : 'school'

  const selectedOrg = useMemo(
    () => orgs.find((o) => String(o.id) === orgId) ?? null,
    [orgs, orgId],
  )

  // Load orgs whenever user is on sign-up
  useEffect(() => {
    if (!isSignUp || orgs.length > 0) return
    let cancelled = false
    setOrgsLoading(true)
    listOrgs()
      .then((rows) => { if (!cancelled) setOrgs(rows) })
      .catch(() => {
        if (cancelled) return
        setMessageType('error')
        setMessage('Could not load organizations. Please try again.')
      })
      .finally(() => { if (!cancelled) setOrgsLoading(false) })
    return () => { cancelled = true }
  }, [isSignUp, orgs.length])

  // Restore auth mode from URL when page loads.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const urlMode = new URLSearchParams(window.location.search).get('mode')
    if (urlMode === 'signup') setMode('signup')
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

  const switchMode = (next: Mode) => {
    setMode(next)
    setMessage('')
    setPassword('')
    setConfirmPassword('')
    setTermsAccepted(false)
    setOrgId('')
  }

  const syncProfileOrgId = async (userId: string, accessToken: string, orgId: number | null) => {
    try {
      await fetch('/api/profile/sync-org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId, orgId }),
      })
    } catch {
      // Do not block auth flow if profile sync has a transient failure.
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signin') {
        const res = await signIn(email, password)
        if (!res.ok) {
          setMessageType('error')
          setMessage(res.message)
        } else if (res.user && res.session) {
          const metadataPath = res.user.metadata.sign_up_path
          let orgIdForSync: number | null | undefined
          if (metadataPath === 'none') {
            orgIdForSync = null
          } else if (metadataPath === 'school') {
            const parsed = parseMetadataOrgId(res.user.metadata.org_id)
            if (parsed !== null) orgIdForSync = parsed
          }
          if (orgIdForSync !== undefined) {
            await syncProfileOrgId(res.user.id, res.session.access_token, orgIdForSync)
          }
          router.push('/jobs')
        } else if (res.user) {
          router.push('/jobs')
        }
        return
      }

      // Sign up validations
      if (!termsAccepted) {
        setMessageType('error')
        setMessage('Please agree to the Terms of Service and Privacy Policy.')
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

      const signUpMetadata: Record<string, string | number | null> = {
        sign_up_path: signUpPath,
      }

      if (signUpPath === 'school' && selectedOrg) {
        signUpMetadata.org_id = selectedOrg.id
        signUpMetadata.org_name = selectedOrg.org_name
      } else {
        signUpMetadata.org_id = null
        signUpMetadata.org_name = null
      }

      const emailRedirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/auth` : undefined

      const res = await signUp(email, password, signUpMetadata, emailRedirectTo)

      if (!res.ok) {
        setMessageType('error')
        setMessage(res.message)
      } else if (res.requiresConfirmation) {
        router.push(`/auth/confirm?email=${encodeURIComponent(email)}`)
      } else if (res.session && res.user) {
        const orgIdForSync = signUpPath === 'school' && selectedOrg ? selectedOrg.id : null
        await syncProfileOrgId(res.user.id, res.session.access_token, orgIdForSync)
        router.push('/jobs')
      } else {
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
    ? 'you@example.com'
    : 'you@example.com'

  const signUpReady = !isSignUp || (
    email.length > 0 &&
    password.length >= 8 &&
    confirmPassword.length > 0 &&
    termsAccepted
  )

  const submitLabel = loading
    ? isSignUp ? 'Creating account...' : 'Signing in...'
    : isSignUp ? 'Create Account' : 'Sign In'

  return (
    <div className="theme-auth" style={{ minHeight: '100vh', background: 'var(--surface-app)', display: 'flex', flexDirection: 'column' }}>
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
        <div className="w-full max-w-[520px] mx-auto relative z-10">
          <section style={{ ...panelCardStyle, padding: '32px 32px 28px' }}>
            <AuthHeader mode={mode} />

            <ModeTabs mode={mode} onChange={switchMode} />

            <form onSubmit={handleSubmit}>
              <FormField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                placeholder={emailPlaceholder}
                required
                hint={!isSignUp ? 'Use the email tied to your account' : undefined}
              />

              <FormField
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                minLength={isSignUp ? 8 : undefined}
                hint={isSignUp ? 'At least 8 characters' : undefined}
                marginBottom={isSignUp ? 16 : 20}
                required
              />

              {isSignUp && (
                <FormField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  autoComplete="new-password"
                  minLength={8}
                  marginBottom={20}
                  required
                />
              )}

              {isSignUp && (
                <OrgDropdown
                  orgs={orgs}
                  selectedOrgId={orgId}
                  loading={orgsLoading}
                  onSelect={setOrgId}
                />
              )}

              {isSignUp && (
                <TermsCheckbox accepted={termsAccepted} onChange={setTermsAccepted} />
              )}

              {message && <MessageBanner message={message} type={messageType} />}

              <SubmitButton loading={loading} label={submitLabel} disabled={!signUpReady} />
            </form>

            {!isSignUp && (
              <p style={{ color: 'var(--palette-forest-500)', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>
                Forgot password?
              </p>
            )}

            <div style={{ borderTop: '1px solid rgb(var(--palette-forest-800-rgb) / 0.16)', margin: '20px 0 16px' }} />

            <AuthSwitcher mode={mode} onSwitch={switchMode} />
          </section>
        </div>
      </main>
    </div>
  )
}
