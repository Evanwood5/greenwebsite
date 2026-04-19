'use client'

const testimonials = [
  {
    name: 'Sarah Chen',
    school: 'University of Michigan',
    company: 'Microsoft',
    avatar: 'https://i.pravatar.cc/48?img=47',
    quote: (
      <>
        I got my offer from{' '}
        <span style={{ color: '#29C115', fontWeight: 500 }}>Microsoft</span> two weeks before their official campus recruitment started.{' '}
        <span style={{ color: '#29C115', fontWeight: 500 }}>Greenify&apos;s real-time tracking</span>{' '}
        caught the posting the moment it went live — before LinkedIn, Indeed, or any other platform.
      </>
    ),
  },
  {
    name: 'Marcus Williams',
    school: 'Michigan State University',
    company: 'Google',
    avatar: 'https://i.pravatar.cc/48?img=12',
    quote: (
      <>
        Applied to{' '}
        <span style={{ color: '#29C115', fontWeight: 500 }}>Google&apos;s SWE role</span> through Greenify 3 days before it showed up on Handshake. The{' '}
        <span style={{ color: '#29C115', fontWeight: 500 }}>early application</span>{' '}
        gave me a competitive edge — I was already in interviews while others were just discovering the role.
      </>
    ),
  },
  {
    name: 'Priya Patel',
    school: 'Wayne State University',
    company: 'Tesla',
    avatar: 'https://i.pravatar.cc/48?img=32',
    quote: (
      <>
        Secured my{' '}
        <span style={{ color: '#29C115', fontWeight: 500 }}>Tesla position</span> before it was posted publicly.{' '}
        <span style={{ color: '#29C115', fontWeight: 500 }}>Greenify&apos;s direct scraping</span>{' '}
        found the internal listing first. By the time it hit major job boards, I was already at the final interview stage.
      </>
    ),
  },
];

export default function StatsSection() {
  return (
    <section
      style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      className="px-6 py-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-block text-[10px] font-bold tracking-widest mb-5 px-3 py-1.5 rounded-full"
            style={{
              color: '#29C115',
              background: 'rgba(41,193,21,0.08)',
              border: '1px solid rgba(41,193,21,0.15)',
              letterSpacing: '0.1em',
            }}
          >
            SUCCESS STORIES
          </div>
          <h2
            className="text-4xl font-bold text-white"
            style={{ letterSpacing: '-0.03em' }}
          >
            Students who got hired first
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl p-6 flex flex-col"
              style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Large quote mark */}
              <div
                style={{
                  fontSize: '48px',
                  lineHeight: 1,
                  color: 'rgba(41,193,21,0.2)',
                  fontFamily: 'Georgia, serif',
                  marginBottom: '8px',
                }}
              >
                &ldquo;
              </div>

              <p
                className="text-[14px] leading-relaxed flex-1"
                style={{ color: '#a1a1aa' }}
              >
                {t.quote}
              </p>

              {/* Author row */}
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '16px',
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  width={34}
                  height={34}
                  className="rounded-full object-cover"
                  style={{ width: '34px', height: '34px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-[13px] font-semibold text-white truncate">{t.name}</div>
                  <div className="text-[11px] truncate" style={{ color: '#52525b' }}>{t.school}</div>
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#29C115',
                    background: 'rgba(41,193,21,0.08)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(41,193,21,0.12)',
                    flexShrink: 0,
                  }}
                >
                  {t.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
