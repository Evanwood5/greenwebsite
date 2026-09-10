export { MATCH_EXPIRY_DAYS } from './custom_jobs'
export type { MatchedJob } from './custom_jobs'
export { mergeMatchedJobs, errorMessage } from './custom_jobs'

export interface StatCardData {
  label: string
  value: string
  color: string
}