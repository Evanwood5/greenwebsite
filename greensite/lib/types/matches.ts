export type { MatchedJob } from './custom_jobs'
export { mergeMatchedJobs, errorMessage } from './custom_jobs'

export const MATCH_EXPIRY_DAYS = 7

export interface StatCardData {
  label: string
  value: string
  color: string
}