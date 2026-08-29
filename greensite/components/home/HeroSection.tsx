'use client'

import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";

interface HeroSectionProps {
  user?: any;
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden" style={{ background: '#f0ece4', minHeight: '780px' }}>

      {/* Left vertical dots */}
      <div className="absolute left-14 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10 hidden lg:flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#1e3a1e', opacity: i === 2 ? 0.8 : 0.25 }}
          />
        ))}
      </div>



      {/* Floating job cards — right side */}
      <style>{`
        @keyframes float0 { 0%,100%{transform:translateY(0px) rotate(-1deg)} 50%{transform:translateY(-14px) rotate(-1deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0px) rotate(1.5deg)} 50%{transform:translateY(-10px) rotate(1.5deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px) rotate(-0.5deg)} 50%{transform:translateY(-18px) rotate(-0.5deg)} }
        @keyframes pulseGreen { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div className="absolute right-0 top-0 bottom-0 w-[42%] hidden lg:flex items-center justify-start overflow-hidden" style={{ pointerEvents: 'none', paddingLeft: '0px' }}>
        <div style={{ position: 'relative', width: 360, height: 480 }}>

          {/* Card 1 — top left */}
          <div style={{
            position: 'absolute', top: 20, left: 0, width: 300,
            background: '#ffffff', borderRadius: 16, padding: '18px 20px',
            boxShadow: '0 8px 32px rgba(30,58,30,0.13)',
            border: '1px solid rgba(30,58,30,0.08)',
            animation: 'float0 5.5s ease-in-out infinite',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2e1a', marginBottom: 2 }}>Software Engineer</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Ford Motor Co · Dearborn, MI</div>
              </div>
              <div style={{ background: 'rgba(26,122,10,0.1)', border: '1px solid rgba(26,122,10,0.35)', borderRadius: 8, padding: '3px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#1a7a0a', lineHeight: 1 }}>91%</div>
                <div style={{ fontSize: 8, color: '#1a7a0a', fontWeight: 600 }}>MATCH</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['React', 'TypeScript', 'AWS'].map(s => (
                <span key={s} style={{ fontSize: 10, fontWeight: 600, borderRadius: 99, padding: '2px 8px', background: '#f3f4f6', color: '#374151' }}>{s}</span>
              ))}
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1a7a0a', animation: 'pulseGreen 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 10, color: '#6b7280' }}>Posted 2 hours ago</span>
            </div>
          </div>

          {/* Card 2 — middle right */}
          <div style={{
            position: 'absolute', top: 160, right: 0, width: 290,
            background: '#ffffff', borderRadius: 16, padding: '18px 20px',
            boxShadow: '0 8px 32px rgba(30,58,30,0.13)',
            border: '1px solid rgba(30,58,30,0.08)',
            animation: 'float1 6.5s ease-in-out infinite',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2e1a', marginBottom: 2 }}>Financial Analyst</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Comerica Bank · Detroit, MI</div>
              </div>
              <div style={{ background: 'rgba(26,122,10,0.1)', border: '1px solid rgba(26,122,10,0.35)', borderRadius: 8, padding: '3px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#1a7a0a', lineHeight: 1 }}>87%</div>
                <div style={{ fontSize: 8, color: '#1a7a0a', fontWeight: 600 }}>MATCH</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Excel', 'SQL', 'CPA'].map(s => (
                <span key={s} style={{ fontSize: 10, fontWeight: 600, borderRadius: 99, padding: '2px 8px', background: '#f3f4f6', color: '#374151' }}>{s}</span>
              ))}
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1a7a0a', animation: 'pulseGreen 2.4s ease-in-out infinite' }} />
              <span style={{ fontSize: 10, color: '#6b7280' }}>Posted 5 hours ago</span>
            </div>
          </div>

          {/* Card 3 — bottom left */}
          <div style={{
            position: 'absolute', bottom: 20, left: 10, width: 285,
            background: '#ffffff', borderRadius: 16, padding: '18px 20px',
            boxShadow: '0 8px 32px rgba(30,58,30,0.13)',
            border: '1px solid rgba(30,58,30,0.08)',
            animation: 'float2 7s ease-in-out infinite',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2e1a', marginBottom: 2 }}>Mechanical Engineer</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Stellantis · Auburn Hills, MI</div>
              </div>
              <div style={{ background: 'rgba(26,122,10,0.1)', border: '1px solid rgba(26,122,10,0.35)', borderRadius: 8, padding: '3px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#1a7a0a', lineHeight: 1 }}>78%</div>
                <div style={{ fontSize: 8, color: '#1a7a0a', fontWeight: 600 }}>MATCH</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['CAD', 'FEA', 'MATLAB'].map(s => (
                <span key={s} style={{ fontSize: 10, fontWeight: 600, borderRadius: 99, padding: '2px 8px', background: '#f3f4f6', color: '#374151' }}>{s}</span>
              ))}
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1a7a0a', animation: 'pulseGreen 1.8s ease-in-out infinite' }} />
              <span style={{ fontSize: 10, color: '#6b7280' }}>Posted 1 day ago</span>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-32 lg:py-40 flex items-center relative z-10">

        {/* Content column */}
        <div className="w-full lg:w-[58%] text-center lg:text-left">

          <FadeIn delay={0}>
          <h1
            className="text-5xl md:text-6xl lg:text-[66px] font-extrabold leading-[1.03] mb-7"
            style={{ letterSpacing: '-0.045em' }}
          >
            <span style={{ color: '#1a2e1a' }}>Michigan&apos;s Best</span>
            <br />
            <span style={{ color: '#2d6e28' }}>Job Platform</span>
          </h1>

          <p
            className="text-[17px] lg:text-[18px] leading-[1.7] max-w-lg lg:mx-0 mx-auto mb-10"
            style={{ color: '#4a5e4a' }}
          >
            Real-time job tracking directly from company career pages.{' '}
            Discover opportunities before they hit major job boards.
          </p>

          <div className="flex flex-wrap lg:justify-start justify-center items-center gap-5 mb-14">
            <Link
              href={user ? "/jobs" : "/auth"}
              className="flex items-center gap-2 px-4 py-2 text-[15px] font-bold text-white rounded transition-all duration-200 active:scale-[0.97]"
              style={{ background: '#1a2e1a' }}
            >
              {user ? 'View Jobs' : 'Start for Free'}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>

            <span
              className="flex items-center gap-2 text-[22px] font-bold tracking-wide"
              style={{ color: '#c8391e' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              It&apos;s free
            </span>
          </div>

          <div
            className="flex flex-wrap lg:justify-start justify-center gap-10 pt-8"
            style={{ borderTop: '1px solid rgba(30,58,30,0.12)' }}
          >
            {[
              { value: '100+', label: 'Companies tracked' },
              { value: 'Real-time', label: 'Job updates' },
              { value: 'AI-powered', label: 'Resume matching' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-[16px] font-bold tracking-tight" style={{ color: '#1a2e1a' }}>{stat.value}</div>
                <div className="text-[11px] font-medium mt-1" style={{ color: '#7a9a7a' }}>{stat.label}</div>
              </div>
            ))}
          </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
