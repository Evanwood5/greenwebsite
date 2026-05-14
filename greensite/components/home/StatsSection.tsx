'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import FadeIn from '@/components/ui/FadeIn'

const testimonials = [
  {
    name: 'Evan W',
    school: 'Michigan State University',
    company: 'TechSmith',
    avatar: '/aaaa.JPG',
    color: '#EAB308',
    colorRgb: '234,179,8',
    quote: (
      <>
        Landed my{' '}
        <span style={{ color: '#EAB308', fontWeight: 500 }}>TechSmith summer internship</span> before it appeared on major job boards.{' '}
        <span style={{ color: '#EAB308', fontWeight: 500 }}>Greenify&apos;s real-time tracking</span>{' '}
        caught the posting the moment it went live, giving me a huge head start.
      </>
    ),
  },
  {
    name: 'Anish S',
    school: 'University of Michigan',
    company: 'State of Michigan',
    avatar: '/stroy1.png',
    color: '#3B82F6',
    colorRgb: '59,130,246',
    quote: (
      <>
        Got my full-time offer at the{' '}
        <span style={{ color: '#3B82F6', fontWeight: 500 }}>State of Michigan</span> through Greenify without endlessly scrolling job boards. Its{' '}
        <span style={{ color: '#3B82F6', fontWeight: 500 }}>resume matching</span>{' '}
        surfaced the role immediately. I applied early and got a head start on interviews.
      </>
    ),
  },
  {
    name: 'Ryan A',
    school: 'Michigan State University',
    company: 'Ally Bank',
    avatar: '/story2.png',
    color: '#A855F7',
    colorRgb: '168,85,247',
    quote: (
      <>
        Secured my full-time role at{' '}
        <span style={{ color: '#A855F7', fontWeight: 500 }}>Ally Bank</span> after Greenify&apos;s{' '}
        <span style={{ color: '#A855F7', fontWeight: 500 }}>analytics showed Detroit</span>{' '}
        was a growing hub for tech jobs. I set my preferences to monitor roles there and applied early when the right one came up.
      </>
    ),
  },
  {
    name: 'Jeff S',
    school: 'Michigan State',
    company: 'Jackson National Life',
    avatar: '/story4.png',
    color: '#EF4444',
    colorRgb: '239,68,68',
    quote: (
      <>
        Greenify&apos;s{' '}
        <span style={{ color: '#EF4444', fontWeight: 500 }}>custom resume matching</span> connected my experience with a role at{' '}
        <span style={{ color: '#EF4444', fontWeight: 500 }}>Jackson National Life</span> that closely aligned with my background and career goals. The personalized match helped me discover and apply to the opportunity early.
      </>
    ),
  },
]

const n = testimonials.length
const GAP = 20
// Triple the array so there's always a full copy buffering each side
const slides = [...testimonials, ...testimonials, ...testimonials]

function Card({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col"
      style={{
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.07)',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontSize: '48px',
          lineHeight: 1,
          color: `rgba(${t.colorRgb},0.25)`,
          fontFamily: 'Georgia, serif',
          marginBottom: '8px',
        }}
      >
        &ldquo;
      </div>
      <p className="text-[14px] leading-relaxed flex-1" style={{ color: '#a1a1aa' }}>
        {t.quote}
      </p>
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '16px',
          marginTop: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <img
          src={t.avatar}
          alt={t.name}
          width={36}
          height={36}
          className="rounded-full object-cover"
          style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0, marginTop: '2px' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <div className="text-[13px] font-semibold text-white">{t.name}</div>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: t.color,
                background: `rgba(${t.colorRgb},0.08)`,
                padding: '2px 8px',
                borderRadius: '4px',
                border: `1px solid rgba(${t.colorRgb},0.2)`,
                whiteSpace: 'nowrap',
              }}
            >
              {t.company}
            </div>
          </div>
          <div className="text-[11px]" style={{ color: '#71717a' }}>
            {t.school}
          </div>
        </div>
      </div>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  flexShrink: 0,
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background 0.2s, border-color 0.2s',
}

export default function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [slideWidth, setSlideWidth] = useState(0)
  const [pv, setPv] = useState(3) // slides per view
  // Start in the middle copy so both sides have a full buffer
  const [trackIndex, setTrackIndex] = useState(n)
  const [animated, setAnimated] = useState(true)
  const busy = useRef(false)

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth
      const perView = w < 640 ? 1 : w < 900 ? 2 : 3
      setPv(perView)
      setSlideWidth((w - GAP * (perView - 1)) / perView)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const next = () => {
    if (busy.current) return
    busy.current = true
    setTrackIndex((i) => i + 1)
  }

  const prev = () => {
    if (busy.current) return
    busy.current = true
    setTrackIndex((i) => i - 1)
  }

  const handleTransitionEnd = useCallback(() => {
    busy.current = false
    setTrackIndex((i) => {
      // Right boundary: once we've slid far enough into the 3rd copy, snap back n steps
      if (i >= 2 * n - pv + 1) {
        setAnimated(false)
        return i - n
      }
      // Left boundary: once we've slid far enough into the 1st copy, snap forward n steps
      if (i <= n - pv) {
        setAnimated(false)
        return i + n
      }
      return i
    })
  }, [pv])

  useEffect(() => {
    if (!animated) {
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimated(true))
      )
      return () => cancelAnimationFrame(id)
    }
  }, [animated])

  const offset = -(trackIndex * (slideWidth + GAP))

  return (
    <section
      style={{ background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      className="px-6 py-24"
    >
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <div
            className="inline-block text-[10px] font-bold tracking-widest mb-5 px-3 py-1.5 rounded-full"
            style={{
              color: '#29C115',
              background: 'rgba(41,193,21,0.08)',
              border: '1px solid rgba(41,193,21,0.15)',
              letterSpacing: '0.1em',
            }}
          >
            SUCCESS STORIES
          </div>
          <h2 className="text-4xl font-bold text-white" style={{ letterSpacing: '-0.03em' }}>
            Students who got hired first
          </h2>
        </FadeIn>

        <FadeIn>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              style={btnStyle}
              onClick={prev}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            <div
              ref={containerRef}
              style={{ flex: 1, overflow: 'hidden', minWidth: 0, opacity: slideWidth ? 1 : 0, transition: 'opacity 0.2s' }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: GAP,
                  alignItems: 'stretch',
                  transform: slideWidth ? `translateX(${offset}px)` : undefined,
                  transition: animated ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'none',
                  willChange: 'transform',
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {slides.map((t, i) => (
                  <div key={i} style={{ flex: `0 0 ${slideWidth}px`, minWidth: 0 }}>
                    <Card t={t} />
                  </div>
                ))}
              </div>
            </div>

            <button
              style={btnStyle}
              onClick={next}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
