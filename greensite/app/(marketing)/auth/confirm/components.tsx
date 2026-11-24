'use client'

import { useState } from 'react'
import { inputStyle, labelStyle, panelCardStyle } from '@/lib/utils/auth'

export function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>
        Confirmation Code
        <span style={{ color: 'var(--palette-rust-600)', marginLeft: '3px' }}>*</span>
      </label>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        disabled={disabled}
        placeholder="000000"
        style={{
          ...inputStyle,
          letterSpacing: '0.3em',
          fontSize: '22px',
          textAlign: 'center',
        }}
      />
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
        Enter the 6-digit code sent to your email.
      </p>
    </div>
  )
}

export function ResendLink({
  email,
  disabled,
}: {
  email: string
  disabled?: boolean
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleResend = async () => {
    if (disabled || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/auth/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const label =
    status === 'sending' ? 'Sending...' :
    status === 'sent'    ? 'Code resent!' :
    status === 'error'   ? 'Failed — try again' :
    'Resend code'

  return (
    <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
      Didn&apos;t get it?{' '}
      <button
        type="button"
        onClick={handleResend}
        disabled={disabled || status === 'sending'}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: disabled || status === 'sending' ? 'default' : 'pointer',
          color: status === 'sent' ? 'var(--palette-forest-600)' : 'var(--palette-blue-500, #3b82f6)',
          fontSize: '13px',
          fontWeight: 600,
          textDecoration: 'underline',
        }}
      >
        {label}
      </button>
    </p>
  )
}

export function ConfirmPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        ...panelCardStyle,
        padding: '32px 32px 28px',
        maxWidth: '480px',
        width: '100%',
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  )
}
