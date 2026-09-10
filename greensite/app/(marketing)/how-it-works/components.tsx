import { ReactNode } from 'react'
import { FIELDS } from '@/lib/types/how-it-works'

function CodeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

const FIELD_ICONS: Record<FieldId, ReactNode> = {
  tech: <CodeIcon />,
  engineering: <GearIcon />,
  health: <HeartIcon />,
  business: <ChartIcon />,
}

export function TrackHeader() {
  return (
    <div className="mb-16">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: '#29C115' }}>
        What We Track
      </p>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <h2 className="text-5xl font-extrabold" style={{ color: '#1a2e1a', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
          Four fields.
          <br />
          One platform.
        </h2>
        <p className="text-[15px] max-w-xs leading-relaxed" style={{ color: '#5a7a5a' }}>
          Every subcategory below maps to a real filter in your dashboard.
        </p>
      </div>
    </div>
  )
}

export function FieldCard({ field, index }: { field: Field; index: number }) {
  return (
    <div
      className="rounded-2xl px-8 py-7"
      style={{ background: '#ffffff', border: '1px solid rgba(30,58,30,0.07)' }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: field.bg, color: field.color }}
        >
          {FIELD_ICONS[field.id]}
        </div>
        <div className="text-[20px] font-extrabold" style={{ color: '#1a2e1a', letterSpacing: '-0.02em' }}>
          {field.label}
        </div>
        <div className="ml-auto text-[12px] font-bold" style={{ color: 'rgba(30,58,30,0.25)' }}>0{index + 1}</div>
      </div>
      <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#5a7a5a' }}>{field.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {field.subs.map((s) => (
          <span
            key={s}
            className="text-[11px] px-2.5 py-1 rounded-full font-medium"
            style={{ background: field.bg, color: field.color }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer
      style={{ borderTop: '1px solid rgba(30,58,30,0.3)' }}
      className="px-6 py-6"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <p className="text-[13px] font-semibold" style={{ color: 'rgba(30,58,30,0.85)' }}>
          &copy; 2026 Greenify LLC
        </p>
        <a href="/terms" className="text-[13px] font-semibold transition-opacity hover:opacity-70" style={{ color: 'rgba(30,58,30,0.85)' }}>
          Terms of Service
        </a>
      </div>
    </footer>
  )
}