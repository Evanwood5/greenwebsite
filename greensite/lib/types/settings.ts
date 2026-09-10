export const JOB_FIELDS: Record<string, string[]> = {
  Tech: [
    'Software Engineering', 'Data Science / AI', 'IT / Sysadmin',
    'Cybersecurity', 'Cloud / DevOps', 'QA / Testing', 'UI / UX', 'Hardware / Embedded',
  ],
  Engineering: [
    'Mechanical', 'Electrical', 'Civil / Structural', 'Chemical', 'Industrial',
    'Aerospace', 'Materials', 'Environmental', 'Automotive', 'Manufacturing', 'Trades',
  ],
  Business: [
    'Finance / Accounting', 'Banking / Finance', 'Marketing / Sales',
    'Operations / Logistics', 'HR / Recruiting', 'Business Analytics',
    'Consulting / Strategy', 'Project Management',
  ],
  Health: [
    'Clinical / Nursing', 'Allied Health', 'Pharmacy', 'Healthcare Administration',
    'Research / Lab', 'Public Health', 'Medical Technology',
  ],
}

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

export const CATEGORY_COLORS: Record<string, string> = {
  Tech: '#60a5fa',
  Engineering: '#f97316',
  Business: '#a78bfa',
  Health: '#f43f5e',
}

export const cardStyle: React.CSSProperties = {
  background: '#1e1e1e',
  borderRadius: '4px',
  padding: '16px',
  border: '1px solid rgba(255,255,255,0.06)',
  marginBottom: '10px',
}

export const sectionHeadingStyle: React.CSSProperties = {
  color: '#e4e4e7', fontSize: '13px', fontWeight: 600,
  marginBottom: '2px', marginTop: '22px', letterSpacing: '-0.01em',
}

export const sectionSubStyle: React.CSSProperties = {
  color: '#52525b', fontSize: '11px', marginBottom: '10px',
}

export function displayLocation(loc: string): string {
  const parts = loc.split(',').filter(Boolean)
  if (parts.length === 0) return 'All Michigan'
  if (parts.length === 1) return parts[0]
  return `${parts.length} cities`
}

export function getUniversityFromDomain(domain: string | null | undefined): string {
  if (!domain) return 'None'
  if (domain.includes('msu.edu')) return 'Michigan State'
  if (domain.includes('umich.edu')) return 'University of Michigan'
  if (domain.includes('wayne.edu')) return 'Wayne State'
  return domain
}

export type PreferenceId = 1 | 2
