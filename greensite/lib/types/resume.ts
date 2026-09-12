import { PreferenceId } from '@/lib/types/settings'
import { Job } from '@/lib/types/jobs'
import { MatchRow} from '@/lib/types/matches'
import { MATCH_EXPIRY_DAYS } from '@/lib/types/matches'

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

export type { MatchRow, PreferenceId }