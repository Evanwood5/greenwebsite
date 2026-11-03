'use client'

import Image from 'next/image'
import FadeIn from '@/components/ui/FadeIn'

function FanArrowsLeft() {
  const paths = [
    { d: 'M 0,48  C 30,48  60,155 90,155', color: 'var(--palette-orange-500)', delay: '0s' },
    { d: 'M 0,155 C 25,110 65,130 90,155', color: 'var(--palette-purple-500)', delay: '0.8s' },
    { d: 'M 0,262 C 30,262 60,155 90,155', color: 'var(--palette-blue-500)', delay: '1.6s' },
  ]
  return (
    <svg width="80" height="310" viewBox="0 0 80 310" fill="none" style={{ overflow: 'visible', flexShrink: 0 }}>
      <defs>
        {paths.map((_, i) => (
          <filter key={i} id={`glow-l${i}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        ))}
      </defs>
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} stroke={p.color} strokeOpacity="0.12" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path
            d={p.d}
            stroke={p.color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="16 84"
            filter={`url(#glow-l${i})`}
            style={{ animation: 'glowTravel 3.5s linear infinite', animationDelay: p.delay }}
          />
        </g>
      ))}
    </svg>
  )
}

function GlowLineRight({ filterId }: { filterId: string }) {
  const d = 'M 0,20 L 68,20'
  return (
    <svg width="68" height="40" viewBox="0 0 68 40" fill="none" style={{ overflow: 'visible', flexShrink: 0 }}>
      <defs>
        <filter id={filterId} x="-10" y="10" width="90" height="20" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={d} stroke="var(--palette-green-500)" strokeOpacity="0.12" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path
        d={d}
        stroke="var(--palette-green-500)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="16 84"
        filter={`url(#${filterId})`}
        style={{ animation: 'glowTravel 2s linear infinite' }}
      />
    </svg>
  )
}

function CompanyCard({ letter, color, colorRgb, delay }: { letter: string; color: string; colorRgb: string; delay: number }) {
  return (
    <FadeIn from="left" delay={delay}>
      <div
        className="rounded-xl p-3 flex items-start gap-2.5"
        style={{ background: 'var(--palette-neutral-900)', border: '1px solid rgb(var(--palette-white-rgb) / 0.2)', width: '160px' }}
      >
        <div
          className="rounded-lg flex items-center justify-center font-bold text-sm"
          style={{ width: 32, height: 32, background: `rgb(${colorRgb} / 0.15)`, border: `1px solid rgb(${colorRgb} / 0.25)`, color, flexShrink: 0 }}
        >
          {letter}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="text-[12px] font-semibold text-white">Company {letter}</div>
          <div className="text-[10px]" style={{ color: 'var(--palette-neutral-600)' }}>Career Page</div>
          <div style={{ height: 4, background: 'rgb(var(--palette-white-rgb) / 0.06)', borderRadius: 3, marginTop: 7, width: '80%' }} />
          <div style={{ height: 4, background: 'rgb(var(--palette-white-rgb) / 0.04)', borderRadius: 3, marginTop: 4, width: '55%' }} />
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
            <span style={{ fontSize: 9, color }}>New job posted</span>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

const jobRows = [
  { title: 'Backend Engineer', company: 'Company A', color: 'var(--palette-orange-500)', colorRgb: 'var(--palette-orange-500-rgb)' },
  { title: 'Product Designer', company: 'Company B', color: 'var(--palette-purple-500)', colorRgb: 'var(--palette-purple-500-rgb)' },
  { title: 'SWE Intern',       company: 'Company C', color: 'var(--palette-blue-500)', colorRgb: 'var(--palette-blue-500-rgb)' },
  { title: 'Frontend Engineer',company: 'Company A', color: 'var(--palette-orange-500)', colorRgb: 'var(--palette-orange-500-rgb)' },
]

function JobFeedMockup() {
  return (
    <div
      className="rounded-2xl flex-shrink-0"
      style={{ background: 'var(--palette-neutral-900)', border: '1px solid rgb(var(--palette-white-rgb) / 0.2)', padding: '14px', width: 230 }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgb(var(--palette-white-rgb) / 0.06)' }}>
        <Image src="/finally.png" alt="" width={14} height={14} className="rounded" />
        <div style={{ flex: 1, height: 5, background: 'rgb(var(--palette-white-rgb) / 0.08)', borderRadius: 3 }} />
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgb(var(--palette-white-rgb) / 0.06)' }} />
      </div>
      {jobRows.map((j, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 0',
            borderBottom: i < jobRows.length - 1 ? '1px solid rgb(var(--palette-white-rgb) / 0.04)' : 'none',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: j.color, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--palette-neutral-200)' }}>{j.title}</div>
            <div style={{ fontSize: 9, color: j.color }}>{j.company}</div>
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--palette-green-500)', background: 'rgb(var(--palette-green-500-rgb) / 0.08)', border: '1px solid rgb(var(--palette-green-500-rgb) / 0.2)', padding: '2px 6px', borderRadius: 3, flexShrink: 0 }}>
            New
          </div>
          <div style={{ width: 30, height: 4, background: 'rgb(var(--palette-white-rgb) / 0.06)', borderRadius: 2, flexShrink: 0 }} />
        </div>
      ))}
    </div>
  )
}

export default function WrapperSection() {
  return (
    <section
      id="how-it-works"
      style={{ background: 'var(--palette-forest-950)', borderRadius: '20px', scrollMarginTop: '72px', overflow: 'hidden' }}
      className="px-6 py-24"
    >
      <style>{`
        @keyframes glowTravel {
          from { stroke-dashoffset: 100; }
          to   { stroke-dashoffset: -100; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <FadeIn className="text-center mb-16">
          <div
            className="inline-block text-[10px] font-bold tracking-widest mb-5 px-3 py-1.5 rounded-full"
            style={{ color: 'var(--palette-green-500)', background: 'rgb(var(--palette-green-500-rgb) / 0.08)', border: '1px solid rgb(var(--palette-green-500-rgb) / 0.15)', letterSpacing: '0.1em' }}
          >
            HOW IT WORKS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5" style={{ letterSpacing: '-0.03em' }}>
            Smarter job search.<br /><span style={{ color: 'var(--palette-green-500)' }}>Straight from the source.</span>
          </h2>
          <p className="text-[15px] leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--palette-neutral-500)' }}>
            We monitor company career pages and turn them into a smarter job search experience, helping you discover and act on opportunities before others.
          </p>
        </FadeIn>

        {/* Diagram — full width flow */}
        <FadeIn>
          <div className="flex items-center justify-center gap-1 overflow-x-auto pb-4">

            {/* Company cards */}
            <div className="flex flex-col gap-3 flex-shrink-0">
              <CompanyCard letter="A" color="var(--palette-orange-500)" colorRgb="var(--palette-orange-500-rgb)" delay={0} />
              <CompanyCard letter="B" color="var(--palette-purple-500)" colorRgb="var(--palette-purple-500-rgb)" delay={80} />
              <CompanyCard letter="C" color="var(--palette-blue-500)" colorRgb="var(--palette-blue-500-rgb)" delay={160} />
            </div>

            <FanArrowsLeft />

            {/* Greenify hub */}
            <div
              className="rounded-2xl flex flex-col items-center justify-center gap-3 flex-shrink-0"
              style={{
                background: 'linear-gradient(145deg, var(--palette-forest-950), var(--palette-neutral-900))',
                border: '1px solid rgb(var(--palette-green-500-rgb) / 0.4)',
                padding: '24px 18px',
                width: 120,
                boxShadow: '0 0 48px rgb(var(--palette-green-500-rgb) / 0.08)',
              }}
            >
              <Image src="/finally.png" alt="Greenify logo" width={46} height={46} className="rounded-xl" />
              <div className="text-center">
                <div className="text-[13px] font-bold text-white">Greenify</div>
                <div className="text-[9px] mt-1" style={{ color: 'var(--palette-neutral-600)', lineHeight: 1.4 }}>Real-time scraping<br />& processing</div>
              </div>
            </div>

            <GlowLineRight filterId="glow-r0" />

            {/* Job feed mockup */}
            <JobFeedMockup />

            <GlowLineRight filterId="glow-r1" />

            {/* Apply card */}
            <div
              className="rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center flex-shrink-0"
              style={{ background: 'var(--palette-neutral-900)', border: '1px solid rgb(var(--palette-white-rgb) / 0.2)', padding: '24px 14px', width: 95 }}
            >
              <div
                className="rounded-xl flex items-center justify-center"
                style={{ width: 38, height: 38, background: 'rgb(var(--palette-green-500-rgb) / 0.08)', border: '1px solid rgb(var(--palette-green-500-rgb) / 0.15)' }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--palette-green-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15,3 21,3 21,9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </div>
              <div className="text-[11px] font-semibold text-white leading-tight">Apply on<br />company site</div>
            </div>

          </div>
        </FadeIn>

        {/* Disclaimer */}
        <FadeIn delay={300} className="flex justify-center mt-12">
          <div
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl"
            style={{ background: 'var(--palette-forest-900)', border: '1px solid rgb(var(--palette-green-500-rgb) / 0.3)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--palette-green-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="text-[13px] font-medium" style={{ color: 'var(--palette-neutral-400)' }}>
              Greenify surfaces jobs from public career pages and links directly to the source. Always.
            </span>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
