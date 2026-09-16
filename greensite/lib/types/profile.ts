import { Database } from '@/lib/supabase'

export type ProfileRow = Pick<Database['public']['Tables']['profiles']['Row'], 'resume' | 'org_id'>
export type OrgRow = Pick<Database['public']['Tables']['orgs']['Row'], 'email_domain'>
export type PreferenceRow = Pick<Database['public']['Tables']['user_job_preferences']['Row'], 'preference_id' | 'job_types' | 'locations' | 'experience_level' | 'include_remote' | 'job_categories' | 'job_subcategories'>

export interface ProfileInfo {
  resumeUploaded: boolean
  orgDomain: string | null | undefined
}