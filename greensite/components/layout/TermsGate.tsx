'use client'

import { useState } from 'react'
import { supabase } from '@/lib/db/supabase'

export function TermsGate({ userId, onAccepted }: { userId: string; onAccepted: () => void }) {
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    if (!accepted) return
    setLoading(true)
    await supabase
      .from('profiles')
      .update({ terms_accepted_at: new Date().toISOString() })
      .eq('user_id', userId)
    setLoading(false)
    onAccepted()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgb(var(--palette-black-rgb) / 0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--surface-raised)',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 24px 48px rgb(var(--shadow-rgb) / 0.3)',
      }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
          Updated Terms of Service
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          We&apos;ve updated our Terms of Service and Privacy Policy. Please review and accept them to continue using Greenify.
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
          <input
            type="checkbox"
            id="terms-gate-checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            style={{ marginTop: '2px', width: '15px', height: '15px', flexShrink: 0, accentColor: 'var(--palette-forest-700)', cursor: 'pointer' }}
          />
          <label htmlFor="terms-gate-checkbox" style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, cursor: 'pointer' }}>
            I agree to the{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--palette-blue-500)', fontWeight: 600, textDecoration: 'none' }}>
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--palette-blue-500)', fontWeight: 600, textDecoration: 'none' }}>
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          onClick={handleAccept}
          disabled={!accepted || loading}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '12px',
            border: 'none',
            background: 'var(--palette-forest-800)',
            color: 'var(--accent-contrast)',
            fontSize: '15px',
            fontWeight: 700,
            cursor: !accepted || loading ? 'not-allowed' : 'pointer',
            opacity: !accepted || loading ? 0.5 : 1,
          }}
        >
          {loading ? 'Saving...' : 'Continue to Dashboard'}
        </button>
      </div>
    </div>
  )
}
