import { Preference } from '@/lib/types/settings'
import { Job } from '@/lib/types/jobs'
import { MatchRow } from '@/lib/types/matches'
import { CustomPreference, ExperienceLevel, MatchedJob } from '@/lib/types/resume'


export function toCustomPreference(pref: Preference): CustomPreference {
  const experienceLevel: ExperienceLevel =
    pref.experienceLevel === 'moderate' ||
    pref.experienceLevel === 'advanced' ||
    pref.experienceLevel === 'any'
      ? pref.experienceLevel
      : 'any'
  return {
    jobTypes: pref.jobTypes,
    experienceLevel,
    location: pref.location,
    includeRemote: pref.includeRemote,
  }
}

export function mergeMatchedJobs(rows: MatchRow[], jobs: Job[]): MatchedJob[] {
  return rows
    .map(row => {
      const job = jobs.find(j => j.job_id === row.job_id)
      if (!job) return null
      return { ...job, matched_at: row.created_at }
    })
    .filter((x): x is MatchedJob => x !== null)
}

export function displayLocation(loc: string): string {
  const cities = loc.split(',').filter(Boolean)
  if (cities.length === 0) return 'All Michigan'
  if (cities.length === 1) return cities[0]
  return `${cities.length} cities selected`
}

export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'An unexpected error occurred'
}
