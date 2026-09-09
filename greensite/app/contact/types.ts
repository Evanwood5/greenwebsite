export interface FeatureSectionData {
  id: string
  eyebrow: string
  title: string[]
  blurb: string
  bullets: string[]
  dark: boolean
  reverse: boolean
  background: string
}

export interface Tool {
  label: string
  desc: string
  color: string
}

export const FEATURE_SECTIONS: FeatureSectionData[] = [
  {
    id: 'no-ghost-jobs',
    eyebrow: 'No ghost jobs',
    title: ['Every listing is real.', 'We checked.'],
    blurb: "Ghost jobs , postings that exist only to collect resumes , waste your time and kill your momentum. We pull directly from company career pages, so if it's on Greenify, it's actually open.",
    bullets: [
      "Pulled directly from the company's own career page",
      'No recycled or expired listings',
      'Updated in real-time , not once a week',
    ],
    dark: true,
    reverse: false,
    background: '#0f2510',
  },
  {
    id: 'source-of-truth',
    eyebrow: 'Source of truth',
    title: ['We go direct.', 'No middleman.'],
    blurb: "Major job boards aggregate from other sources, by the time a job shows up there, it's already been seen by thousands. Greenify monitors company career pages directly, so you see it first.",
    bullets: [
      'Jobs appear before they hit major boards',
      "Direct link to the company's application page , always",
      'No sponsored listings, no pay-to-rank',
    ],
    dark: false,
    reverse: true,
    background: '#f0ece4',
  },
  {
    id: 'michigan-focused',
    eyebrow: 'Michigan focused',
    title: ['We know Michigan\u2019s', 'market inside out.'],
    blurb: "From Ford and Stellantis to the local engineering firms that never post on big boards , we track them all. Michigan companies, Michigan students. That's the focus.",
    bullets: [
      '100+ Michigan companies tracked',
      'Large employers and local firms alike',
      'Tech, business, health, and engineering covered',
    ],
    dark: true,
    reverse: false,
    background: '#0a1f0a',
  },
]

export const TOOLS: Tool[] = [
  { label: 'Job Feed', desc: 'Browse thousands of real-time listings filtered by field, location, and type.', color: '#29C115' },
  { label: 'Saved Jobs', desc: 'Save roles, track your status, and keep notes , all in one organized view.', color: '#2563EB' },
  { label: 'Company Tracking', desc: 'Follow specific companies and get notified the moment they post a new role.', color: '#D97706' },
  { label: 'Custom Matching', desc: 'AI-powered job matches based on your resume and preferences.', color: '#c8391e' },
  { label: 'Analytics', desc: 'See hiring trends by field, city, and company across Michigan.', color: '#7C3AED' },
  { label: 'Application Tracking', desc: 'Know where you stand , from saved to offer, track every application.', color: '#0891B2' },
]