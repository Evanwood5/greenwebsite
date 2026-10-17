'use client'

import { linkedInPeopleSearchUrl } from '@/lib/utils/linkedin'

interface LinkedInButtonProps {
  companyName: string | null | undefined
  size?: number
  ariaLabel?: string
}

export default function LinkedInButton({
  companyName,
  size = 28,
  ariaLabel = 'Find company employees on LinkedIn',
}: LinkedInButtonProps) {
  return (
    <a
      href={linkedInPeopleSearchUrl(companyName)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, background: 'rgba(59,130,246,0.08)',
        color: '#3b82f6', borderRadius: '5px', border: '1px solid rgba(59,130,246,0.2)',
        textDecoration: 'none', transition: 'background 150ms', flexShrink: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.16)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.08)')}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    </a>
  )
}
