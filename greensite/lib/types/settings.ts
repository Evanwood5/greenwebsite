
export interface Preference {
  jobTypes: string[]
  location: string
  experienceLevel: string
  includeRemote: boolean
  jobCategories: string[]
  jobSubcategories: string[]
}

export const emptyPref: Preference = {
  jobTypes: [], location: '', experienceLevel: 'any',
  includeRemote: true, jobCategories: [], jobSubcategories: [],
}


export type PreferenceId = 1 | 2
