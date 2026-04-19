'use client'

import Link from "next/link";

interface HeroSectionProps {
  user?: any;
}

function HeroMockup() {
  const jobs = [
    { company: 'Microsoft', role: 'Software Engineer Intern', time: 'Just now', isNew: true },
    { company: 'Google', role: 'SWE — New Grad', time: '2h ago', isNew: false },
    { company: 'Tesla', role: 'Data Engineer', time: '5h ago', isNew: false },
    { company: 'Amazon', role: 'Product Manager', time: '8h ago', isNew: false },
  ];

  return (
    <div
      className="w-full rounded-2xl"
      style={{
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '20px',
      }}
    >
      {/* Window chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '18px' }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#2a2a2a' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#2a2a2a' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#2a2a2a' }} />
        <div
          style={{
            flex: 1,
            height: '22px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '6px',
            marginLeft: '8px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '10px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <span style={{ fontSize: '9px', color: '#3f3f3f', fontFamily: 'monospace' }}>greenify.io/jobs</span>
        </div>
      </div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#e4e4e7', letterSpacing: '-0.01em' }}>Live Job Feed — Michigan</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#29C115' }}
            className="animate-pulse"
          />
          <span style={{ fontSize: '9px', color: '#52525b' }}>Live</span>
        </div>
      </div>

      {/* Job rows */}
      {jobs.map((job, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            background: i === 0 ? 'rgba(41,193,21,0.05)' : 'rgba(255,255,255,0.02)',
            borderRadius: '8px',
            marginBottom: i < jobs.length - 1 ? '6px' : 0,
            border: i === 0 ? '1px solid rgba(41,193,21,0.12)' : '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#e4e4e7', marginBottom: '2px' }}>{job.role}</div>
            <div style={{ fontSize: '10px', color: '#71717a' }}>{job.company}</div>
          </div>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 600,
              color: job.isNew ? '#29C115' : '#52525b',
              background: job.isNew ? 'rgba(41,193,21,0.1)' : 'rgba(255,255,255,0.04)',
              padding: '3px 8px',
              borderRadius: '4px',
              border: job.isNew ? '1px solid rgba(41,193,21,0.15)' : '1px solid transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {job.isNew ? '● New' : job.time}
          </div>
        </div>
      ))}

      {/* Scanning footer */}
      <div
        style={{
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#29C115', flexShrink: 0 }} className="animate-pulse" />
        <span style={{ fontSize: '9px', color: '#3f3f3f', fontFamily: 'monospace' }}>
          Scanning 1,000+ career pages in real-time
        </span>
      </div>
    </div>
  );
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <section style={{ background: '#080808' }} className="px-6 pt-20 pb-28">
      <div className="max-w-6xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(41,193,21,0.08)',
              border: '1px solid rgba(41,193,21,0.15)',
              color: '#29C115',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#29C115' }} />
            Now tracking 1,000+ Michigan company career pages
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h1
            className="text-5xl md:text-6xl lg:text-[70px] font-bold leading-[1.06]"
            style={{ letterSpacing: '-0.035em' }}
          >
            <span className="text-white">Michigan&apos;s Best</span>
            <br />
            <span style={{ color: '#29C115' }}>Job Platform</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="text-center text-[17px] text-zinc-400 leading-relaxed max-w-xl mx-auto mb-10"
          style={{ letterSpacing: '-0.01em' }}
        >
          Real-time job tracking from 1,000+ company career pages. Get notified before jobs appear on LinkedIn or Indeed — and get hired first.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {user ? (
            <>
              <Link
                href="/jobs"
                className="flex items-center gap-2 px-4 py-1.5 text-[14px] font-semibold text-white rounded-lg transition-all duration-200 cursor-pointer"
                style={{ background: '#22a010' }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#1a8a0d')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#22a010')}
              >
                View Jobs
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-1.5 text-[14px] font-medium text-zinc-300 rounded-lg transition-all duration-200 cursor-pointer"
                style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="flex items-center gap-2 px-4 py-1.5 text-[14px] font-semibold text-white rounded-lg transition-all duration-200 cursor-pointer"
                style={{ background: '#22a010' }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#1a8a0d')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#22a010')}
              >
                Get started — it&apos;s free
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link
                href="#contact"
                className="px-4 py-1.5 text-[14px] font-medium text-zinc-300 rounded-lg transition-all duration-200 cursor-pointer"
                style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >
                Contact Us
              </Link>
            </>
          )}
        </div>

        {/* Stats row */}
        <div
          className="flex flex-wrap justify-center gap-10 mb-20"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}
        >
          {[
            { value: '1,000+', label: 'Career pages tracked' },
            { value: 'Real-time', label: 'Job updates' },
            { value: 'AI-powered', label: 'Resume matching' },
            { value: 'Michigan', label: 'Focused platform' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-[15px] font-semibold text-white"
                style={{ letterSpacing: '-0.02em' }}
              >
                {stat.value}
              </div>
              <div className="text-[12px] text-zinc-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Hero visual */}
        <div className="max-w-md mx-auto">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}
