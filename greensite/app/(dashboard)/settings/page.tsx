'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/layout/AppShell'
import {
  getProfile,
  getPreferences,
  upsertPreference,
  deletePreference,
  removeResume,
  getAccessToken,
} from '@/lib/services/profile'
import {
  emptyPref,
  Preference,
  PreferenceId,
  sectionHeadingStyle,
  sectionSubStyle,
  getUniversityFromDomain,
} from '../../../lib/types/settings'
import {
  PreferenceCard,
  ProfileCard,
  ResumeCard,
  NotificationsCard,
} from './components'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [orgDomain, setOrgDomain] = useState<string | null | undefined>(undefined)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [pref1, setPref1] = useState<Preference>({ ...emptyPref })
  const [pref2, setPref2] = useState<Preference>({ ...emptyPref })
  const [editingPref, setEditingPref] = useState<null | PreferenceId>(null)
  const [editDraft, setEditDraft] = useState<Preference>({ ...emptyPref })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [michiganCities, setMichiganCities] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/cities')
      .then(r => r.json())
      .then(data => setMichiganCities(data.cities ?? []))
      .catch(() => {})
  }, [])

  const loadResumeStatus = useCallback(async () => {
    if (!user?.id) return
    const info = await getProfile(user.id)
    setResumeUploaded(info.resumeUploaded)
    setOrgDomain(info.orgDomain)
  }, [user?.id])

  const loadPreferences = useCallback(async () => {
    if (!user?.id) return
    const result = await getPreferences(user.id)
    setPref1(result[1])
    setPref2(result[2])
  }, [user?.id])

  useEffect(() => {
    if (user?.id) { loadResumeStatus(); loadPreferences() }
  }, [user?.id, loadResumeStatus, loadPreferences])

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return
    setUploading(true)
    try {
      const token = await getAccessToken()
      if (!token) { console.error('No active session'); return }
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('userId', user.id)
      await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      })
      await loadResumeStatus()
    } catch (err) { console.error('Upload error:', err) }
    finally { setUploading(false) }
  }

  const handleRemoveResume = async () => {
    if (!user?.id) return
    setRemoving(true)
    try {
      await removeResume(user.id)
      setResumeUploaded(false)
    } catch (err) { console.error('Remove error:', err) }
    finally { setRemoving(false) }
  }

  const startEdit = (id: PreferenceId) => {
    setEditDraft({ ...(id === 1 ? pref1 : pref2) })
    setEditingPref(id)
    setSaveMsg('')
  }

  const cancelEdit = () => { setEditingPref(null); setSaveMsg('') }

  const savePreference = async (id: PreferenceId) => {
    if (!user?.id) return
    setSaving(true); setSaveMsg('')
    try {
      await upsertPreference(user.id, id, editDraft)
      if (id === 1) setPref1({ ...editDraft })
      else setPref2({ ...editDraft })
      setSaveMsg('Saved!')
      setTimeout(() => { setEditingPref(null); setSaveMsg('') }, 1000)
    } catch (err) {
      console.error('Save error:', err)
      setSaveMsg('Failed to save')
    } finally { setSaving(false) }
  }

  const removePref = async (id: PreferenceId) => {
    if (!user?.id) return
    await deletePreference(user.id, id)
    if (id === 1) setPref1({ ...emptyPref })
    else setPref2({ ...emptyPref })
    if (editingPref === id) setEditingPref(null)
  }

  const university = orgDomain === undefined ? '—' : getUniversityFromDomain(orgDomain)

  async function handleSignOut() { await signOut(); router.push('/') }

  const saveDisabledReason = editDraft.jobTypes.length === 0
    ? 'Select a job type'
    : editDraft.jobCategories.length === 0
      ? 'Select at least one category'
      : null

  const prefItems = [
    { id: 1 as const, pref: pref1, label: 'Job Preference #1', sub: 'Set up your first job search criteria' },
    { id: 2 as const, pref: pref2, label: 'Job Preference #2', sub: 'Set up your second job search criteria' },
  ]

  return (
    <AppShell>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '2px', letterSpacing: '-0.02em' }}>Settings</h1>
            <p style={{ color: '#52525b', fontSize: '12px' }}>Manage your account, resume, and job preferences</p>
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

        <h2 style={sectionHeadingStyle}>Custom Job Matching</h2>
        <p style={sectionSubStyle}>Upload your resume, set your preferences, and find your perfect job matches</p>

        <ResumeCard
          resumeUploaded={resumeUploaded}
          uploading={uploading}
          removing={removing}
          onFileChange={handleResumeUpload}
          onRemove={handleRemoveResume}
        />

        {prefItems.map(({ id, pref, label, sub }) => {
          const isEditing = editingPref === id
          return (
            <PreferenceCard
              key={id}
              pref={pref}
              draft={editDraft}
              isEditing={isEditing}
              saving={saving}
              saveMsg={saveMsg}
              saveDisabledReason={saveDisabledReason}
              label={label}
              sub={sub}
              michiganCities={michiganCities}
              onEdit={() => startEdit(id)}
              onRemove={() => removePref(id)}
              onSave={() => savePreference(id)}
              onCancel={cancelEdit}
              onDraftChange={setEditDraft}
            />
          )
        })}

        <h2 style={sectionHeadingStyle}>Custom Notifications</h2>
        <p style={sectionSubStyle}>Choose how you want to receive job alerts and updates</p>

        <NotificationsCard email={user?.email} />
      </div>
    </AppShell>
  )
}