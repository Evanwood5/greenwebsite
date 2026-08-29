import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function AIPoweredPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="px-6 pt-40 pb-28 text-center" style={{ background: '#f0ece4' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: '#29C115' }}>
            AI Powered
          </p>
          <h1 className="text-5xl md:text-[64px] font-extrabold leading-[1.05] mb-6" style={{ letterSpacing: '-0.04em', color: '#1a2e1a' }}>
            Your resume.<br />
            <span style={{ color: '#2d6e28' }}>Your matches.</span>
          </h1>
          <p className="text-[18px] leading-relaxed max-w-xl mx-auto mb-10" style={{ color: '#4a5e4a' }}>
            Upload your resume once. Greenify analyzes your skills and matches you to real Michigan jobs — not just keyword searches.
          </p>

        </div>
      </section>

      {/* Resume matching detail */}
      <section id="resume-matching" className="px-6 py-36" style={{ background: '#0f2510' }}>
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: '#29C115' }}>
              Resume Matching
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-[1.08]" style={{ letterSpacing: '-0.03em' }}>
              Jobs matched to<br />you, not everyone.
            </h2>
            <div className="mb-8 pl-4" style={{ borderLeft: '3px solid rgba(255,255,255,0.15)' }}>
              <p className="text-[17px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Upload your resume once. Set your preferences. Greenify analyzes your skills and matches you to jobs and company career paths that are actually relevant to you — not just keyword matches.
              </p>
            </div>
            <ul className="space-y-3 mb-10">
              {[
                'Resume-based job matching',
                'Career path recommendations by company',
                'Preferences for field, location, and job type',
                'Matches get smarter the more you use it',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#29C115' }} />
                  <span className="text-[15px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-4 py-2 text-[15px] font-bold rounded transition-all duration-200"
              style={{ background: '#29C115', color: '#ffffff' }}
            >
              Get started free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Resume mockup */}
          <div className="flex-shrink-0 relative" style={{ width: 340 }}>
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
              <div className="flex items-center gap-3 mb-5 pb-5" style={{ borderBottom: '1px solid #f3f4f6' }}>
                <div className="rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ width: 46, height: 46, background: '#000000' }}>JD</div>
                <div>
                  <div className="text-[15px] font-bold" style={{ color: '#111827' }}>John Doe</div>
                  <div className="text-[12px]" style={{ color: '#6b7280' }}>Finance & Accounting · University of Michigan</div>
                </div>
              </div>
              <div className="mb-5">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9ca3af' }}>Experience</div>
                {[
                  { role: 'Finance Intern', co: 'JP Morgan Chase', yr: 'Summer 2025' },
                  { role: 'Analyst Intern', co: 'Deloitte Consulting', yr: '2024-2025' },
                ].map((e) => (
                  <div key={e.role} className="mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold" style={{ color: '#1f2937' }}>{e.role}</span>
                      <span className="text-[10px]" style={{ color: '#9ca3af' }}>{e.yr}</span>
                    </div>
                    <div className="text-[11px]" style={{ color: '#6b7280' }}>{e.co}</div>
                  </div>
                ))}
              </div>
              <div className="mb-5">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {['Excel', 'Financial Modeling', 'SQL', 'Valuation', 'PowerPoint'].map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#f3f4f6', color: '#374151' }}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div style={{ height: 4, background: '#f3f4f6', borderRadius: 3, width: '90%' }} />
                <div style={{ height: 4, background: '#f3f4f6', borderRadius: 3, width: '75%' }} />
                <div style={{ height: 4, background: '#f3f4f6', borderRadius: 3, width: '60%' }} />
              </div>
            </div>
            <div
              className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg"
              style={{ background: '#29C115', boxShadow: '0 0 20px rgba(41,193,21,0.4)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ffffff' }} />
              <span className="text-[11px] font-bold text-white">94% match</span>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: '#f0ece4', borderTop: '1px solid rgba(30,58,30,0.3)' }} className="px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-[13px] font-semibold" style={{ color: '#1a2e1a' }}>Greenify</span>
          <span className="text-[12px]" style={{ color: '#7a9a7a' }}>2026 Greenify LLC</span>
        </div>
      </footer>
    </>
  );
}
