const testimonials = [
  {
    name: 'Evan W',
    school: 'Michigan State University',
    company: 'TechSmith',
    avatar: '/aaaa.JPG',
    color: 'var(--palette-yellow-500)',
    colorRgb: 'var(--palette-yellow-500-rgb)',
    quote: (
      <>
        Landed my{' '}
        <span style={{ color: 'var(--palette-yellow-500)', fontWeight: 500 }}>TechSmith summer internship</span> before it appeared on major job boards.{' '}
        <span style={{ color: 'var(--palette-yellow-500)', fontWeight: 500 }}>Greenify&apos;s real-time tracking</span>{' '}
        caught the posting the moment it went live, giving me a huge head start.
      </>
    ),
  },
  {
    name: 'Anish S',
    school: 'University of Michigan',
    company: 'State of Michigan',
    avatar: '/stroy1.png',
    color: 'var(--palette-blue-500)',
    colorRgb: 'var(--palette-blue-500-rgb)',
    quote: (
      <>
        Got my full-time offer at the{' '}
        <span style={{ color: 'var(--palette-blue-500)', fontWeight: 500 }}>State of Michigan</span> through Greenify without endlessly scrolling job boards. Its{' '}
        <span style={{ color: 'var(--palette-blue-500)', fontWeight: 500 }}>resume matching</span>{' '}
        surfaced the role immediately. I applied early and got a head start on interviews.
      </>
    ),
  },
  {
    name: 'Ryan A',
    school: 'Michigan State University',
    company: 'Ally Bank',
    avatar: '/story2.png',
    color: 'var(--palette-purple-500)',
    colorRgb: 'var(--palette-purple-500-rgb)',
    quote: (
      <>
        Secured my full-time role at{' '}
        <span style={{ color: 'var(--palette-purple-500)', fontWeight: 500 }}>Ally Bank</span> after Greenify&apos;s{' '}
        <span style={{ color: 'var(--palette-purple-500)', fontWeight: 500 }}>analytics showed Detroit</span>{' '}
        was a growing hub for tech jobs. I set my preferences to monitor roles there and applied early when the right one came up.
      </>
    ),
  },
  {
    name: 'Jeff S',
    school: 'Michigan State',
    company: 'Jackson National Life',
    avatar: '/story4.png',
    color: 'var(--palette-red-500)',
    colorRgb: 'var(--palette-red-500-rgb)',
    quote: (
      <>
        Greenify&apos;s{' '}
        <span style={{ color: 'var(--palette-red-500)', fontWeight: 500 }}>custom resume matching</span> connected my experience with a role at{' '}
        <span style={{ color: 'var(--palette-red-500)', fontWeight: 500 }}>Jackson National Life</span> that closely aligned with my background and career goals. The personalized match helped me discover and apply to the opportunity early.
      </>
    ),
  },
]

function Card({ t, className = '' }: { t: typeof testimonials[0]; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-6 flex flex-col ${className}`}
      style={{
        background: 'var(--palette-cream-50)',
        border: '1px solid rgb(var(--palette-forest-800-rgb) / 0.1)',
      }}
    >
      {/* Profile row */}
      <div className="flex items-center gap-4 mb-5">
        <img
          src={t.avatar}
          alt={t.name}
          className="rounded-full object-cover flex-shrink-0"
          style={{ width: '64px', height: '64px', border: `2px solid rgb(${t.colorRgb} / 0.35)` }}
        />
        <div>
          <div className="text-[15px] font-bold mb-1" style={{ color: 'var(--palette-forest-700)' }}>{t.name}</div>
          <div className="text-[11px] mb-1.5" style={{ color: 'var(--palette-neutral-500)' }}>{t.school}</div>
          <div
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              color: t.color,
              background: `rgb(${t.colorRgb} / 0.15)`,
              padding: '3px 10px',
              borderRadius: '4px',
              border: `1.5px solid rgb(${t.colorRgb} / 0.5)`,
            }}
          >
            {t.company}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgb(var(--palette-forest-800-rgb) / 0.1)', marginBottom: '16px' }} />

      {/* Quote */}
      <div
        style={{
          fontSize: '36px',
          lineHeight: 1,
          color: `rgb(${t.colorRgb} / 0.3)`,
          fontFamily: 'Georgia, serif',
          marginBottom: '6px',
        }}
      >
        &ldquo;
      </div>
      <p className="text-[14px] leading-relaxed flex-1" style={{ color: 'var(--palette-neutral-820)' }}>
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
      <div className="absolute inset-0" style={{ background: 'rgb(var(--palette-black-rgb) / 0.62)' }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center flex flex-col items-center mb-16">
          <h2
            className="text-5xl md:text-6xl lg:text-[68px] font-extrabold text-white leading-[1.05]"
            style={{ letterSpacing: '-0.04em' }}
          >
            Michigan students.<br />
            <span style={{ color: 'var(--palette-green-500)' }}>Hired first.</span>
          </h2>
          <p className="mt-6 text-[17px] text-white/70 leading-relaxed max-w-lg">
            Real stories from students who discovered and landed their roles before anyone else.
          </p>
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--palette-green-500)' }}>
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
