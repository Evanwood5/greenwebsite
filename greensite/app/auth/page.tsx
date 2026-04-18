'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setMessage(error.message)
      } else if (data.user) {
        router.push('/jobs')
      }
    } catch {
      setMessage('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '28px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
            <line x1="12" y1="12" x2="12" y2="16"/>
            <line x1="10" y1="14" x2="14" y2="14"/>
          </svg>
          <span style={{ color: 'white', fontSize: '20px', fontWeight: 700 }}>Greenify</span>
        </div>

        <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>
          Welcome back
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>
          Sign in with your university email
        </p>

        <form onSubmit={handleSignIn}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
              University Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #333', background: '#1a1a1a', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
            <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '6px' }}>
              Must be from a partnered university
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #333', background: '#1a1a1a', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {message && (
            <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', borderRadius: '10px', background: '#22c55e', color: 'white', fontSize: '15px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>
          Forgot password?
        </p>

        <div style={{ borderTop: '1px solid #222', margin: '24px 0' }} />

        <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>
          Don&apos;t have access?{' '}
          <a href="mailto:partnerships@greenify.io" style={{ color: '#22c55e', textDecoration: 'none' }}>
            Contact your university
          </a>
        </p>
      </div>
    </div>
  )
}
