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
        background: 'var(--palette-forest-950)',
        border: '1px solid rgb(var(--palette-green-500-rgb) / 0.25)',
        padding: '20px 24px',
        width: 360,
        minHeight: 300,
        boxShadow: '0 0 40px rgb(var(--palette-green-500-rgb) / 0.06)',
      }}
    >
      {/* Terminal header dots */}
      <div className="flex items-center gap-1.5 mb-4">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--palette-macos-red)' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--palette-macos-yellow)' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--palette-macos-green)' }} />
        <span className="ml-2 text-[11px]" style={{ color: 'var(--palette-neutral-710)' }}>greenify-scraper</span>
      </div>

      {lines.slice(0, visibleCount).map((line, i) => (
        <div key={i} style={{
          color: line.type === 'success' ? 'var(--palette-green-500)'
               : line.type === 'info'    ? 'rgb(var(--palette-white-rgb) / 0.5)'
               : 'rgb(var(--palette-white-rgb) / 0.75)',
          marginBottom: '4px',
        }}>
          {line.text}
          {i === visibleCount - 1 && visibleCount < lines.length && (
            <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--palette-green-500)' }}>▌</span>
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
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--palette-white)', border: '2px solid var(--palette-red-500)', boxShadow: '0 0 32px rgb(var(--palette-red-500-rgb) / 0.12)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'var(--palette-neutral-55)', borderBottom: '1px solid var(--palette-neutral-150)' }}>
          <div className="text-[11px] font-bold" style={{ color: 'var(--palette-neutral-525)' }}>Major job boards</div>
          <div className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--palette-red-50)', color: 'var(--palette-red-800)' }}>
            Possibly outdated
          </div>
        </div>
        <div className="p-4">
          <div className="text-[14px] font-bold mb-1" style={{ color: 'var(--palette-neutral-715)' }}>Software Engineer</div>
          <div className="text-[12px] mb-3" style={{ color: 'var(--palette-neutral-525)' }}>Top Michigan Employer · Detroit, MI</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--palette-neutral-100)', color: 'var(--palette-neutral-525)' }}>Full-time</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--palette-neutral-100)', color: 'var(--palette-neutral-525)' }}>Hybrid</span>
          </div>
          <div className="mt-3 text-[11px] font-semibold" style={{ color: 'var(--palette-neutral-450)' }}>
            Posted 3 weeks ago
          </div>
        </div>
      </div>

      {/* VS divider */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex-1 h-px" style={{ background: 'rgb(var(--palette-white-rgb) / 0.1)' }} />
        <span className="text-[11px] font-bold" style={{ color: 'rgb(var(--palette-white-rgb) / 0.3)' }}>VS</span>
        <div className="flex-1 h-px" style={{ background: 'rgb(var(--palette-white-rgb) / 0.1)' }} />
      </div>

      {/* Greenify — fresh */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--palette-white)', border: '2px solid var(--palette-green-500)', boxShadow: '0 0 32px rgb(var(--palette-green-500-rgb) / 0.15)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'var(--palette-green-55)', borderBottom: '1px solid rgb(var(--palette-green-500-rgb) / 0.15)' }}>
          <div className="text-[11px] font-bold" style={{ color: 'var(--palette-green-700)' }}>Greenify</div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--palette-green-500)' }} />
            <span className="text-[10px] font-bold" style={{ color: 'var(--palette-green-500)' }}>Live</span>
          </div>
        </div>
        <div className="p-4">
          <div className="text-[14px] font-bold mb-1" style={{ color: 'var(--palette-neutral-840)' }}>Software Engineer</div>
          <div className="text-[12px] mb-3" style={{ color: 'var(--palette-neutral-525)' }}>Top Michigan Employer · Detroit, MI</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--palette-green-50)', color: 'var(--palette-green-700)', border: '1px solid var(--palette-green-200)' }}>Full-time</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--palette-green-50)', color: 'var(--palette-green-700)', border: '1px solid var(--palette-green-200)' }}>Hybrid</span>
          </div>
          <div className="mt-3 text-[11px] font-bold" style={{ color: 'var(--palette-green-500)' }}>
            Posted 2 hours ago
          </div>
        </div>
      </div>

    </div>
  )
}
