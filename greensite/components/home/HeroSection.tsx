'use client'

import Link from "next/link";

interface HeroSectionProps {
  user?: any;
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden" style={{ background: '#f0ece4', minHeight: '580px' }}>

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



      {/* Right dark green decorative panel */}
      <div className="absolute right-0 top-0 bottom-0 w-[320px] xl:w-[400px] hidden lg:block" style={{ background: '#1e3a1e' }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28 flex items-center relative z-10">

        {/* Content column */}
        <div className="w-full lg:w-[58%] text-center lg:text-left">

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
              style={{ background: '#1e3a1e' }}
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
              { value: '1,000+', label: 'Companies tracked' },
              { value: 'Real-time', label: 'Job updates' },
              { value: 'AI-powered', label: 'Resume matching' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-[16px] font-bold tracking-tight" style={{ color: '#1a2e1a' }}>{stat.value}</div>
                <div className="text-[11px] font-medium mt-1" style={{ color: '#7a9a7a' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
