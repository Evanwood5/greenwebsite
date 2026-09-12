'use client'

import { useState, useEffect, useCallback } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useAuth } from '@/contexts/AuthContext'
import {
  getPreferences,
  getResumeStatus,
  removeResume,
  upsertPreference,
  deletePreference,
  getAccessToken,
} from '@/lib/services/profile'
import { getRecentMatchRows } from '@/lib/services/matches'
import { fetchJobsByIds } from '@/lib/services/jobs'
import {
  emptyPref,
  Preference,
  PreferenceId,
} from '@/lib/types/settings'
import { MatchedJob, mergeMatchedJobs } from '@/lib/types/matches'
import {
  PageHeader,
  ResumeCard,
  PreferenceCard,
  MatchedJobsPanel,
} from './components'

export default function ResumePage() {
  const { user } = useAuth()

  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)

  const [pref1, setPref1] = useState<Preference>({ ...emptyPref })
  const [pref2, setPref2] = useState<Preference>({ ...emptyPref })
  const [editingPref, setEditingPref] = useState<null | PreferenceId>(null)
  const [editDraft, setEditDraft] = useState<Preference>({ ...emptyPref })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([])
  const [loadingJobs, setLoadingJobs] = useState(false)

  const [michiganCities, setMichiganCities] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/cities')
      .then(r => r.json())
      .then(data => setMichiganCities(data.cities ?? []))
      .catch(() => {})
  }, [])

  const loadResumeStatus = useCallback(async () => {
    if (!user?.id) return
    const status = await getResumeStatus(user.id)
    setResumeUploaded(status.resumeUploaded)
  }, [user?.id])

  const loadPreferences = useCallback(async () => {
    if (!user?.id) return
    const result = await getPreferences(user.id)
    setPref1(result[1])
    setPref2(result[2])
  }, [user?.id])

  const loadMatchedJobs = useCallback(async () => {
    if (!user?.id) return
    setLoadingJobs(true)
    try {
      const rows = await getRecentMatchRows(user.id)
      const jobs = await fetchJobsByIds(rows.map(r => r.job_id))
      setMatchedJobs(mergeMatchedJobs(rows, jobs))
    } catch (err) {
      console.error('Error loading matched jobs:', err)
    } finally {
      setLoadingJobs(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      loadResumeStatus()
      loadPreferences()
      loadMatchedJobs()
    }
  }, [user?.id, loadResumeStatus, loadPreferences, loadMatchedJobs])

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return
    setUploading(true)
    try {
      const token = await getAccessToken()
      if (!token) return
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('userId', user.id)
      await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      })
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
      await removeResume(user.id)
      setResumeUploaded(false)
    } catch (err) {
      console.error('Remove error:', err)
    } finally {
      setRemoving(false)
    }
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
      await loadMatchedJobs()
    } catch (err) {
      console.error('Save error:', err)
      setSaveMsg('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const removePref = async (id: PreferenceId) => {
    if (!user?.id) return
    await deletePreference(user.id, id)
    if (id === 1) setPref1({ ...emptyPref })
    else setPref2({ ...emptyPref })
    if (editingPref === id) setEditingPref(null)
  }

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
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <PageHeader />

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '14px', alignItems: 'start' }}>

          {/* Left — resume upload + preferences */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <ResumeCard
              resumeUploaded={resumeUploaded}
              uploading={uploading}
              removing={removing}
              onFileChange={handleResumeUpload}
              onRemove={handleRemoveResume}
            />

            {prefItems.map(({ id, pref, label, sub }) => (
              <PreferenceCard
                key={id}
                pref={pref}
                draft={editDraft}
                isEditing={editingPref === id}
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
            ))}
          </div>

          {/* Right — matched jobs */}
          <MatchedJobsPanel
            jobs={matchedJobs}
            loading={loadingJobs}
            resumeUploaded={resumeUploaded}
          />

        </div>
      </div>
    </AppShell>
  )
}
