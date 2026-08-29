import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";

export default function AIMatchingSection({ user }: { user?: any }) {
  return (
    <section id="ai-matching" className="relative overflow-hidden px-6 py-40 lg:py-52" style={{ background: '#c8391e' }}>

      {/* Dark green triangle — bottom right */}
      <div
        className="absolute bottom-0 right-0 w-[420px] h-[320px] hidden lg:block"
        style={{
          background: '#1a2e1a',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />

      <div className="mx-auto relative z-10" style={{ width: 'fit-content' }}>
        <div className="flex flex-col lg:flex-row items-center gap-40">
        <FadeIn from="left" style={{ maxWidth: 480 }}>

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
            href="/ai-powered"
            className="inline-flex items-center gap-2 px-4 py-2 text-[15px] font-bold rounded transition-all duration-200 hover:bg-white/90 active:scale-[0.97]"
            style={{ background: '#ffffff', color: '#c8391e' }}
          >
            Set up your AI
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

        </FadeIn>

          {/* Right: Match Score Visual */}
          <FadeIn from="right" delay={150} className="flex-shrink-0 hidden lg:block">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>

              {/* Ring + Score */}
              <div style={{ position: 'relative', width: 260, height: 260 }}>
                {/* Outer faint ring */}
                <svg width="260" height="260" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <circle cx="130" cy="130" r="118" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  {/* Progress arc ~94% = 338deg */}
                  <circle
                    cx="130" cy="130" r="118"
                    fill="none"
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="3"
                    strokeDasharray="741 800"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    transform="rotate(-90 130 130)"
                  />
                </svg>
                {/* Inner content */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 88, fontWeight: 900, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.04em' }}>94<span style={{ fontSize: 48 }}>%</span></div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', marginTop: 6, textTransform: 'uppercase' }}>Match Score</div>
                </div>
              </div>

              {/* Skill chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 340 }}>
                {['Financial Modeling', 'Excel', 'SQL', 'CPA', 'Bloomberg'].map((skill, i) => (
                  <span
                    key={skill}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      borderRadius: 99,
                      padding: '7px 16px',
                      background: i < 4 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
                      color: i < 4 ? '#ffffff' : 'rgba(255,255,255,0.4)',
                      border: i < 4 ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {i < 4 && <span style={{ marginRight: 6, fontSize: 11 }}>✓</span>}{skill}
                  </span>
                ))}
              </div>

              {/* Job label */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Financial Analyst — Comerica Bank</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Detroit, MI · matched against your resume</div>
              </div>

            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
