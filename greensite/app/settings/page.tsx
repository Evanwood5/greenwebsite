'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'

const JOB_FIELDS: Record<string, string[]> = {
  Tech: [
    'Software Engineering', 'Data Science / AI', 'IT / Sysadmin',
    'Cybersecurity', 'Cloud / DevOps', 'QA / Testing', 'UI / UX', 'Hardware / Embedded',
  ],
  Engineering: [
    'Mechanical', 'Electrical', 'Civil / Structural', 'Chemical', 'Industrial',
    'Aerospace', 'Materials', 'Environmental', 'Automotive', 'Manufacturing', 'Trades',
  ],
  Business: [
    'Finance / Accounting', 'Banking / Finance', 'Marketing / Sales',
    'Operations / Logistics', 'HR / Recruiting', 'Business Analytics',
    'Consulting / Strategy', 'Project Management',
  ],
  Health: [
    'Clinical / Nursing', 'Allied Health', 'Pharmacy', 'Healthcare Administration',
    'Research / Lab', 'Public Health', 'Medical Technology',
  ],
}

interface Preference {
  jobTypes: string[]
  location: string
  experienceLevel: string
  includeRemote: boolean
  jobCategories: string[]
  jobSubcategories: string[]
}

function CheckCircleIcon({ color = '#52525b' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6"/>
      <path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  )
}

function displayLocation(loc: string) {
  const parts = loc.split(',').filter(Boolean)
  if (parts.length === 0) return 'All Michigan'
  if (parts.length === 1) return parts[0]
  return `${parts.length} cities`
}

const emptyPref: Preference = {
  jobTypes: [], location: '', experienceLevel: 'any',
  includeRemote: true, jobCategories: [], jobSubcategories: [],
}

const cardStyle: React.CSSProperties = {
  background: '#1e1e1e',
  borderRadius: '4px',
  padding: '16px',
  border: '1px solid rgba(255,255,255,0.06)',
  marginBottom: '10px',
}

const sectionHeadingStyle: React.CSSProperties = {
  color: '#e4e4e7', fontSize: '13px', fontWeight: 600,
  marginBottom: '2px', marginTop: '22px', letterSpacing: '-0.01em',
}

const sectionSubStyle: React.CSSProperties = {
  color: '#52525b', fontSize: '11px', marginBottom: '10px',
}

const CATEGORY_COLORS: Record<string, string> = {
  Tech: '#60a5fa',
  Engineering: '#f97316',
  Business: '#a78bfa',
  Health: '#f43f5e',
}

function PrefEditor({ pref, onChange }: { pref: Preference; onChange: (p: Preference) => void }) {
  const jobTypeOptions = ['full-time', 'internship', 'part-time']
  const selectedCities = pref.location ? pref.location.split(',').filter(Boolean) : []
  const [michiganCities, setMichiganCities] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/cities')
      .then(r => r.json())
      .then(data => setMichiganCities(data.cities ?? []))
      .catch(() => {})
  }, [])

  function toggleJobType(type: string) {
    if (pref.jobTypes.includes(type)) {
      onChange({ ...pref, jobTypes: pref.jobTypes.filter(t => t !== type) })
    } else {
      if (pref.jobTypes.length >= 2) { alert('You can select up to 2 job types'); return }
      onChange({ ...pref, jobTypes: [...pref.jobTypes, type] })
    }
  }

  function toggleCategory(cat: string) {
    if (pref.jobCategories.includes(cat)) {
      const subsToRemove = JOB_FIELDS[cat] ?? []
      onChange({
        ...pref,
        jobCategories: pref.jobCategories.filter(c => c !== cat),
        jobSubcategories: pref.jobSubcategories.filter(s => !subsToRemove.includes(s)),
      })
    } else {
      onChange({ ...pref, jobCategories: [...pref.jobCategories, cat] })
    }
  }

  function toggleSubcategory(sub: string) {
    if (pref.jobSubcategories.includes(sub)) {
      onChange({ ...pref, jobSubcategories: pref.jobSubcategories.filter(s => s !== sub) })
    } else {
      onChange({ ...pref, jobSubcategories: [...pref.jobSubcategories, sub] })
    }
  }

  function toggleCity(cityValue: string) {
    let next: string[]
    if (cityValue === '') {
      next = []
    } else if (selectedCities.includes(cityValue)) {
      next = selectedCities.filter(c => c !== cityValue)
    } else {
      next = [...selectedCities, cityValue]
    }
    onChange({ ...pref, location: next.join(',') })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '4px' }}>

      {/* Job Types */}
      <div>
        <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#52525b', marginBottom: '10px' }}>
          Job Type (select up to 2)
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {jobTypeOptions.map(type => {
            const selected = pref.jobTypes.includes(type)
            return (
              <button key={type} type="button" onClick={() => toggleJobType(type)} style={{
                padding: '8px 16px', borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: selected ? 'rgba(255,255,255,0.08)' : '#141414',
                color: selected ? '#e4e4e7' : '#71717a',
                fontSize: '13px', fontWeight: selected ? 600 : 400,
                cursor: 'pointer', textTransform: 'capitalize',
              }}>
                {selected && '✓ '}{type}
              </button>
            )
          })}
        </div>
      </div>

      {/* Job Categories — required */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#52525b' }}>
            Job Categories
          </p>
          <span style={{
            fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px',
            background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)',
          }}>
            Required
          </span>
        </div>
        <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '10px' }}>
          Select at least one category — subcategories help focus your matches further
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {Object.keys(JOB_FIELDS).map(cat => {
            const selected = pref.jobCategories.includes(cat)
            return (
              <button key={cat} type="button" onClick={() => toggleCategory(cat)} style={{
                padding: '8px 16px', borderRadius: '4px',
                border: `1px solid ${selected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
                background: selected ? 'rgba(255,255,255,0.07)' : '#141414',
                color: selected ? '#e4e4e7' : '#71717a',
                fontSize: '13px', fontWeight: selected ? 600 : 400,
                cursor: 'pointer',
              }}>
                {selected && '✓ '}{cat}
              </button>
            )
          })}
        </div>

        {/* Subcategories */}
        {pref.jobCategories.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pref.jobCategories.map(cat => {
              return (
                <div key={cat}>
                  <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#52525b', marginBottom: '8px' }}>
                    {cat} — Sub-categories
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {JOB_FIELDS[cat].map(sub => {
                      const selected = pref.jobSubcategories.includes(sub)
                      return (
                        <button key={sub} type="button" onClick={() => toggleSubcategory(sub)} style={{
                          padding: '5px 12px', borderRadius: '4px',
                          border: `1px solid ${selected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                          background: selected ? 'rgba(255,255,255,0.07)' : '#111',
                          color: selected ? '#e4e4e7' : '#71717a',
                          fontSize: '11px', fontWeight: selected ? 600 : 400,
                          cursor: 'pointer',
                        }}>
                          {selected && '✓ '}{sub}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            <p style={{ color: '#52525b', fontSize: '11px' }}>
              Leave subcategories unselected to match all within a category
            </p>
          </div>
        )}

        {/* Warning when no category selected */}
        {pref.jobCategories.length === 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 12px', borderRadius: '4px',
            background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ color: '#f87171', fontSize: '12px' }}>
              Select at least one category to save your preferences
            </p>
          </div>
        )}
      </div>

      {/* Experience Level */}
      {pref.jobTypes.includes('full-time') && (
        <div>
          <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#52525b', marginBottom: '10px' }}>
            Experience Level
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { value: 'moderate', label: 'Moderate (0–2 years)' },
              { value: 'advanced', label: 'Advanced (2+ years)' },
              { value: 'any', label: 'Any level' },
            ].map(opt => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', background: '#141414', cursor: 'pointer' }}>
                <input
                  type="radio" name={`exp-${opt.value}`} value={opt.value}
                  checked={pref.experienceLevel === opt.value}
                  onChange={() => onChange({ ...pref, experienceLevel: opt.value })}
                  style={{ accentColor: '#e4e4e7', width: '15px', height: '15px' }}
                />
                <span style={{ color: '#e4e4e7', fontSize: '13px' }}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      <div>
        <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#52525b', marginBottom: '6px' }}>
          Location
        </p>
        <p style={{ color: '#52525b', fontSize: '12px', marginBottom: '8px' }}>Each city includes a 30-mile radius</p>
        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '12px', maxHeight: '220px', overflowY: 'auto' }}>
          <label style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 4px',
            borderRadius: '4px', cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '6px',
          }}>
            <input
              type="checkbox"
              checked={selectedCities.length === 0}
              onChange={() => toggleCity('')}
              style={{ accentColor: '#e4e4e7', width: '14px', height: '14px', flexShrink: 0 }}
            />
            <span style={{ fontSize: '13px', color: '#e4e4e7', fontWeight: 600 }}>All Michigan</span>
          </label>
          {michiganCities.map(city => (
            <label key={city} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 4px',
              borderRadius: '4px', cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={selectedCities.includes(city)}
                onChange={() => toggleCity(city)}
                style={{ accentColor: '#e4e4e7', width: '14px', height: '14px', flexShrink: 0 }}
              />
              <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 400 }}>{city}</span>
            </label>
          ))}
        </div>
        {selectedCities.length > 0 && (
          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '6px' }}>
            {`${selectedCities.length} ${selectedCities.length === 1 ? 'city' : 'cities'} selected`}
          </p>
        )}
      </div>

      {/* Remote */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', cursor: 'pointer' }}>
        <input
          type="checkbox" checked={pref.includeRemote}
          onChange={e => onChange({ ...pref, includeRemote: e.target.checked })}
          style={{ accentColor: '#e4e4e7', width: '16px', height: '16px', flexShrink: 0 }}
        />
        <div>
          <p style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500 }}>Include remote jobs</p>
          <p style={{ color: '#52525b', fontSize: '12px' }}>Get matched with remote opportunities</p>
        </div>
      </label>
    </div>
  )
}

function getUniversityFromDomain(domain: string | null | undefined): string {
  if (!domain) return 'None'
  if (domain.includes('msu.edu')) return 'Michigan State'
  if (domain.includes('umich.edu')) return 'University of Michigan'
  if (domain.includes('wayne.edu')) return 'Wayne State'
  return domain
}

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [orgDomain, setOrgDomain] = useState<string | null | undefined>(undefined)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [pref1, setPref1] = useState<Preference>({ ...emptyPref })
  const [pref2, setPref2] = useState<Preference>({ ...emptyPref })
  const [editingPref, setEditingPref] = useState<null | 1 | 2>(null)
  const [editDraft, setEditDraft] = useState<Preference>({ ...emptyPref })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [notifStatus, setNotifStatus] = useState<'idle' | 'saved'>('idle')

  useEffect(() => {
    if (user?.id) { loadResumeStatus(); loadPreferences() }
  }, [user?.id])

  const loadResumeStatus = async () => {
    if (!user?.id) return
    const { data } = await supabase.from('profiles').select('resume, org_id').eq('user_id', user.id).single()
    setResumeUploaded(!!(data?.resume))
    if (data?.org_id) {
      const { data: orgData } = await supabase.from('orgs').select('domain').eq('id', data.org_id).single()
      setOrgDomain(orgData?.domain ?? null)
    } else {
      setOrgDomain(null)
    }
  }

  const loadPreferences = async () => {
    if (!user?.id) return
    const { data } = await supabase.from('user_job_preferences').select('*').eq('user_id', user.id).in('preference_id', [1, 2])
    data?.forEach((p: any) => {
      const pref: Preference = {
        jobTypes: p.job_types || [],
        location: (p.locations || []).join(','),
        experienceLevel: p.experience_level || 'any',
        includeRemote: p.include_remote || false,
        jobCategories: p.job_categories || [],
        jobSubcategories: p.job_subcategories || [],
      }
      if (p.preference_id === 1) setPref1(pref)
      if (p.preference_id === 2) setPref2(pref)
    })
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return
    setUploading(true)
    try {
      // Get the current session token to authenticate the upload request
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { console.error('No active session'); return }
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('userId', user.id)
      await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      await loadResumeStatus()
    } catch (err) { console.error('Upload error:', err) }
    finally { setUploading(false) }
  }

  const handleRemoveResume = async () => {
    if (!user?.id) return
    setRemoving(true)
    try {
      await supabase.from('profiles').update({ resume: null }).eq('user_id', user.id)
      setResumeUploaded(false)
    } catch (err) { console.error('Remove error:', err) }
    finally { setRemoving(false) }
  }

  const startEdit = (id: 1 | 2) => {
    setEditDraft({ ...(id === 1 ? pref1 : pref2) })
    setEditingPref(id)
    setSaveMsg('')
  }

  const cancelEdit = () => { setEditingPref(null); setSaveMsg('') }

  const savePreference = async (id: 1 | 2) => {
    if (!user?.id) return
    setSaving(true); setSaveMsg('')
    try {
      const locationsArray = editDraft.location.split(',').map(l => l.trim()).filter(Boolean)
      const { error } = await supabase.from('user_job_preferences').upsert({
        user_id: user.id,
        preference_id: id,
        job_types: editDraft.jobTypes,
        max_distance_miles: 30,
        include_remote: editDraft.includeRemote,
        locations: locationsArray,
        experience_level: editDraft.jobTypes.includes('full-time') ? editDraft.experienceLevel : null,
        job_categories: editDraft.jobCategories,
        job_subcategories: editDraft.jobSubcategories,
      }, { onConflict: 'user_id,preference_id' })

      if (error) throw error
      if (id === 1) setPref1({ ...editDraft })
      else setPref2({ ...editDraft })
      setSaveMsg('Saved!')
      setTimeout(() => { setEditingPref(null); setSaveMsg('') }, 1000)
    } catch (err) {
      console.error('Save error:', err)
      setSaveMsg('Failed to save')
    } finally { setSaving(false) }
  }

  const removePref = async (id: 1 | 2) => {
    if (!user?.id) return
    await supabase.from('user_job_preferences').delete().eq('user_id', user.id).eq('preference_id', id)
    if (id === 1) setPref1({ ...emptyPref })
    else setPref2({ ...emptyPref })
    if (editingPref === id) setEditingPref(null)
  }

  const university = orgDomain === undefined ? '—' : getUniversityFromDomain(orgDomain)

  async function handleSignOut() { await signOut(); router.push('/') }

  // Save is disabled if: no job type, no category, or currently saving
  const isSaveDisabled = saving
    || editDraft.jobTypes.length === 0
    || editDraft.jobCategories.length === 0

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

        {/* Profile */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 600 }}>Profile Information</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <p style={{ color: '#52525b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Email</p>
              <p style={{ color: '#e4e4e7', fontSize: '12px' }}>{user?.email || 'Not signed in'}</p>
            </div>
            <div>
              <p style={{ color: '#52525b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>University</p>
              <p style={{ color: '#e4e4e7', fontSize: '12px' }}>{university}</p>
            </div>
          </div>
        </div>

        <h2 style={sectionHeadingStyle}>Custom Job Matching</h2>
        <p style={sectionSubStyle}>Upload your resume, set your preferences, and find your perfect job matches</p>

        {/* Resume */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <UploadIcon />
            <span style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 600 }}>Upload Your Resume</span>
          </div>
          <p style={{ color: '#52525b', fontSize: '12px', marginBottom: '12px' }}>Upload your resume to get personalized job matches</p>
          {resumeUploaded && (
            <div style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: '4px', padding: '10px 14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircleIcon color="#4ade80" />
              </div>
              <div>
                <p style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 600 }}>Resume uploaded</p>
                <p style={{ color: '#52525b', fontSize: '11px' }}>Your resume has been processed and saved</p>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
            {["We'll anonymize your personal data", 'Only PDF files accepted', 'Maximum 2MB, 2 pages'].map((text) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleIcon color="#3f3f46" />
                <span style={{ color: '#71717a', fontSize: '13px' }}>{text}</span>
              </div>
            ))}
          </div>
          <input type="file" accept=".pdf" id="resume-file" style={{ display: 'none' }} onChange={handleResumeUpload} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button onClick={() => document.getElementById('resume-file')?.click()} disabled={uploading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(255,255,255,0.07)', color: '#e4e4e7', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', fontWeight: 600, fontSize: '13px', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
              <UploadIcon />{uploading ? 'Uploading...' : resumeUploaded ? 'Update Resume' : 'Upload Resume'}
            </button>
            {resumeUploaded && (
              <button onClick={handleRemoveResume} disabled={removing}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', fontWeight: 600, fontSize: '13px', cursor: removing ? 'not-allowed' : 'pointer', opacity: removing ? 0.7 : 1 }}>
                <TrashIcon />{removing ? 'Removing...' : 'Remove Resume'}
              </button>
            )}
          </div>
        </div>

        {/* Preferences */}
        {prefItems.map(({ id, pref, label, sub }) => {
          const isEditing = editingPref === id
          return (
            <div key={id} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isEditing ? '16px' : '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
                  </div>
                  <div>
                    <p style={{ color: '#e4e4e7', fontSize: '14px', fontWeight: 600 }}>{label}</p>
                    <p style={{ color: '#52525b', fontSize: '12px' }}>{sub}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!isEditing && (
                    <button onClick={() => startEdit(id)} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.07)', color: '#e4e4e7', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                      {pref.jobTypes.length > 0 ? 'Edit' : 'Set Up'}
                    </button>
                  )}
                  {pref.jobTypes.length > 0 && !isEditing && (
                    <button onClick={() => removePref(id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                      <TrashIcon />Delete
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <>
                  <PrefEditor pref={editDraft} onChange={setEditDraft} />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => savePreference(id)}
                      disabled={isSaveDisabled}
                      title={saveDisabledReason ?? ''}
                      style={{
                        padding: '9px 20px', background: isSaveDisabled ? 'transparent' : 'rgba(255,255,255,0.07)',
                        color: isSaveDisabled ? '#52525b' : '#e4e4e7',
                        border: isSaveDisabled ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,255,255,0.14)',
                        borderRadius: '4px', fontWeight: 600, fontSize: '13px',
                        cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={cancelEdit} disabled={saving}
                      style={{ padding: '9px 20px', background: 'transparent', color: '#71717a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                      Cancel
                    </button>
                    {/* Inline reason why save is disabled */}
                    {saveDisabledReason && !saving && (
                      <span style={{ color: '#f87171', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {saveDisabledReason}
                      </span>
                    )}
                    {saveMsg && <span style={{ color: saveMsg === 'Saved!' ? '#4ade80' : '#f87171', fontSize: '13px' }}>{saveMsg}</span>}
                  </div>
                </>
              ) : pref.jobTypes.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircleIcon />
                    <span style={{ color: '#52525b', fontSize: '13px', fontWeight: 500 }}>Job Types:</span>
                    <span style={{ color: '#e4e4e7', fontSize: '13px' }}>{pref.jobTypes.join(', ')}</span>
                  </div>
                  {pref.jobCategories.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      <div>
                        <span style={{ color: '#52525b', fontSize: '13px', fontWeight: 500 }}>Categories: </span>
                        <span style={{ color: '#e4e4e7', fontSize: '13px' }}>{pref.jobCategories.join(', ')}</span>
                        {pref.jobSubcategories.length > 0 && (
                          <div style={{ color: '#71717a', fontSize: '11px', marginTop: '2px' }}>
                            Sub-categories: {pref.jobSubcategories.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span style={{ color: '#52525b', fontSize: '13px', fontWeight: 500 }}>Location:</span>
                    <span style={{ color: '#e4e4e7', fontSize: '13px' }}>{displayLocation(pref.location)}</span>
                  </div>
                  {pref.experienceLevel && pref.experienceLevel !== 'any' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                      </svg>
                      <span style={{ color: '#52525b', fontSize: '13px', fontWeight: 500 }}>Experience:</span>
                      <span style={{ color: '#e4e4e7', fontSize: '13px', textTransform: 'capitalize' }}>{pref.experienceLevel}</span>
                    </div>
                  )}
                  {pref.includeRemote && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                      </svg>
                      <span style={{ color: '#a1a1aa', fontSize: '13px' }}>Remote jobs included</span>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '13px' }}>Not configured yet. Click Set Up to add your preferences.</p>
              )}
            </div>
          )
        })}

        {/* Notifications */}
        <h2 style={sectionHeadingStyle}>Custom Notifications</h2>
        <p style={sectionSubStyle}>Choose how you want to receive job alerts and updates</p>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 600 }}>Notification Preferences</span>
          </div>
          <div style={{ background: '#141414', borderRadius: '4px', padding: '12px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 500 }}>Email Notifications</p>
                <p style={{ color: '#52525b', fontSize: '11px' }}>Receive job alerts via email at {user?.email}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                  <CheckCircleIcon color="#52525b" /><span style={{ color: '#52525b', fontSize: '12px' }}>Active</span>
                </div>
              </div>
            </div>
            <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.07)', color: '#e4e4e7', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>Enabled</span>
          </div>
        </div>

        <button onClick={() => { setNotifStatus('saved'); setTimeout(() => setNotifStatus('idle'), 2000) }}
          style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.07)', color: '#e4e4e7', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', marginBottom: '32px' }}>
          {notifStatus === 'saved' ? 'Saved!' : 'Save Notification Settings'}
        </button>
      </div>
    </AppShell>
  )
}
