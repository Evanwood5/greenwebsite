'use client'

import FadeIn from '@/components/ui/FadeIn'

function BriefcaseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

function DashboardMockup() {
  const rows = [
    { company: 'Stripe', role: 'Backend Engineer', color: '#29C115', isTop: true },
    { company: 'Figma', role: 'Product Designer', color: '#a78bfa', isTop: false },
    { company: 'Notion', role: 'SWE Intern', color: '#60a5fa', isTop: false },
    { company: 'Linear', role: 'Frontend Engineer', color: '#f59e0b', isTop: false },
  ];
  return (
    <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ height: '7px', width: '80px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px' }} />
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ height: '24px', width: '52px', background: 'rgba(41,193,21,0.1)', borderRadius: '6px', border: '1px solid rgba(41,193,21,0.15)' }} />
          <div style={{ height: '24px', width: '52px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.07)' }} />
        </div>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            background: row.isTop ? 'rgba(41,193,21,0.04)' : 'rgba(255,255,255,0.02)',
            borderRadius: '8px',
            marginBottom: i < rows.length - 1 ? '6px' : 0,
            border: row.isTop ? '1px solid rgba(41,193,21,0.1)' : '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: row.color, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#e4e4e7', marginBottom: '1px' }}>{row.role}</div>
            <div style={{ fontSize: '10px', color: '#71717a' }}>{row.company}</div>
          </div>
          <div style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ height: '5px', width: '28px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsMockup() {
  const bars = [
    { height: 45, opacity: 0.25 },
    { height: 70, opacity: 0.35 },
    { height: 55, opacity: 0.3 },
    { height: 90, opacity: 1 },
    { height: 65, opacity: 0.45 },
    { height: 80, opacity: 0.55 },
    { height: 50, opacity: 0.35 },
    { height: 95, opacity: 1 },
  ];
  const companies = [
    { label: 'Microsoft', pct: '78%' },
    { label: 'Amazon', pct: '65%' },
    { label: 'Google', pct: '82%' },
  ];
  return (
    <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#e4e4e7' }}>Hiring Trends</div>
        <div style={{ fontSize: '10px', color: '#71717a', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.07)' }}>
          Q1 2026
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '100px', marginBottom: '18px' }}>
        {bars.map((bar, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: `rgba(41,193,21,${bar.opacity})`,
              height: `${bar.height}px`,
              borderRadius: '3px 3px 0 0',
            }}
          />
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
        {companies.map((c, i) => (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < companies.length - 1 ? '9px' : 0 }}
          >
            <div style={{ fontSize: '10px', color: '#71717a', width: '58px', flexShrink: 0 }}>{c.label}</div>
            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: c.pct, height: '100%', background: '#29C115', borderRadius: '2px', opacity: 0.65 }} />
            </div>
            <div style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 600, width: '28px', textAlign: 'right' }}>{c.pct}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumeMatchMockup() {
  const matches = [
    { role: 'SWE Intern @ Google', score: 94, isTop: true },
    { role: 'Backend Eng @ Stripe', score: 87, isTop: false },
    { role: 'Data Eng @ Tesla', score: 79, isTop: false },
  ];
  return (
    <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
        {/* Resume side */}
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '8px', color: '#52525b', marginBottom: '10px', fontWeight: 700, letterSpacing: '0.08em' }}>RESUME</div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', width: '90%', marginBottom: '6px' }} />
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', width: '70%', marginBottom: '6px' }} />
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', width: '80%', marginBottom: '12px' }} />
          <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{ height: '14px', width: '30px', background: 'rgba(41,193,21,0.12)', borderRadius: '3px', border: '1px solid rgba(41,193,21,0.18)' }} />
            <div style={{ height: '14px', width: '26px', background: 'rgba(96,165,250,0.12)', borderRadius: '3px', border: '1px solid rgba(96,165,250,0.18)' }} />
            <div style={{ height: '14px', width: '32px', background: 'rgba(167,139,250,0.12)', borderRadius: '3px', border: '1px solid rgba(167,139,250,0.18)' }} />
          </div>
        </div>
        {/* Matches side */}
        <div style={{ flex: 1.3 }}>
          <div style={{ fontSize: '8px', color: '#52525b', marginBottom: '10px', fontWeight: 700, letterSpacing: '0.08em' }}>TOP MATCHES</div>
          {matches.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: i < matches.length - 1 ? '6px' : 0,
                padding: '7px 8px',
                background: m.isTop ? 'rgba(41,193,21,0.05)' : 'rgba(255,255,255,0.02)',
                borderRadius: '7px',
                border: m.isTop ? '1px solid rgba(41,193,21,0.1)' : '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div style={{ fontSize: '9px', color: '#a1a1aa', flex: 1, marginRight: '6px', lineHeight: '1.3' }}>{m.role}</div>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#29C115',
                  background: 'rgba(41,193,21,0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  flexShrink: 0,
                }}
              >
                {m.score}%
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: 'rgba(41,193,21,0.05)',
          borderRadius: '8px',
          padding: '8px 12px',
          border: '1px solid rgba(41,193,21,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
        }}
      >
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#29C115', flexShrink: 0 }} className="animate-pulse" />
        <span style={{ fontSize: '9px', color: '#29C115', fontFamily: 'monospace' }}>AI matching against 1,247 open roles...</span>
      </div>
    </div>
  );
}

const features = [
  {
    icon: <BriefcaseIcon />,
    label: 'JOB DASHBOARD',
    title: 'All jobs. One place.',
    description: 'Access thousands of listings from top Michigan employers in a single centralized dashboard. Real-time updates from 1,000+ scraped career pages.',
    sub: 'Browse, filter, and save opportunities before they appear on traditional job boards.',
    mockup: <DashboardMockup />,
    flip: false,
  },
  {
    icon: <TrendingUpIcon />,
    label: 'ANALYTICS',
    title: 'Understand the market.',
    description: 'Gain deep insights into hiring trends, company patterns, and market demand. Track which companies are actively hiring and when they post positions.',
    sub: 'Make data-driven career decisions with comprehensive market intelligence.',
    mockup: <AnalyticsMockup />,
    flip: true,
  },
  {
    icon: <DocumentIcon />,
    label: 'RESUME MATCHING',
    title: 'Jobs matched to you.',
    description: 'Upload your resume and get personalized recommendations powered by AI. Our algorithm analyzes your skills against every open role.',
    sub: 'Stop scrolling through irrelevant listings — see only jobs that match your profile.',
    mockup: <ResumeMatchMockup />,
    flip: false,
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      className="px-6 py-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <FadeIn className="text-center mb-20">
          <div
            className="inline-block text-[10px] font-bold tracking-widest mb-5 px-3 py-1.5 rounded-full"
            style={{
              color: '#29C115',
              background: 'rgba(41,193,21,0.08)',
              border: '1px solid rgba(41,193,21,0.15)',
              letterSpacing: '0.1em',
            }}
          >
            PLATFORM
          </div>
          <h2
            className="text-4xl font-bold text-white"
            style={{ letterSpacing: '-0.03em' }}
          >
            Everything you need to get hired first
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-24">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 100}>
            <div
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              {/* Text side */}
              <div className={feature.flip ? 'md:order-2' : 'md:order-1'}>
                <div className="flex items-center gap-2.5 mb-5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(41,193,21,0.08)', border: '1px solid rgba(41,193,21,0.15)' }}
                  >
                    {feature.icon}
                  </div>
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: '#29C115', letterSpacing: '0.1em' }}
                  >
                    {feature.label}
                  </span>
                </div>
                <h3
                  className="text-[26px] font-bold text-white mb-4"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {feature.title}
                </h3>
                <p className="text-[15px] text-zinc-400 leading-relaxed mb-3">
                  {feature.description}
                </p>
                <p className="text-[14px] leading-relaxed" style={{ color: '#52525b' }}>
                  {feature.sub}
                </p>
              </div>

              {/* Mockup side */}
              <div className={feature.flip ? 'md:order-1' : 'md:order-2'}>
                {feature.mockup}
              </div>
            </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
