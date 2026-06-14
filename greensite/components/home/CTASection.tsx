'use client'

import Image from 'next/image'
import FadeIn from '@/components/ui/FadeIn'

export default function CTASection() {
  return (
    <>
      <section
        id="contact"
        style={{ background: '#f0ece4', borderTop: '1px solid rgba(30,58,30,0.08)', scrollMarginTop: '72px' }}
        className="px-6 py-24"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <FadeIn className="text-center mb-16">
            <div
              className="inline-flex items-center justify-center text-[10px] font-bold tracking-widest mb-6 px-4 py-1.5 rounded-full"
              style={{
                color: '#1a2e1a',
                background: 'rgba(30,58,30,0.08)',
                border: '1px solid rgba(30,58,30,0.18)',
                letterSpacing: '0.1em',
              }}
            >
              CONTACT
            </div>
            <h2
              className="text-5xl font-bold mb-6"
              style={{ letterSpacing: '-0.03em', color: '#1a2e1a' }}
            >
              Get in touch
            </h2>
            <p className="text-[15px] leading-relaxed max-w-lg mx-auto mb-10" style={{ color: '#4a5c4a' }}>
              We&apos;d love to hear from you. Choose the best way to reach us and our team will get back to you soon.
            </p>
            <div className="flex justify-center items-center">
              <div style={{ height: '1px', width: '40px', background: 'linear-gradient(90deg, transparent, rgba(30,58,30,0.3))' }} />
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#1a2e1a' }} />
              <div style={{ height: '1px', width: '40px', background: 'linear-gradient(90deg, rgba(30,58,30,0.3), transparent)' }} />
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Discord */}
            <FadeIn className="h-full">
            <div
              className="rounded-2xl p-8 h-full flex flex-col relative overflow-hidden"
              style={{ background: '#ffffff', border: '1px solid rgba(30,58,30,0.1)', boxShadow: '0 2px 20px rgba(30,58,30,0.06)' }}
            >
              <div className="absolute -top-20 -left-20 w-[200px] h-[200px] rounded-full pointer-events-none" style={{ background: 'rgba(88,101,242,0.06)', filter: 'blur(60px)' }} />

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(88,101,242,0.08)', border: '1px solid rgba(88,101,242,0.18)' }}
                >
                  <Image src="/disc.png" alt="Discord" width={24} height={24} />
                </div>
                <div
                  className="inline-flex items-center gap-1.5 text-[9px] font-bold px-3 py-1.5 rounded-full"
                  style={{ color: '#5865F2', background: 'rgba(88,101,242,0.08)', border: '1px solid rgba(88,101,242,0.18)', letterSpacing: '0.05em' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  FAST REPLY
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 relative z-10" style={{ letterSpacing: '-0.01em', color: '#1a2e1a' }}>Community Support</h3>
              <p className="text-[14px] leading-relaxed mb-8 relative z-10" style={{ color: '#4a5c4a' }}>
                For personal support, questions, or technical issues, join our Discord. Our team and fellow students are ready to help you get the most out of Greenify.
              </p>

              <div className="flex flex-col gap-4 mb-10 relative z-10 flex-1">
                {[
                  { icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>, text: 'Get help from our team' },
                  { icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></>, text: 'Connect with other students' },
                  { icon: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></>, text: 'Stay updated on new features' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5865F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {item.icon}
                    </svg>
                    <span className="text-[13px]" style={{ color: '#4a5c4a' }}>{item.text}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://discord.gg/SduTEu4C6w"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-white rounded-xl transition-all duration-200 cursor-pointer relative z-10 w-fit"
                style={{ background: 'linear-gradient(90deg, #5865F2, #7a86f7)' }}
              >
                Join Discord
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
            </FadeIn>

            {/* University */}
            <FadeIn delay={120} className="h-full">
            <div
              className="rounded-2xl p-8 h-full flex flex-col relative overflow-hidden"
              style={{ background: '#ffffff', border: '1px solid rgba(30,58,30,0.1)', boxShadow: '0 2px 20px rgba(30,58,30,0.06)' }}
            >
              <div className="absolute -top-20 -left-20 w-[200px] h-[200px] rounded-full pointer-events-none" style={{ background: 'rgba(249,115,22,0.06)', filter: 'blur(60px)' }} />

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.18)' }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <div
                  className="inline-flex items-center gap-1.5 text-[9px] font-bold px-3 py-1.5 rounded-full"
                  style={{ color: '#F97316', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.18)', letterSpacing: '0.05em' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  PARTNERSHIPS
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 relative z-10" style={{ letterSpacing: '-0.01em', color: '#1a2e1a' }}>University Partnerships</h3>
              <p className="text-[14px] leading-relaxed mb-8 relative z-10" style={{ color: '#4a5c4a' }}>
                Interested in bringing Greenify to your students? We&apos;d love to partner with your institution to deliver exclusive job tracking services.
              </p>

              <div className="flex flex-col gap-4 mb-10 relative z-10 flex-1">
                {[
                  { icon: <><polygon points="12 2 2 7 22 7 12 2"></polygon><polyline points="2 17 22 17"></polyline><polyline points="2 22 22 22"></polyline><line x1="6" y1="17" x2="6" y2="9"></line><line x1="10" y1="17" x2="10" y2="9"></line><line x1="14" y1="17" x2="14" y2="9"></line><line x1="18" y1="17" x2="18" y2="9"></line></>, text: 'Exclusive student access' },
                  { icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>, text: 'Campus-wide insights' },
                  { icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></>, text: 'Trusted & secure platform' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {item.icon}
                    </svg>
                    <span className="text-[13px]" style={{ color: '#4a5c4a' }}>{item.text}</span>
                  </div>
                ))}
              </div>

              <a
                href="mailto:partnerships@greenify.io"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[14px] font-medium rounded-xl transition-all duration-200 cursor-pointer relative z-10 w-fit"
                style={{ border: '1px solid rgba(30,58,30,0.2)', background: 'transparent', color: '#1a2e1a' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(30,58,30,0.06)' }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                Get in touch
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <footer
        style={{ background: '#f0ece4', borderTop: '1px solid rgba(30,58,30,0.08)' }}
        className="px-6 py-6"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <p className="text-[12px]" style={{ color: 'rgba(30,58,30,0.4)' }}>
            &copy; 2026 Greenify. Trusted by universities across Michigan.
          </p>
        </div>
      </footer>
    </>
  );
}
