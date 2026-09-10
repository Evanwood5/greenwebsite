'use client'

import { useCallback, useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useAuth } from '@/contexts/AuthContext'
import { fetchJobsByIds } from '@/lib/services/jobs'
import { getRecentMatchRows } from '@/lib/services/matches'
import {
  deletePreference,
  getPreferences,
  getResumeStatus,
  removeResume,
  upsertCustomPreference,
} from '@/lib/services/profile'
import {
  CustomPreference,
  EMPTY_PREFERENCE,
  MatchedJob,
  PreferenceId,
  SaveStatus,
  View,
  errorMessage,
  mergeMatchedJobs,
  toCustomPreference,
} from '@/lib/types/custom_jobs'
import {
  LoadingGate,
  MatchedJobsPanel,
  MessageBanner,
  PageHeader,
  PreferenceCard,
  PreferenceEditor,
  ResumePanel,
  SignInCard,
} from './components'

export default function CustomJobsPage() {
  const { user, loading: authLoading } = useAuth()

  const [view, setView] = useState<View>('main')
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus | null>(null)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [preferences, setPreferences] = useState<Record<PreferenceId, CustomPreference>>({
    1: { ...EMPTY_PREFERENCE },
    2: { ...EMPTY_PREFERENCE },
  })
  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([])
  const [loadingJobs, setLoadingJobs] = useState(false)

  const loadUserPreferences = useCallback(async () => {
    if (!user?.id) return
    try {
      const prefs = await getPreferences(user.id)
      setPreferences({
        1: toCustomPreference(prefs[1]),
        2: toCustomPreference(prefs[2]),
      })
    } catch (err) {
      console.error('Error loading preferences:', err)
    }
  }, [user?.id])

  const loadResumeStatus = useCallback(async () => {
    if (!user?.id) return
    try {
      const status = await getResumeStatus(user.id)
      setResumeUploaded(status.resumeUploaded)
      setResumeUrl(status.resumeUrl)
    } catch (err) {
      console.error('Error loading resume status:', err)
    }
  }, [user?.id])

  const loadMatchedJobs = useCallback(async () => {
    if (!user?.id) return
    setLoadingJobs(true)
    try {
      const rows = await getRecentMatchRows(user.id)
      const jobs = await fetchJobsByIds(rows.map(row => row.job_id))
      setMatchedJobs(mergeMatchedJobs(rows, jobs))
    } catch (err) {
      console.error('Error loading matched jobs:', err)
    } finally {
      setLoadingJobs(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      loadUserPreferences()
      loadResumeStatus()
      loadMatchedJobs()
    }
  }, [user?.id, loadUserPreferences, loadResumeStatus, loadMatchedJobs])

  const handleResumeUploaded = (uploaded: boolean) => {
    setResumeUploaded(uploaded)
    loadResumeStatus()
  }

  const handleUpdateResume = () => {
    document.getElementById('resume-upload-update')?.click()
  }

  const handleRemoveResume = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      await removeResume(user.id)
      setResumeUploaded(false)
      setResumeUrl(null)
      setSaveStatus({ type: 'success', message: 'Resume removed successfully!' })
      window.setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      setSaveStatus({ type: 'error', message: errorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = useCallback((id: PreferenceId, field: string, value: unknown) => {
    setPreferences(prev => {
      const current = prev[id]
      if (field === 'jobTypes') {
        const jobTypes = value as string[]
        return { ...prev, [id]: { ...current, jobTypes, experienceLevel: jobTypes.includes('full-time') ? current.experienceLevel : 'any' } }
      }
      if (field === 'experienceLevel') return { ...prev, [id]: { ...current, experienceLevel: value as CustomPreference['experienceLevel'] } }
      if (field === 'location') return { ...prev, [id]: { ...current, location: value as string } }
      if (field === 'includeRemote') return { ...prev, [id]: { ...current, includeRemote: Boolean(value) } }
      return prev
    })
  }, [])

  const handleSave = async (id: PreferenceId) => {
    if (!user?.id) return
    setLoading(true)
    setSaveStatus(null)
    try {
      await upsertCustomPreference(user.id, id, preferences[id])
      setSaveStatus({ type: 'success', message: `Preference #${id} saved!` })
      window.setTimeout(() => { setSaveStatus(null); setView('main') }, 1000)
      await Promise.all([loadUserPreferences(), loadResumeStatus(), loadMatchedJobs()])
    } catch (err) {
      setSaveStatus({ type: 'error', message: errorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: PreferenceId) => {
    if (!user?.id) return
    setLoading(true)
    setSaveStatus(null)
    try {
      await deletePreference(user.id, id)
      setPreferences(prev => ({ ...prev, [id]: { ...EMPTY_PREFERENCE } }))
      setSaveStatus({ type: 'success', message: `Preference #${id} removed!` })
      window.setTimeout(() => { setSaveStatus(null); setView('main') }, 1000)
    } catch (err) {
      setSaveStatus({ type: 'error', message: errorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return <LoadingGate />
  if (!user) return <SignInCard />

  if (view !== 'main') {
    const id: PreferenceId = view === 'preference1' ? 1 : 2
    return (
      <AppShell>
        <PreferenceEditor
          id={id}
          pref={preferences[id]}
          loading={loading}
          saveStatus={saveStatus}
          onUpdate={(field, value) => handleUpdate(id, field, value)}
          onBack={() => setView('main')}
          onCancel={() => setView('main')}
          onSave={() => handleSave(id)}
          onDelete={() => handleDelete(id)}
        />
      </AppShell>
    )
  }

  const hasPreferences = preferences[1].jobTypes.length > 0 || preferences[2].jobTypes.length > 0

  return (
    <AppShell>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <PageHeader
          title="Custom Job Matching"
          subtitle="Upload your resume and set preferences to get personalized job matches"
        />

        {saveStatus && <MessageBanner status={saveStatus} />}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <ResumePanel
            userId={user.id}
            existingResumeUrl={resumeUrl}
            resumeUploaded={resumeUploaded}
            loading={loading}
            onResumeUploaded={handleResumeUploaded}
            onUpdateResume={handleUpdateResume}
            onRemoveResume={handleRemoveResume}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {([1, 2] as const).map(id => (
              <PreferenceCard
                key={id}
                id={id}
                pref={preferences[id]}
                loading={loading}
                onOpen={() => setView(id === 1 ? 'preference1' : 'preference2')}
                onDelete={() => handleDelete(id)}
              />
            ))}
          </div>
        </div>

        <MatchedJobsPanel
          jobs={matchedJobs}
          loadingJobs={loadingJobs}
          resumeUploaded={resumeUploaded}
          hasPreferences={hasPreferences}
          onRefresh={loadMatchedJobs}
        />
      </div>
    </AppShell>
  )
}