'use client'

import { useEffect, useState } from 'react'

const lines = [
  { type: 'cmd',     text: '$ scraping careers.company-a.com...' },
  { type: 'success', text: '✓ 14 new jobs found' },
  { type: 'cmd',     text: '$ scraping careers.company-b.com...' },
  { type: 'success', text: '✓ 8 new jobs found' },
  { type: 'cmd',     text: '$ scraping careers.company-c.com...' },
  { type: 'success', text: '✓ 3 new jobs found' },
  { type: 'info',    text: '→ 25 listings added to feed' },
]

export function TerminalCard() {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (visibleCount >= lines.length) {
      // restart after pause
      const timer = setTimeout(() => setVisibleCount(0), 2500)
      return () => clearTimeout(timer)
    }
    const delay = lines[visibleCount]?.type === 'success' || lines[visibleCount]?.type === 'info' ? 400 : 900
    const timer = setTimeout(() => setVisibleCount(v => v + 1), delay)
    return () => clearTimeout(timer)
  }, [visibleCount])

  return (
    <div
      className="flex-shrink-0 rounded-2xl font-mono text-[13px] leading-relaxed"
      style={{
        background: '#050a05',
        border: '1px solid rgba(41,193,21,0.25)',
        padding: '20px 24px',
        width: 360,
        minHeight: 300,
        boxShadow: '0 0 40px rgba(41,193,21,0.06)',
      }}
    >
      {/* Terminal header dots */}
      <div className="flex items-center gap-1.5 mb-4">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
        <span className="ml-2 text-[11px]" style={{ color: '#3a3a3a' }}>greenify-scraper</span>
      </div>

      {lines.slice(0, visibleCount).map((line, i) => (
        <div key={i} style={{
          color: line.type === 'success' ? '#29C115'
               : line.type === 'info'    ? 'rgba(255,255,255,0.5)'
               : 'rgba(255,255,255,0.75)',
          marginBottom: '4px',
        }}>
          {line.text}
          {i === visibleCount - 1 && visibleCount < lines.length && (
            <span style={{ animation: 'blink 1s step-end infinite', color: '#29C115' }}>▌</span>
          )}
        </div>
      ))}

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  )
}

export function BeforeAfterCard() {
  return (
    <div className="flex-shrink-0 flex flex-col gap-3" style={{ width: 320 }}>

      {/* Indeed — stale */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '2px solid #ef4444', boxShadow: '0 0 32px rgba(239,68,68,0.12)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <div className="text-[11px] font-bold" style={{ color: '#6b7280' }}>Major job boards</div>
          <div className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: '#fee2e2', color: '#991b1b' }}>
            Possibly outdated
          </div>
        </div>
        <div className="p-4">
          <div className="text-[14px] font-bold mb-1" style={{ color: '#374151' }}>Software Engineer</div>
          <div className="text-[12px] mb-3" style={{ color: '#6b7280' }}>Top Michigan Employer · Detroit, MI</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#f3f4f6', color: '#6b7280' }}>Full-time</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#f3f4f6', color: '#6b7280' }}>Hybrid</span>
          </div>
          <div className="mt-3 text-[11px] font-semibold" style={{ color: '#9ca3af' }}>
            Posted 3 weeks ago
          </div>
        </div>
      </div>

      {/* VS divider */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>VS</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
      </div>

      {/* Greenify — fresh */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '2px solid #29C115', boxShadow: '0 0 32px rgba(41,193,21,0.15)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#f0fdf0', borderBottom: '1px solid rgba(41,193,21,0.15)' }}>
          <div className="text-[11px] font-bold" style={{ color: '#15803d' }}>Greenify</div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#29C115' }} />
            <span className="text-[10px] font-bold" style={{ color: '#29C115' }}>Live</span>
          </div>
        </div>
        <div className="p-4">
          <div className="text-[14px] font-bold mb-1" style={{ color: '#111827' }}>Software Engineer</div>
          <div className="text-[12px] mb-3" style={{ color: '#6b7280' }}>Top Michigan Employer · Detroit, MI</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>Full-time</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>Hybrid</span>
          </div>
          <div className="mt-3 text-[11px] font-bold" style={{ color: '#29C115' }}>
            Posted 2 hours ago
          </div>
        </div>
      </div>

    </div>
  )
}
