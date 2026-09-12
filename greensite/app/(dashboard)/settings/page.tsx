'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/layout/AppShell'
import { getProfile } from '@/lib/services/profile'
import { sectionHeadingStyle, sectionSubStyle, getUniversityFromDomain } from '@/lib/utils/settings'
import { ProfileCard, NotificationsCard } from './components'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [orgDomain, setOrgDomain] = useState<string | null | undefined>(undefined)

  const loadProfile = useCallback(async () => {
    if (!user?.id) return
    const info = await getProfile(user.id)
    setOrgDomain(info.orgDomain)
  }, [user?.id])

  useEffect(() => {
    if (user?.id) loadProfile()
  }, [user?.id, loadProfile])

  const university = orgDomain === undefined ? '—' : getUniversityFromDomain(orgDomain)

  async function handleSignOut() { await signOut(); router.push('/') }

  return (
    <AppShell>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '2px', letterSpacing: '-0.02em' }}>Settings</h1>
            <p style={{ color: '#52525b', fontSize: '12px' }}>Manage your account and notifications</p>
          </div>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px', background: 'transparent', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '4px', color: '#f87171', fontSize: '13px', fontWeight: 500, cursor: 'pointer', flexShrink: 0 }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(248,113,113,0.07)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>

        <ProfileCard email={user?.email} university={university} />

        <h2 style={sectionHeadingStyle}>Custom Notifications</h2>
        <p style={sectionSubStyle}>Choose how you want to receive job alerts and updates</p>

        <NotificationsCard email={user?.email} />
      </div>
    </AppShell>
  )
}