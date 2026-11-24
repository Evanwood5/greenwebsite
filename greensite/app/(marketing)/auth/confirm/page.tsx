'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/db/supabase'
import Navbar from '@/components/layout/Navbar'
import { panelCardStyle } from '@/lib/utils/auth'
import { ConfirmPanel, OtpInput, ResendLink } from './components'

function ConfirmContent() {
  const params = useSearchParams()
  const email = params.get('email') ?? ''
  const router = useRouter()

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) {
      setError('Enter the full 6-digit code.')
      return
    }
    setLoading(true)
    setError('')

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    })

    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
    } else {
      router.push('/jobs')
    }
  }

  return (
    <ConfirmPanel>
      <h1 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>
        Check your email
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        We sent a confirmation code to <strong>{email}</strong>.
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        background: 'rgb(var(--palette-rust-600-rgb, 180 40 40) / 0.07)',
        border: '1px solid rgb(var(--palette-rust-600-rgb, 180 40 40) / 0.18)',
        borderRadius: '10px',
        padding: '10px 14px',
        marginBottom: '20px',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
      }}>
        ⚠️ Email may take up to 4 minutes to arrive. Please be patient — also check your <strong>junk/spam</strong> folder.
      </div>

      <form onSubmit={handleSubmit}>
        <OtpInput value={code} onChange={setCode} disabled={loading} />

        {error && (
          <p style={{
            color: 'var(--palette-rust-600)',
            fontSize: '13px',
            marginBottom: '12px',
            padding: '10px 14px',
            background: 'rgb(var(--palette-rust-600-rgb, 180 40 40) / 0.08)',
            borderRadius: '10px',
          }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '12px',
            border: 'none',
            background: 'var(--palette-forest-700)',
            color: 'var(--palette-white)',
            fontSize: '15px',
            fontWeight: 700,
            cursor: loading || code.length !== 6 ? 'default' : 'pointer',
            opacity: loading || code.length !== 6 ? 0.5 : 1,
          }}
        >
          {loading ? 'Verifying...' : 'Confirm Email'}
        </button>
      </form>

      <ResendLink email={email} disabled={loading} />
    </ConfirmPanel>
  )
}

export default function ConfirmPage() {
  return (
    <div
      className="theme-auth"
      style={{ minHeight: '100vh', background: 'var(--surface-app)', display: 'flex', flexDirection: 'column' }}
    >
      <Navbar />
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px 20px',
        }}
      >
        <Suspense fallback={null}>
          <ConfirmContent />
        </Suspense>
      </main>
    </div>
  )
}
