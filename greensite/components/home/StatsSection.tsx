'use client'

const testimonials = [
  {
    name: 'Sarah Chen',
    school: 'University of Michigan',
    avatar: 'https://i.pravatar.cc/48?img=47',
    quote: (
      <>
        &ldquo;I got my offer from{' '}
        <span className="text-green-400">Microsoft</span> 2 weeks before their
        official campus recruitment started.{' '}
        <span className="text-green-400 underline underline-offset-2">
          Greenify&apos;s real-time tracking
        </span>{' '}
        caught the posting the moment it went live&mdash;before LinkedIn, Indeed,
        or any other platform.&rdquo;
      </>
    ),
  },
  {
    name: 'Marcus Williams',
    school: 'Michigan State University',
    avatar: 'https://i.pravatar.cc/48?img=12',
    quote: (
      <>
        &ldquo;Applied to{' '}
        <span className="text-green-400">Google&apos;s SWE role</span> through{' '}
        <span className="text-green-400">Greenify</span> 3 days before it showed
        up on Handshake. The{' '}
        <span className="text-green-400 underline underline-offset-2">
          early application
        </span>{' '}
        gave me a competitive edge&mdash;I was already in the interview process
        while others were just discovering the role.&rdquo;
      </>
    ),
  },
  {
    name: 'Priya Patel',
    school: 'Wayne State University',
    avatar: 'https://i.pravatar.cc/48?img=32',
    quote: (
      <>
        &ldquo;Secured my{' '}
        <span className="text-green-400">Tesla position</span> before it was
        posted on their careers page publicly.{' '}
        <span className="text-green-400 underline underline-offset-2">
          Greenify&apos;s direct scraping
        </span>{' '}
        found the internal listing first. By the time it hit major job boards, I
        was already at the final interview stage.&rdquo;
      </>
    ),
  },
];

export default function StatsSection() {
  return (
    <section style={{ background: '#1a1a1a' }} className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">
            <span className="text-green-400">Success</span>{' '}
            <span className="text-white">Stories</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{ background: '#242424' }}
              className="rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                  style={{ width: '48px', height: '48px' }}
                />
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.school}</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{t.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
