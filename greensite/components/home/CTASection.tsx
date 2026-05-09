'use client'

import Image from 'next/image'
import FadeIn from '@/components/ui/FadeIn'

export default function CTASection() {
  return (
    <>
      <section
        id="contact"
        style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.06)', scrollMarginTop: '72px' }}
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

          <div className="grid md:grid-cols-2 gap-5 items-stretch">
            {/* Discord */}
            <FadeIn className="h-full">
            <div
              className="rounded-2xl p-8 h-full"
              style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}
            >
              <div className="mb-6">
                <Image src="/disc.png" alt="Discord" width={40} height={40} className="rounded-xl" />
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
                href="https://discord.gg/SduTEu4C6w"
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
            <FadeIn delay={120} className="h-full">
            <div
              className="rounded-2xl p-8 h-full"
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
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <p className="text-[12px]" style={{ color: '#3f3f3f' }}>
            &copy; 2026 Greenify. Trusted by universities across Michigan.
          </p>
        </div>
      </footer>
    </>
  );
}
