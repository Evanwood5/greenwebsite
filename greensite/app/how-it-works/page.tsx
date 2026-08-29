import Navbar from "@/components/layout/Navbar";
import WrapperSection from "@/components/home/WrapperSection";

export default function HowItWorksPage() {
  const fields = [
    {
      label: 'Tech',
      color: '#0ea5e9',
      bg: 'rgba(14,165,233,0.08)',
      description: 'Software, data, cloud, and engineering roles across the fastest-growing tech companies in Michigan.',
      subs: ['Software Engineering', 'Data Science / AI', 'Cloud / DevOps', 'Cybersecurity', 'IT / Sysadmin', 'UI / UX', 'QA / Testing', 'Hardware / Embedded', 'Data Engineering'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
      ),
    },
    {
      label: 'Engineering',
      color: '#f97316',
      bg: 'rgba(249,115,22,0.08)',
      description: 'Mechanical, electrical, civil, and manufacturing roles at leading industrial firms in Michigan.',
      subs: ['Mechanical', 'Electrical', 'Manufacturing', 'Civil / Structural', 'Automotive', 'Industrial', 'Chemical', 'Controls', 'Materials', 'Environmental', 'Aerospace', 'Trades'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>
      ),
    },
    {
      label: 'Health',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.08)',
      description: 'Clinical, research, and healthcare administration positions across hospitals and health systems.',
      subs: ['Clinical / Nursing', 'Allied Health', 'Pharmacy', 'Healthcare Administration', 'Research / Lab', 'Medical Technology', 'Public Health'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
    },
    {
      label: 'Business',
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.08)',
      description: 'Finance, consulting, operations, and management opportunities at top Michigan employers.',
      subs: ['Marketing / Sales', 'Operations / Logistics', 'Finance / Accounting', 'Project Management', 'Banking / Finance', 'Consulting / Strategy', 'HR / Recruiting', 'Business Analytics'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f0ece4' }}>
      <Navbar />
      <div style={{ background: '#f0ece4', padding: '16px 120px 0' }}>
        <WrapperSection />
      </div>

      {/* What We Track */}
      <section id="what-we-track" className="px-6 py-28" style={{ background: '#f0ece4' }}>
        <div className="max-w-5xl mx-auto">

          <div className="mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: '#29C115' }}>
              What We Track
            </p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <h2 className="text-5xl font-extrabold" style={{ color: '#1a2e1a', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
                Four fields.<br />One platform.
              </h2>
              <p className="text-[15px] max-w-xs leading-relaxed" style={{ color: '#5a7a5a' }}>
                Every subcategory below maps to a real filter in your dashboard.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((f, i) => (
              <div
                key={f.label}
                className="rounded-2xl px-8 py-7"
                style={{ background: '#ffffff', border: '1px solid rgba(30,58,30,0.07)' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: f.bg, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <div className="text-[20px] font-extrabold" style={{ color: '#1a2e1a', letterSpacing: '-0.02em' }}>
                    {f.label}
                  </div>
                  <div className="ml-auto text-[12px] font-bold" style={{ color: 'rgba(30,58,30,0.25)' }}>0{i + 1}</div>
                </div>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#5a7a5a' }}>{f.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.subs.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                      style={{ background: f.bg, color: f.color }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <footer
        style={{ borderTop: '1px solid rgba(30,58,30,0.3)' }}
        className="px-6 py-6"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-[13px] font-semibold" style={{ color: 'rgba(30,58,30,0.85)' }}>
            &copy; 2026 Greenify LLC
          </p>
          <a href="/terms" className="text-[13px] font-semibold transition-opacity hover:opacity-70" style={{ color: 'rgba(30,58,30,0.85)' }}>
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}
