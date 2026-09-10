'use client'

import { useCallback, useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useAuth } from '@/contexts/AuthContext'
import { fetchFieldSubCategoryMap } from '@/lib/api/jobsApi'
import { getRecentMatchRows } from '@/lib/services/matches'
import { fetchJobsByIds } from '@/lib/services/jobs'
import { countSavedJobs } from '@/lib/services/savedJobs'
import { MatchedJob, StatCardData, errorMessage, mergeMatchedJobs } from '@/lib/types/matches'
import {
  ErrorBanner,
  MatchedJobsPanel,
  PageHeader,
  ResumeSettingsBanner,
  StatsRow,
} from './components'

export default function ResumeJobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<MatchedJob[]>([])
  const [totalMatchCount, setTotalMatchCount] = useState(0)
  const [newThisWeekCount, setNewThisWeekCount] = useState(0)
  const [savedCount, setSavedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fieldSubCategoryMap, setFieldSubCategoryMap] = useState<Record<number, string>>({})

  const loadMatches = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    try {
      const [rows, savedCount, subCatMap] = await Promise.all([
        getRecentMatchRows(user.id),
        countSavedJobs(user.id),
        fetchFieldSubCategoryMap(),
      ])
      setFieldSubCategoryMap(subCatMap)

      const weekAgoMs = Date.now() - 7 * 86400000
      setTotalMatchCount(rows.length)
      setNewThisWeekCount(rows.filter(row => new Date(row.created_at).getTime() >= weekAgoMs).length)
      setSavedCount(savedCount)

      const jobRows = await fetchJobsByIds(rows.map(row => row.job_id))
      setJobs(mergeMatchedJobs(rows, jobRows))
    } catch (err) {
      console.error('Error loading matches:', err)
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) loadMatches()
  }, [user?.id, loadMatches])

  const statCards: StatCardData[] = [
    { label: 'Total Matches', value: loading ? '...' : totalMatchCount.toString(), color: '#4ade80' },
    { label: 'New This Week', value: loading ? '...' : newThisWeekCount.toString(), color: '#93c5fd' },
    { label: 'Saved Jobs', value: loading ? '...' : savedCount.toString(), color: '#fb923c' },
  ]

  return (
    <AppShell>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <PageHeader />
        <ResumeSettingsBanner />
        {error && <ErrorBanner message={error} onRetry={loadMatches} />}
        <StatsRow stats={statCards} />
        <MatchedJobsPanel jobs={jobs} loading={loading} fieldSubCategoryMap={fieldSubCategoryMap} />
      </div>
    </AppShell>
  )
}