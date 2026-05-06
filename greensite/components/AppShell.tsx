'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
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

const HEADER_HEIGHT = 52

const navItems = [
  { label: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  { label: 'Analytics', href: '/dashboard', icon: TrendingUpIcon },
  { label: 'Custom Jobs', href: '/custom_jobs/matches', icon: FileTextIcon },
  null,
  { label: 'Saved Jobs', href: '/saved', icon: BookmarkIcon },
  { label: 'Settings', href: '/settings', icon: GearIcon },
]

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    if (profileMenuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileMenuOpen])

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  const sidebarWidth = collapsed ? 60 : 200

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#111111' }}>

      {/* Full-width top navbar */}
      <header style={{
        height: HEADER_HEIGHT,
        background: '#1e1e1e',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        zIndex: 50,
      }}>
        {/* Logo section — aligned to sidebar width */}
        {/* Logo + title — single flex row, everything center-aligned */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 18px', flexShrink: 0 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', flexShrink: 0 }}>
            <Image
              src="/finally.png"
              alt="Greenify logo"
              width={24}
              height={24}
              style={{ display: 'block', flexShrink: 0 }}
            />
            {!collapsed && (
              <span style={{ color: 'white', fontWeight: 700, fontSize: '15px', lineHeight: '1', whiteSpace: 'nowrap' }}>
                Greenify
              </span>
            )}
          </Link>

          {!collapsed && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '15px', lineHeight: '1', userSelect: 'none' }}>·</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700, fontSize: '15px', lineHeight: '1', whiteSpace: 'nowrap' }}>
                Member Dashboard
              </span>
            </>
          )}
        </div>

        {/* Right: user info */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '20px' }}>
          {user?.email && (
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{user.email}</span>
          )}
          <div ref={profileMenuRef} style={{ position: 'relative' }}>
            <div
              onClick={() => setProfileMenuOpen(o => !o)}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: profileMenuOpen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <UserIcon size={14} />
            </div>
            {profileMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '38px',
                right: 0,
                background: '#1e1e1e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
                minWidth: '140px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                zIndex: 100,
              }}>
                <Link
                  href="/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    color: '#d4d4d8',
                    fontSize: '13px',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <GearIcon size={14} />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '10px 14px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f87171',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(248,113,113,0.07)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body row */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          height: '100%',
          background: '#161616',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 200ms ease, min-width 200ms ease',
          overflow: 'hidden',
          flexShrink: 0,
        }}>

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
                    padding: '10px 12px',
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
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', background: '#111111' }}>
          {children}
        </main>

      </div>

      {/* Help button */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 40 }}>
        <button
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#1e1e1e',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#a1a1aa',
            fontSize: '13px',
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
  )
}
