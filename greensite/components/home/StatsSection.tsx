'use client'

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

function Card({ t, className = '' }: { t: typeof testimonials[0]; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-6 flex flex-col ${className}`}
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.08)',
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
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <img
          src={t.avatar}
          alt={t.name}
          className="rounded-full object-cover flex-shrink-0"
          style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.15)' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
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
          <div className="text-[11px]" style={{ color: '#71717a' }}>{t.school}</div>
        </div>
      </div>
    </div>
  )
}

export default function StatsSection() {
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
          {/* Bento grid */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: 'auto auto',
            }}
          >
            {/* Card 1 — top left */}
            <Card t={testimonials[0]} />

            {/* Card 2 — top center */}
            <Card t={testimonials[1]} />

            {/* Card 3 — right, spans 2 rows */}
            <Card
              t={testimonials[2]}
              className="row-span-2"
            />

            {/* Card 4 — bottom, spans 2 columns */}
            <Card
              t={testimonials[3]}
              className="col-span-2"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
