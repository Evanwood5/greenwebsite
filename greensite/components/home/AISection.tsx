import Link from "next/link";

export default function AISection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 lg:py-32" style={{ background: '#0f2510' }}>

      {/* Top-left decorative dots */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">

          {/* Label */}
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-6" style={{ color: '#29C115' }}>
            Real-Time Insight
          </p>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-white leading-[1.08] mb-6" style={{ letterSpacing: '-0.03em' }}>
            Find Jobs Before<br />Anyone Else
          </h2>

          {/* Subheadline with left border */}
          <div className="mb-10 pl-4" style={{ borderLeft: '3px solid rgba(255,255,255,0.25)' }}>
            <p className="text-xl text-white/80 leading-relaxed">
              Discover jobs before everyone else.
            </p>
          </div>

          {/* Bullet points */}
          <ul className="space-y-4 mb-12">
            {[
              'Real-time dashboard',
              'Real-time analytics',
              'Fresh job postings',
              'Company monitoring',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)' }} />
                <span className="text-[17px] text-white/75">{item}</span>
              </li>
            ))}
          </ul>

          {/* CTA link */}
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 text-[15px] font-semibold transition-all duration-200 hover:gap-3"
            style={{ color: '#29C115' }}
          >
            How It Works
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

        </div>

          {/* Right: dashboard image */}
          <div className="flex-shrink-0 hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#ffffff', padding: '24px', width: '700px' }}>
              <img
                src="/better.png"
                alt="Dashboard"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
