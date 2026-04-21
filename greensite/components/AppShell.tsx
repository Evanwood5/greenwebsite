'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

function BriefcaseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  )
}

function TrendingUpIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  )
}

function FileTextIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )
}

function BookmarkIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  )
}

function GearIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  )
}

function ChevronLeftIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

function ChevronRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}

function UserIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}


const navItems = [
  { label: 'Job Dashboard', href: '/jobs', icon: BriefcaseIcon },
  { label: 'Analytics', href: '/dashboard', icon: TrendingUpIcon },
  { label: 'Resume Jobs', href: '/custom_jobs/matches', icon: FileTextIcon },
  null,
  { label: 'Saved Jobs', href: '/saved', icon: BookmarkIcon },
  { label: 'Settings', href: '/settings', icon: GearIcon },
]

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const sidebarWidth = collapsed ? 60 : 260

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080808' }}>
      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: '#0a0a0a',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 200ms ease, min-width 200ms ease',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ padding: collapsed ? '16px 14px' : '16px 18px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none', cursor: 'pointer' }}>
          <div style={{ flexShrink: 0 }}>
            <Image src="/final_green.png" alt="Greenify logo" width={32} height={32} />
          </div>
          {!collapsed && (
            <span style={{ color: 'white', fontWeight: 700, fontSize: '16px', whiteSpace: 'nowrap' }}>
              Greenify
            </span>
          )}
        </Link>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', minHeight: 0 }}>
          {navItems.map((item, idx) => {
            if (item === null) {
              return <div key={idx} style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '6px 8px' }} />
            }

            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: collapsed ? '10px 12px' : '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '2px',
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: isActive ? '#ffffff' : '#71717a',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: isActive ? 500 : 400,
                  transition: 'background 150ms, color 150ms',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.color = '#e4e4e7'
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#71717a'
                  }
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <Icon size={18} />
                </div>
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>

        {/* Collapse button */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              color: '#29C115',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 150ms',
              whiteSpace: 'nowrap',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#1a1a1a')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            {!collapsed && 'Collapse'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <header style={{ padding: '10px 20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {user?.email && (
            <span style={{ color: '#52525b', fontSize: '12px' }}>{user.email}</span>
          )}
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'rgba(41,193,21,0.08)',
              border: '1px solid rgba(41,193,21,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#29C115',
              flexShrink: 0,
            }}
          >
            <UserIcon size={14} />
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '18px 32px', background: '#080808' }}>
          {children}
        </main>

        {/* Help button */}
        <div style={{ position: 'fixed', bottom: '24px', right: '24px' }}>
          <button
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#242424',
              border: 'none',
              color: 'white',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Help"
          >
            ?
          </button>
        </div>
      </div>
    </div>
  )
}
