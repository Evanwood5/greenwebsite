'use client'

import FadeIn from '@/components/ui/FadeIn'

export default function CTASection() {
  return (
    <>
      <section
        id="contact"
        style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        className="px-6 py-24"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
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
              CONTACT
            </div>
            <h2
              className="text-4xl font-bold text-white"
              style={{ letterSpacing: '-0.03em' }}
            >
              Get in touch
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Discord */}
            <FadeIn>
            <div
              className="rounded-2xl p-8"
              style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.2)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#7c83f7">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
                </svg>
              </div>
              <h3
                className="text-[17px] font-bold text-white mb-2"
                style={{ letterSpacing: '-0.01em' }}
              >
                Community Support
              </h3>
              <p className="text-[14px] leading-relaxed mb-7" style={{ color: '#71717a' }}>
                For personal support, questions, or technical issues, join our Discord. Our team and fellow students are ready to help you get the most out of Greenify.
              </p>
              <a
                href="https://discord.gg/greenify"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1.5 text-[13px] font-semibold text-white rounded-lg transition-all duration-200 cursor-pointer"
                style={{ background: '#5865F2' }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#4752C4')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#5865F2')}
              >
                Join Discord
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
            </FadeIn>

            {/* University */}
            <FadeIn delay={120}>
            <div
              className="rounded-2xl p-8"
              style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <h3
                className="text-[17px] font-bold text-white mb-2"
                style={{ letterSpacing: '-0.01em' }}
              >
                University Partnerships
              </h3>
              <p className="text-[14px] leading-relaxed mb-7" style={{ color: '#71717a' }}>
                Interested in bringing Greenify to your students? We&apos;d love to partner with your institution to deliver exclusive job tracking services to your university.
              </p>
              <a
                href="mailto:partnerships@greenify.io"
                className="inline-flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium text-zinc-300 rounded-lg transition-all duration-200 cursor-pointer"
                style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >
                Get in touch
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <footer
        style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        className="px-6 py-6"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="14" rx="2" stroke="#29C115" strokeWidth="2"/>
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#29C115" strokeWidth="2"/>
            </svg>
            <span className="text-[13px] font-medium" style={{ color: '#3f3f3f' }}>Greenify</span>
          </div>
          <p className="text-[12px]" style={{ color: '#3f3f3f' }}>
            &copy; 2026 Greenify. Trusted by universities across Michigan.
          </p>
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            aria-label="Help"
          >
            <span className="text-xs font-bold" style={{ color: '#52525b' }}>?</span>
          </button>
        </div>
      </footer>
    </>
  );
}
