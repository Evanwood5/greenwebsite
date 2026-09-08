'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Mode, SignUpPath, Org, parseMetadataOrgId, panelCardStyle } from './types'
import { signIn, signUp } from '@/lib/services/auth'
import { listOrgs } from '@/lib/services/profile'
import {
  AuthHeader,
  AuthSwitcher,
  DecorativeBackground,
  FormField,
  MessageBanner,
  ModeTabs,
  OrgDropdown,
  SignUpPathSelector,
  SubmitButton,
} from './components'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [signUpPath, setSignUpPath] = useState<SignUpPath>('school')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [orgs, setOrgs] = useState<Org[]>([])
  const [orgsLoading, setOrgsLoading] = useState(false)
  const [orgId, setOrgId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success'>('error')
  const router = useRouter()

  const isSignUp = mode === 'signup'

  const selectedOrg = useMemo(
    () => orgs.find((o) => String(o.id) === orgId) ?? null,
    [orgs, orgId],
  )

  useEffect(() => {
    if (!isSignUp || signUpPath !== 'school' || orgs.length > 0) return
    let cancelled = false
    setOrgsLoading(true)
    listOrgs()
      .then((rows) => {
        if (cancelled) return
        setOrgs(rows)
      })
      .catch(() => {
        if (cancelled) return
        setMessageType('error')
        setMessage('Could not load organizations. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setOrgsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isSignUp, signUpPath, orgs.length])

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

  const switchMode = (next: Mode) => {
    setMode(next)
    setMessage('')
    setPassword('')
    setConfirmPassword('')
    if (next === 'signin') {
      setSignUpPath('school')
    }
  }

  const chooseSignUpPath = (nextPath: SignUpPath) => {
    setSignUpPath(nextPath)
    setMessage('')
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

      const res = await signUp(email, password, signUpMetadata, emailRedirectTo)

      if (!res.ok) {
        setMessageType('error')
        setMessage(res.message)
      } else if (res.requiresConfirmation) {
        setMessageType('success')
        setMessage('Account created! Check your email to confirm your address before signing in.')
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
    ? signUpPath === 'school'
      ? selectedOrg
        ? `you@${selectedOrg.domain}`
        : 'student@university.edu'
      : 'you@example.com'
    : 'you@example.com'

  const submitLabel = loading
    ? isSignUp
      ? 'Creating account...'
      : 'Signing in...'
    : isSignUp
      ? 'Create Account'
      : 'Sign In'

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
        <DecorativeBackground />

        <div className="w-full max-w-[520px] mx-auto relative z-10">
          <section style={{ ...panelCardStyle, padding: '32px 32px 28px' }}>
            <AuthHeader mode={mode} signUpPath={signUpPath} />

            <ModeTabs mode={mode} onChange={switchMode} />

            <form onSubmit={handleSubmit}>
              {isSignUp && <SignUpPathSelector path={signUpPath} onChange={chooseSignUpPath} />}

              {isSignUp && signUpPath === 'school' && (
                <OrgDropdown
                  orgs={orgs}
                  selectedOrgId={orgId}
                  loading={orgsLoading}
                  onSelect={setOrgId}
                />
              )}

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

              {message && <MessageBanner message={message} type={messageType} />}

              <SubmitButton loading={loading} label={submitLabel} />
            </form>

            {!isSignUp && (
              <p style={{ color: '#4a5e4a', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>
                Forgot password?
              </p>
            )}

            <div style={{ borderTop: '1px solid rgba(30,58,30,0.16)', margin: '20px 0 16px' }} />

            <AuthSwitcher mode={mode} onSwitch={switchMode} />
          </section>
        </div>
      </main>
    </div>
  )
}