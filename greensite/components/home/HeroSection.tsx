'use client'

import Link from "next/link";

interface HeroSectionProps {
  user?: any;
}

function HeroMockup() {
  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{ border: '2px solid #22c55e', background: '#111', padding: '16px', minHeight: '180px' }}
    >
      <div style={{ marginBottom: '20px' }}>
        <div style={{ background: '#e05252', height: '10px', borderRadius: '4px', width: '75%' }} />
      </div>
      <div className="relative" style={{ marginBottom: '20px' }}>
        <div style={{ background: '#d97706', height: '10px', borderRadius: '4px', width: '88%' }} />
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      </div>
      <div>
        <div style={{ background: '#3b82f6', height: '10px', borderRadius: '4px', width: '55%' }} />
      </div>
    </div>
  );
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <section style={{ background: '#1a1a1a' }} className="px-6 py-14 md:py-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            <span className="text-green-400">Michigan&apos;s</span>{' '}
            <span className="text-white">Best</span>
            <br />
            <span className="text-white">Job Search Platform</span>
          </h1>

          <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-lg">
            Greenify tracks over{' '}
            <span className="text-green-400">1,000 company career pages</span>
            , processing them in{' '}
            <span className="text-orange-400">real-time</span>
            {' '}to deliver powerful analytics and job opportunities that precisely match your skills and experience.
          </p>

          <div className="flex flex-wrap gap-4">
            {user ? (
              <>
                <Link
                  href="/jobs"
                  className="px-6 py-3 text-white font-semibold border border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                >
                  Get Started
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 text-white font-semibold border border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                >
                  Contact Us
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="px-6 py-3 text-white font-semibold border border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                >
                  Get Started
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link
                  href="#contact"
                  className="px-6 py-3 text-white font-semibold border border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                >
                  Contact Us
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hidden md:block">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}
