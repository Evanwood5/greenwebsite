'use client'

import Link from "next/link";

interface HeroSectionProps {
  user?: any;
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative px-6 pt-10 pb-20 lg:pt-12 lg:pb-28 overflow-hidden" style={{ background: '#000000' }}>
      {/* Background radial glows for depth */}
      <div 
        className="absolute top-0 right-0 w-[900px] h-[900px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 70% 30%, rgba(41,193,21,0.07) 0%, transparent 60%)',
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 70%, rgba(41,193,21,0.04) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 relative z-10">
        
        {/* Left Column: Content */}
        <div className="flex-1 lg:flex-[0.8] text-center lg:text-left">



          {/* Headline with gradient */}
          <h1
            className="text-5xl md:text-6xl lg:text-[66px] font-extrabold leading-[1.03] mb-7"
            style={{ letterSpacing: '-0.045em' }}
          >
            <span className="text-white">Michigan&apos;s Best</span>
            <br />
            <span 
              style={{ 
                background: 'linear-gradient(135deg, #29C115 0%, #5eea4a 50%, #29C115 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Job Platform
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[17px] lg:text-[18px] text-zinc-400 leading-[1.7] max-w-lg lg:mx-0 mx-auto mb-10">
            Real-time job tracking directly from company career pages. 
            Discover opportunities before they hit major job boards.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap lg:justify-start justify-center gap-4 mb-14">
            {user ? (
              <>
                <Link
                  href="/jobs"
                  className="flex items-center gap-2.5 px-7 py-3 text-[15px] font-bold text-[#29C115] rounded-xl transition-all duration-200 cursor-pointer hover:bg-[#0f2e14] active:scale-[0.97]"
                  style={{ background: '#0a1f0d', border: '1px solid #29C115' }}
                >
                  View Jobs
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="flex items-center gap-2.5 px-7 py-3 text-[15px] font-bold text-[#29C115] rounded-xl transition-all duration-200 cursor-pointer hover:bg-[#0f2e14] active:scale-[0.97]"
                  style={{ background: '#0a1f0d', border: '1px solid #29C115' }}
                >
                  Start for Free
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link
                  href="#contact"
                  className="px-7 py-3 text-[15px] font-semibold text-zinc-300 rounded-xl transition-all duration-200 cursor-pointer hover:text-white hover:border-white/20 active:scale-[0.97]"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                >
                  Contact Us
                </Link>
              </>
            )}
          </div>

          {/* Stats row */}
          <div
            className="flex flex-wrap lg:justify-start justify-center gap-10 pt-8"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {[
              { value: '1,000+', label: 'Companies tracked' },
              { value: 'Real-time', label: 'Job updates' },
              { value: 'AI-powered', label: 'Resume matching' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-[16px] font-bold text-white tracking-tight">{stat.value}</div>
                <div className="text-[11px] text-zinc-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Hero visual — seamless blending */}
        <div className="flex-1 lg:flex-[1.2] w-full max-w-2xl relative order-first lg:order-last">
          {/* Soft radial glow behind image */}
          <div 
            className="absolute -inset-16 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(41,193,21,0.12) 0%, transparent 70%)',
            }}
          />
          
          <img 
            src="/up.png" 
            alt="Michigan Job Tracking Map" 
            className="w-full h-auto relative z-10"
            style={{ 
              filter: 'drop-shadow(0 0 40px rgba(41,193,21,0.15))',
            }}
          />
        </div>
      </div>
    </section>
  );
}
