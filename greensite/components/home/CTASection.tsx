const fields = [
  {
    label: 'Technology',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    description: 'Software, data, cloud, and engineering roles across the fastest-growing tech companies in Michigan.',
    color: '#29C115',
  },
  {
    label: 'Business',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    description: 'Finance, consulting, operations, and management opportunities at top Michigan employers.',
    color: '#2563EB',
  },
  {
    label: 'Health',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 1 0 0 14A7 7 0 0 0 12 2z"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    description: 'Clinical, research, and healthcare administration positions across hospitals and health systems.',
    color: '#DC2626',
  },
  {
    label: 'Engineering',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    description: 'Mechanical, electrical, civil, and manufacturing roles at leading industrial firms in Michigan.',
    color: '#D97706',
  },
]

export default function CTASection() {
  return (
    <>
      <section
        style={{ background: '#f0ece4', borderTop: '1px solid rgba(30,58,30,0.08)' }}
        className="px-6 py-24"
      >
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: '#29C115' }}>
              What We Track
            </p>
            <h2
              className="text-5xl font-extrabold mb-5"
              style={{ color: '#1a2e1a', letterSpacing: '-0.04em' }}
            >
              Four fields.<br />One platform.
            </h2>
            <p className="text-[16px] max-w-lg mx-auto leading-relaxed" style={{ color: '#5a7a5a' }}>
              Greenify monitors company career pages in real-time across the fields that matter most to Michigan students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fields.map((f) => (
              <div
                key={f.label}
                className="rounded-xl p-6 flex flex-col gap-4"
                style={{ background: '#ffffff', border: '1px solid rgba(30,58,30,0.08)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${f.color}18`, color: f.color }}
                >
                  {f.icon}
                </div>
                <div>
                  <div className="text-[15px] font-bold mb-2" style={{ color: '#1a2e1a' }}>{f.label}</div>
                  <p className="text-[13px] leading-relaxed" style={{ color: '#5a7a5a' }}>{f.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <footer
        style={{ background: '#f0ece4', borderTop: '1px solid rgba(30,58,30,0.3)' }}
        className="px-6 py-6"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-[13px] font-semibold" style={{ color: 'rgba(30,58,30,0.85)' }}>
            &copy; 2026 Greenify. Trusted by universities across Michigan.
          </p>
          <a
            href="/terms"
            className="text-[13px] font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'rgba(30,58,30,0.85)' }}
          >
            Terms of Service
          </a>
        </div>
      </footer>
    </>
  )
}
