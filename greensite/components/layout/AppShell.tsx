'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/db/supabase'

const BADGE_COLORS: Record<string, { bg: string; text: string; border: string; shadow: string }> = {
  '/custom_jobs/matches': { bg: 'rgba(239,68,68,0.15)',   text: '#ef4444', border: 'rgba(239,68,68,0.35)',   shadow: '#161616' },
  '/tracking':            { bg: 'rgba(139,92,246,0.18)',  text: '#a78bfa', border: 'rgba(139,92,246,0.45)',  shadow: '#161616' },
}

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

function ChevronsLeftIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="11 17 6 12 11 7"/>
      <polyline points="18 17 13 12 18 7"/>
    </svg>
  )
}

function ChevronsRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="13 17 18 12 13 7"/>
      <polyline points="6 17 11 12 6 7"/>
    </svg>
  )
}

function EyeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
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

function ChevronDownIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

const HEADER_HEIGHT = 56

const navItems = [
  { label: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  { label: 'Analytics', href: '/dashboard', icon: TrendingUpIcon },
  null,
  { label: 'Custom Jobs', href: '/custom_jobs/matches', icon: FileTextIcon },
  { label: 'Tracking', href: '/tracking', icon: EyeIcon },
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
  const [badges, setBadges] = useState<Record<string, number>>({
    '/custom_jobs/matches': 0,
    '/tracking': 0,
  })

  useEffect(() => {
    if (!user?.id) return
    const lastViewed = localStorage.getItem('customJobsLastViewed') ?? new Date(0).toISOString()
    supabase
      .from('user_job_matches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gt('created_at', lastViewed)
      .then(({ count }) => {
        setBadges(prev => ({ ...prev, '/custom_jobs/matches': count ?? 0 }))
      })
  }, [user?.id])

  useEffect(() => {
    if (pathname === '/custom_jobs/matches') {
      localStorage.setItem('customJobsLastViewed', new Date().toISOString())
      setBadges(prev => ({ ...prev, '/custom_jobs/matches': 0 }))
    } else if (pathname === '/tracking') {
      localStorage.setItem('trackingLastViewed', new Date().toISOString())
      setBadges(prev => ({ ...prev, '/tracking': 0 }))
    }
  }, [pathname])

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#080808' }}>

      {/* Full-width top navbar */}
      <header style={{
        height: HEADER_HEIGHT,
        background: 'rgba(14, 14, 14, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        zIndex: 50,
        padding: '0 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              width: '32px',
              height: '32px',
              background: 'rgba(41, 193, 21, 0.15)',
              filter: 'blur(12px)',
              borderRadius: '50%',
              left: '-4px',
              top: '-4px',
              zIndex: -1
            }} />
            <Image
              src="/finally.png"
              alt="Greenify logo"
              width={26}
              height={26}
              style={{ display: 'block' }}
            />
            <span style={{
              color: 'white',
              fontWeight: 700,
              fontSize: '17px',
              letterSpacing: '-0.02em',
              lineHeight: '1',
              display: collapsed ? 'none' : 'block'
            }}>
              Greenify
            </span>
          </Link>

          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{
                color: 'rgba(255,255,255,0.45)',
                fontWeight: 500,
                fontSize: '14px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: "'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', monospace",
              }}>
                Dashboard
              </span>
            </div>
          )}
        </div>

        <div style={{ marginLeft: 'auto', position: 'relative' }} ref={profileMenuRef}>
          <button
            onClick={() => setProfileMenuOpen(o => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px 4px 12px',
              background: profileMenuOpen ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseOver={(e) => {
              if (!profileMenuOpen) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              }
            }}
            onMouseOut={(e) => {
              if (!profileMenuOpen) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              }
            }}
          >
            {user?.email && (
              <span style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}>
                {user.email.split('@')[0]}
              </span>
            )}
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.75)',
            }}>
              <UserIcon size={13} />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.2)', marginRight: '2px' }}>
              <ChevronDownIcon size={11} />
            </div>
          </button>

          {profileMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '42px',
              right: 0,
              background: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              overflow: 'hidden',
              minWidth: '180px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
              zIndex: 100,
              animation: 'fadeIn 0.2s ease-out',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ color: 'white', fontSize: '12px', fontWeight: 600, marginBottom: '2px' }}>{user?.email?.split('@')[0]}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setProfileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  color: '#d4d4d8',
                  fontSize: '13px',
                  textDecoration: 'none',
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
                  gap: '10px',
                  width: '100%',
                  padding: '10px 16px',
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
      </header>

      {/* Body row */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          height: '100%',
          background: '#141414',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 200ms ease, min-width 200ms ease',
          overflow: 'hidden',
          flexShrink: 0,
        }}>

          <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', minHeight: 0 }}>
            {navItems.map((item, idx) => {
              if (item === null) {
                return <div key={idx} style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '6px 8px' }} />
              }

              const Icon = item.icon
              const isActive = pathname === item.href
              const badgeCount = badges[item.href] ?? 0
              const badgeColor = BADGE_COLORS[item.href]

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '4px',
                    marginBottom: '2px',
                    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: isActive ? '#ffffff' : '#71717a',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: isActive ? 500 : 400,
                    transition: 'background 150ms, color 150ms',
                    whiteSpace: 'nowrap',
                    overflow: 'visible',
                    cursor: 'pointer',
                    position: 'relative',
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
                  <div style={{ flexShrink: 0, position: 'relative' }}>
                    <Icon size={18} />
                    {collapsed && badgeColor && (
                      <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        minWidth: '14px',
                        height: '14px',
                        borderRadius: '7px',
                        background: badgeColor.bg,
                        color: badgeColor.text,
                        border: `1px solid ${badgeColor.border}`,
                        fontSize: '9px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 3px',
                        lineHeight: 1,
                        boxShadow: `0 0 0 1.5px ${badgeColor.shadow}`,
                      }}>
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </span>
                    )}
                  </div>

                  {!collapsed && item.label}

                  {!collapsed && badgeColor && (
                    <span style={{
                      position: 'absolute',
                      top: '-7px',
                      right: '-6px',
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '9px',
                      background: badgeColor.bg,
                      color: badgeColor.text,
                      border: `1px solid ${badgeColor.border}`,
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 5px',
                      lineHeight: 1,
                      boxShadow: `0 0 0 2px ${badgeColor.shadow}`,
                      zIndex: 1,
                    }}>
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                width: '100%',
                padding: '8px 10px',
                borderRadius: '7px',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.35)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 150ms',
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
            >
              {!collapsed && <span>Collapse</span>}
              {collapsed ? <ChevronsRightIcon /> : <ChevronsLeftIcon />}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', background: '#141414' }}>
          {children}
        </main>

      </div>

    </div>
  )
}
