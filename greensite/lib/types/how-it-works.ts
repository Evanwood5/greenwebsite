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
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.08)',
    description: 'Software, data, cloud, and engineering roles across the fastest-growing tech companies in Michigan.',
    subs: ['Software Engineering', 'Data Science / AI', 'Cloud / DevOps', 'Cybersecurity', 'IT / Sysadmin', 'UI / UX', 'QA / Testing', 'Hardware / Embedded', 'Data Engineering'],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    description: 'Mechanical, electrical, civil, and manufacturing roles at leading industrial firms in Michigan.',
    subs: ['Mechanical', 'Electrical', 'Manufacturing', 'Civil / Structural', 'Automotive', 'Industrial', 'Chemical', 'Controls', 'Materials', 'Environmental', 'Aerospace', 'Trades'],
  },
  {
    id: 'health',
    label: 'Health',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    description: 'Clinical, research, and healthcare administration positions across hospitals and health systems.',
    subs: ['Clinical / Nursing', 'Allied Health', 'Pharmacy', 'Healthcare Administration', 'Research / Lab', 'Medical Technology', 'Public Health'],
  },
  {
    id: 'business',
    label: 'Business',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    description: 'Finance, consulting, operations, and management opportunities at top Michigan employers.',
    subs: ['Marketing / Sales', 'Operations / Logistics', 'Finance / Accounting', 'Project Management', 'Banking / Finance', 'Consulting / Strategy', 'HR / Recruiting', 'Business Analytics'],
  },
]