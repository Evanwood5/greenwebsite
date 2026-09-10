import { Preference, PreferenceId } from '@/lib/types/settings'
import { Job } from '@/lib/types/jobs'
import { MatchRow, MATCH_EXPIRY_DAYS } from '@/lib/services/matches'

export { MATCH_EXPIRY_DAYS }

export type ExperienceLevel = 'moderate' | 'advanced' | 'any'
export type View = 'main' | 'preference1' | 'preference2'

export interface CustomPreference {
  jobTypes: string[]
  experienceLevel: ExperienceLevel
  location: string
  includeRemote: boolean
}

export const EMPTY_PREFERENCE: CustomPreference = {
  jobTypes: [],
  experienceLevel: 'any',
  location: '',
  includeRemote: true,
}

export interface SaveStatus {
  type: 'success' | 'error'
  message: string
}

export type MatchedJob = Job & { matched_at: string }

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

export type { MatchRow, PreferenceId }