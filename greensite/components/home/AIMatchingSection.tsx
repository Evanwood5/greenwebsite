import Link from "next/link";

export default function AIMatchingSection() {
  return (
    <section id="ai-matching" className="relative overflow-hidden px-6 py-24 lg:py-32" style={{ background: '#c8391e' }}>

      {/* Dark green triangle — bottom right */}
      <div
        className="absolute bottom-0 right-0 w-[420px] h-[320px] hidden lg:block"
        style={{
          background: '#1a2e1a',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">

          {/* Label */}
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-6 text-white/80">
            AI Powered
          </p>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-white leading-[1.08] mb-6" style={{ letterSpacing: '-0.03em' }}>
            Built for<br />Job Seekers
          </h2>

          {/* Subheadline with left border */}
          <div className="mb-10 pl-4" style={{ borderLeft: '3px solid rgba(255,255,255,0.4)' }}>
            <p className="text-xl text-white/80 leading-relaxed">
              Let AI find your best opportunities.
            </p>
          </div>

          {/* Bullets */}
          <ul className="space-y-4 mb-12">
            {[
              'Resume matching',
              'Personalized recommendations',
              'Skill alignment',
              'Job fit scoring',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.6)' }} />
                <span className="text-[17px] text-white/80">{item}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 text-[15px] font-bold rounded transition-all duration-200 hover:bg-white/90 active:scale-[0.97]"
            style={{ background: '#ffffff', color: '#c8391e' }}
          >
            Explore Jobs
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

        </div>

          {/* Right: AI image card */}
          <div className="flex-shrink-0 hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#ffffff', padding: '24px', width: '680px' }}>
              <img
                src="/updatee.png"
                alt="AI Powered"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
