const testimonials = [
  {
    name: 'Evan W',
    school: 'Michigan State University',
    company: 'TechSmith',
    avatar: '/aaaa.JPG',
    color: '#EAB308',
    colorRgb: '234,179,8',
    quote: (
      <>
        Landed my{' '}
        <span style={{ color: '#EAB308', fontWeight: 500 }}>TechSmith summer internship</span> before it appeared on major job boards.{' '}
        <span style={{ color: '#EAB308', fontWeight: 500 }}>Greenify&apos;s real-time tracking</span>{' '}
        caught the posting the moment it went live, giving me a huge head start.
      </>
    ),
  },
  {
    name: 'Anish S',
    school: 'University of Michigan',
    company: 'State of Michigan',
    avatar: '/stroy1.png',
    color: '#3B82F6',
    colorRgb: '59,130,246',
    quote: (
      <>
        Got my full-time offer at the{' '}
        <span style={{ color: '#3B82F6', fontWeight: 500 }}>State of Michigan</span> through Greenify without endlessly scrolling job boards. Its{' '}
        <span style={{ color: '#3B82F6', fontWeight: 500 }}>resume matching</span>{' '}
        surfaced the role immediately. I applied early and got a head start on interviews.
      </>
    ),
  },
  {
    name: 'Ryan A',
    school: 'Michigan State University',
    company: 'Ally Bank',
    avatar: '/story2.png',
    color: '#A855F7',
    colorRgb: '168,85,247',
    quote: (
      <>
        Secured my full-time role at{' '}
        <span style={{ color: '#A855F7', fontWeight: 500 }}>Ally Bank</span> after Greenify&apos;s{' '}
        <span style={{ color: '#A855F7', fontWeight: 500 }}>analytics showed Detroit</span>{' '}
        was a growing hub for tech jobs. I set my preferences to monitor roles there and applied early when the right one came up.
      </>
    ),
  },
  {
    name: 'Jeff S',
    school: 'Michigan State',
    company: 'Jackson National Life',
    avatar: '/story4.png',
    color: '#EF4444',
    colorRgb: '239,68,68',
    quote: (
      <>
        Greenify&apos;s{' '}
        <span style={{ color: '#EF4444', fontWeight: 500 }}>custom resume matching</span> connected my experience with a role at{' '}
        <span style={{ color: '#EF4444', fontWeight: 500 }}>Jackson National Life</span> that closely aligned with my background and career goals. The personalized match helped me discover and apply to the opportunity early.
      </>
    ),
  },
]

function Card({ t, className = '' }: { t: typeof testimonials[0]; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-6 flex flex-col ${className}`}
      style={{
        background: '#f0ece4',
        border: '1px solid rgba(30,58,30,0.1)',
      }}
    >
      {/* Profile row */}
      <div className="flex items-center gap-4 mb-5">
        <img
          src={t.avatar}
          alt={t.name}
          className="rounded-full object-cover flex-shrink-0"
          style={{ width: '64px', height: '64px', border: `2px solid rgba(${t.colorRgb},0.35)` }}
        />
        <div>
          <div className="text-[15px] font-bold mb-1" style={{ color: '#1a2e1a' }}>{t.name}</div>
          <div className="text-[11px] mb-1.5" style={{ color: '#71717a' }}>{t.school}</div>
          <div
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              color: t.color,
              background: `rgba(${t.colorRgb},0.15)`,
              padding: '3px 10px',
              borderRadius: '4px',
              border: `1.5px solid rgba(${t.colorRgb},0.5)`,
            }}
          >
            {t.company}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(30,58,30,0.1)', marginBottom: '16px' }} />

      {/* Quote */}
      <div
        style={{
          fontSize: '36px',
          lineHeight: 1,
          color: `rgba(${t.colorRgb},0.3)`,
          fontFamily: 'Georgia, serif',
          marginBottom: '6px',
        }}
      >
        &ldquo;
      </div>
      <p className="text-[14px] leading-relaxed flex-1" style={{ color: '#1a1a1a' }}>
        {t.quote}
      </p>
    </div>
  )
}

export default function DetroitSection() {
  return (
    <section
      id="success-stories"
      className="relative overflow-hidden px-6 py-24 lg:py-32"
      style={{
        backgroundImage: 'url(/detroit.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.62)' }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center flex flex-col items-center mb-16">
          <h2
            className="text-5xl md:text-6xl lg:text-[68px] font-extrabold text-white leading-[1.05]"
            style={{ letterSpacing: '-0.04em' }}
          >
            Michigan students.<br />
            <span style={{ color: '#29C115' }}>Hired first.</span>
          </h2>
          <p className="mt-6 text-[17px] text-white/70 leading-relaxed max-w-lg">
            Real stories from students who discovered and landed their roles before anyone else.
          </p>
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: '#29C115' }}>
            Success Stories
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <Card key={t.name} t={t} />
          ))}
        </div>

      </div>
    </section>
  )
}
