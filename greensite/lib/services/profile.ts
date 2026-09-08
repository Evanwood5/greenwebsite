import { supabase } from '@/lib/db/supabase'
import { Preference, PreferenceId, emptyPref } from '@/app/settings/types'

// ── Profile Service ───────────────────────────────────────────────────────────
// All database calls related to user profile, resume uploads, org sync,
// and saved job preferences.

interface ProfileRow {
  resume: string | null
  org_id: string | null
}

interface OrgRow {
  domain: string | null
}

interface PreferenceRow {
  preference_id: number
  job_types: string[]
  locations: string[]
  experience_level: string | null
  include_remote: boolean
  job_categories: string[]
  job_subcategories: string[]
}

export interface ProfileInfo {
  resumeUploaded: boolean
  orgDomain: string | null | undefined
}

export async function getProfile(userId: string): Promise<ProfileInfo> {
  const { data } = await supabase
    .from('profiles')
    .select('resume, org_id')
    .eq('user_id', userId)
    .single<ProfileRow>()

  const resumeUploaded = !!data?.resume

  if (data?.org_id) {
    const { data: orgData } = await supabase
      .from('orgs')
      .select('domain')
      .eq('id', data.org_id)
      .single<OrgRow>()
    return { resumeUploaded, orgDomain: orgData?.domain ?? null }
  }

  return { resumeUploaded, orgDomain: null }
}

export async function removeResume(userId: string): Promise<void> {
  await supabase.from('profiles').update({ resume: null }).eq('user_id', userId)
}

function mapPreferenceRow(row: PreferenceRow): Preference {
  return {
    jobTypes: row.job_types || [],
    location: (row.locations || []).join(','),
    experienceLevel: row.experience_level || 'any',
    includeRemote: row.include_remote || false,
    jobCategories: row.job_categories || [],
    jobSubcategories: row.job_subcategories || [],
  }
}

export async function getPreferences(userId: string): Promise<Record<PreferenceId, Preference>> {
  const { data } = await supabase
    .from('user_job_preferences')
    .select('*')
    .eq('user_id', userId)
    .in('preference_id', [1, 2])

  const result: Record<PreferenceId, Preference> = {
    1: { ...emptyPref },
    2: { ...emptyPref },
  }

  data?.forEach((row) => {
    if (row.preference_id === 1 || row.preference_id === 2) {
      result[row.preference_id as PreferenceId] = mapPreferenceRow(row)
    }
  })

  return result
}

export async function upsertPreference(
  userId: string,
  id: PreferenceId,
  pref: Preference,
): Promise<void> {
  const locationsArray = pref.location.split(',').map(l => l.trim()).filter(Boolean)
  const { error } = await supabase.from('user_job_preferences').upsert({
    user_id: userId,
    preference_id: id,
    job_types: pref.jobTypes,
    include_remote: pref.includeRemote,
    locations: locationsArray,
    experience_level: pref.jobTypes.includes('full-time') ? pref.experienceLevel : null,
    job_categories: pref.jobCategories,
    job_subcategories: pref.jobSubcategories,
  }, { onConflict: 'user_id,preference_id' })
  if (error) throw error
}

export async function deletePreference(userId: string, id: PreferenceId): Promise<void> {
  await supabase.from('user_job_preferences').delete().eq('user_id', userId).eq('preference_id', id)
}

export async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? null
}
