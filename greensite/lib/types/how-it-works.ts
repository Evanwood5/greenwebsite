export type FieldId = 'tech' | 'engineering' | 'health' | 'business'

export interface Field {
  id: FieldId
  label: string
  color: string
  bg: string
  description: string
  subs: string[]
}

export const FIELDS: Field[] = [
  {
    id: 'tech',
    label: 'Tech',
    color: 'var(--palette-sky-500)',
    bg: 'rgb(var(--palette-sky-500-rgb) / 0.08)',
    description: 'Software, data, cloud, and engineering roles across the fastest-growing tech companies in Michigan.',
    subs: ['Software Engineering', 'Data Science / AI', 'Cloud / DevOps', 'Cybersecurity', 'IT / Sysadmin', 'UI / UX', 'QA / Testing', 'Hardware / Embedded', 'Data Engineering'],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    color: 'var(--palette-orange-500)',
    bg: 'rgb(var(--palette-orange-500-rgb) / 0.08)',
    description: 'Mechanical, electrical, civil, and manufacturing roles at leading industrial firms in Michigan.',
    subs: ['Mechanical', 'Electrical', 'Manufacturing', 'Civil / Structural', 'Automotive', 'Industrial', 'Chemical', 'Controls', 'Materials', 'Environmental', 'Aerospace', 'Trades'],
  },
  {
    id: 'health',
    label: 'Health',
    color: 'var(--palette-red-500)',
    bg: 'rgb(var(--palette-red-500-rgb) / 0.08)',
    description: 'Clinical, research, and healthcare administration positions across hospitals and health systems.',
    subs: ['Clinical / Nursing', 'Allied Health', 'Pharmacy', 'Healthcare Administration', 'Research / Lab', 'Medical Technology', 'Public Health'],
  },
  {
    id: 'business',
    label: 'Business',
    color: 'var(--palette-violet-500)',
    bg: 'rgb(var(--palette-violet-500-rgb) / 0.08)',
    description: 'Finance, consulting, operations, and management opportunities at top Michigan employers.',
    subs: ['Marketing / Sales', 'Operations / Logistics', 'Finance / Accounting', 'Project Management', 'Banking / Finance', 'Consulting / Strategy', 'HR / Recruiting', 'Business Analytics'],
  },
]