'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'

interface Preference {
  jobTypes: string[]
  location: string
  experienceLevel: string
  includeRemote: boolean
}

function CheckCircleIcon({ color = '#22c55e' }: { color?: string }) {
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
  if (!loc) return 'Not set'
  const parts = loc.split(',').filter(Boolean)
  if (parts.includes('MI:all')) return 'All Michigan'
  if (parts.length === 1) return parts[0].replace('MI:', '')
  return `${parts.length} cities`
}

const cardStyle: React.CSSProperties = {
  background: '#1e1e1e',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid #2a2a2a',
  marginBottom: '12px',
}

const sectionHeadingStyle: React.CSSProperties = {
  color: 'white',
  fontSize: '18px',
  fontWeight: 700,
  marginBottom: '4px',
  marginTop: '32px',
}

const sectionSubStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '13px',
  marginBottom: '16px',
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [pref1, setPref1] = useState<Preference>({ jobTypes: [], location: '', experienceLevel: 'any', includeRemote: true })
  const [pref2, setPref2] = useState<Preference>({ jobTypes: [], location: '', experienceLevel: 'any', includeRemote: true })
  const [notifStatus, setNotifStatus] = useState<'idle' | 'saved'>('idle')

  useEffect(() => {
    if (user?.id) {
      loadResumeStatus()
      loadPreferences()
    }
  }, [user?.id])

  const loadResumeStatus = async () => {
    if (!user?.id) return
    const { data } = await supabase.from('profiles').select('resume').eq('user_id', user.id).single()
    setResumeUploaded(!!(data?.resume))
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
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('userId', user.id)
      await fetch('/api/resume/upload', { method: 'POST', body: formData })
      await loadResumeStatus()
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveResume = async () => {
    if (!user?.id) return
    setRemoving(true)
    try {
      await supabase.from('profiles').update({ resume: null }).eq('user_id', user.id)
      setResumeUploaded(false)
    } catch (err) {
      console.error('Remove error:', err)
    } finally {
      setRemoving(false)
    }
  }

  const removePref = async (id: 1 | 2) => {
    if (!user?.id) return
    await supabase.from('user_job_preferences').delete().eq('user_id', user.id).eq('preference_id', id)
    const empty: Preference = { jobTypes: [], location: '', experienceLevel: 'any', includeRemote: true }
    if (id === 1) setPref1(empty)
    else setPref2(empty)
  }

  const university = user?.email?.includes('umich') ? 'University of Michigan'
    : user?.email?.includes('msu') ? 'Michigan State University'
    : user?.email?.includes('wayne') ? 'Wayne State University'
    : 'Michigan University'

  return (
    <AppShell>
      <div style={{ maxWidth: '760px' }}>
        <div style={{ marginBottom: '8px' }}>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Settings</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Manage your account, resume, and job preferences</p>
        </div>

        {/* Profile Information */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span style={{ color: 'white', fontSize: '15px', fontWeight: 600 }}>Profile Information</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Email</p>
              <p style={{ color: 'white', fontSize: '14px' }}>{user?.email || 'Not signed in'}</p>
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>University</p>
              <p style={{ color: 'white', fontSize: '14px' }}>{university}</p>
            </div>
          </div>
        </div>

        {/* Custom Job Matching */}
        <h2 style={sectionHeadingStyle}>Custom Job Matching</h2>
        <p style={sectionSubStyle}>Upload your resume, set your preferences, and find your perfect job matches</p>

        {/* Resume upload */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <UploadIcon />
            <span style={{ color: 'white', fontSize: '15px', fontWeight: 600 }}>Upload Your Resume</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '14px' }}>
            Upload your resume to get personalized job matches
          </p>

          {resumeUploaded && (
            <div style={{ background: '#14532d', border: '1px solid #166534', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircleIcon />
              </div>
              <div>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>Resume uploaded</p>
                <p style={{ color: '#86efac', fontSize: '13px' }}>Your resume has been processed and saved</p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
            {['We\'ll anonymize your personal data', 'Only PDF files accepted', 'Maximum 2MB, 2 pages'].map((text) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleIcon />
                <span style={{ color: '#9ca3af', fontSize: '13px' }}>{text}</span>
              </div>
            ))}
          </div>

          <input type="file" accept=".pdf" id="resume-file" style={{ display: 'none' }} onChange={handleResumeUpload} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => document.getElementById('resume-file')?.click()}
              disabled={uploading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}
            >
              <UploadIcon />
              {uploading ? 'Uploading...' : resumeUploaded ? 'Update Resume' : 'Upload Resume'}
            </button>
            {resumeUploaded && (
              <button
                onClick={handleRemoveResume}
                disabled={removing}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: removing ? 'not-allowed' : 'pointer', opacity: removing ? 0.7 : 1 }}
              >
                <TrashIcon />
                {removing ? 'Removing...' : 'Remove Resume'}
              </button>
            )}
          </div>
        </div>

        {/* Preferences */}
        {([{ id: 1, pref: pref1, label: 'Job Preference #1', sub: 'Set up your first job search criteria' }, { id: 2, pref: pref2, label: 'Job Preference #2', sub: 'Set up your second job search criteria' }] as const).map(({ id, pref, label, sub }) => (
          <div key={id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #ec4899, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="4"/>
                  </svg>
                </div>
                <div>
                  <p style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>{label}</p>
                  <p style={{ color: '#6b7280', fontSize: '12px' }}>{sub}</p>
                </div>
              </div>
              {pref.jobTypes.length > 0 && (
                <button
                  onClick={() => removePref(id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#7f1d1d', color: '#fca5a5', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  <TrashIcon />
                  Delete
                </button>
              )}
            </div>

            {pref.jobTypes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleIcon />
                  <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: 500 }}>Job Types:</span>
                  <span style={{ color: '#d1d5db', fontSize: '13px' }}>{pref.jobTypes.join(', ')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span style={{ color: '#ec4899', fontSize: '13px', fontWeight: 500 }}>Location:</span>
                  <span style={{ color: '#d1d5db', fontSize: '13px' }}>{displayLocation(pref.location)}</span>
                </div>
                {pref.experienceLevel && pref.experienceLevel !== 'any' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2"/>
                      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                    </svg>
                    <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 500 }}>Experience:</span>
                    <span style={{ color: '#d1d5db', fontSize: '13px', textTransform: 'capitalize' }}>{pref.experienceLevel}</span>
                  </div>
                )}
                {pref.includeRemote && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                    </svg>
                    <span style={{ color: '#60a5fa', fontSize: '13px' }}>Remote jobs included</span>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: '#6b7280', fontSize: '13px' }}>Not configured yet. Go to Custom Jobs to set preferences.</p>
            )}
          </div>
        ))}

        {/* Notifications */}
        <h2 style={sectionHeadingStyle}>Custom Notifications</h2>
        <p style={sectionSubStyle}>Choose how you want to receive job alerts and updates</p>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span style={{ color: 'white', fontSize: '15px', fontWeight: 600 }}>Notification Preferences</span>
          </div>

          {/* Email */}
          <div style={{ background: '#141414', borderRadius: '10px', padding: '14px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>Email Notifications</p>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>Receive job alerts via email at {user?.email}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                  <CheckCircleIcon />
                  <span style={{ color: '#22c55e', fontSize: '12px' }}>Active</span>
                </div>
              </div>
            </div>
            <span style={{ padding: '4px 12px', background: '#22c55e', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>Enabled</span>
          </div>

          {/* Phone */}
          <div style={{ background: '#141414', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.13 1.19 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-.45a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>Phone Notifications</p>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>Receive SMS alerts</p>
              </div>
            </div>
            <button style={{ padding: '4px 12px', background: 'transparent', color: 'white', border: '1px solid #444', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
              Enable
            </button>
          </div>
        </div>

        {/* Notification template */}
        <div style={{ background: '#1a2332', border: '1px solid #1d4ed8', borderRadius: '12px', padding: '18px', marginBottom: '12px' }}>
          <p style={{ color: '#60a5fa', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Notification Template</p>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '10px' }}>
            When a new job matching your preferences is found, you&apos;ll receive:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['Job title, company name, and location', 'Match percentage based on your resume', 'Direct link to view full job details', 'Application deadline (if available)'].map((item) => (
              <li key={item} style={{ color: '#9ca3af', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#60a5fa' }}>·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => { setNotifStatus('saved'); setTimeout(() => setNotifStatus('idle'), 2000) }}
          style={{ padding: '10px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', marginBottom: '32px' }}
        >
          {notifStatus === 'saved' ? 'Saved!' : 'Save Notification Settings'}
        </button>
      </div>
    </AppShell>
  )
}
