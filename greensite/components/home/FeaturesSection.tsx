'use client'

function BriefcaseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

function DashboardMockup() {
  const rows = [
    { dot: '#e05252', btn: '#e05252' },
    { dot: '#d97706', btn: '#d97706' },
    { dot: '#3b82f6', btn: '#3b82f6' },
  ];
  return (
    <div style={{ background: '#111', borderRadius: '12px', padding: '16px' }}>
      <div style={{ background: '#e05252', height: '8px', borderRadius: '4px', width: '65%', marginBottom: '16px' }} />
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i < rows.length - 1 ? '12px' : '0' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: row.dot, flexShrink: 0 }} />
          <div style={{ flex: 1, height: '6px', background: '#333', borderRadius: '3px' }} />
          <div style={{ padding: '4px 14px', background: row.btn, borderRadius: '4px', height: '22px', flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}

function AnalyticsMockup() {
  const bars = [
    { height: 60, color: '#b45309' },
    { height: 90, color: '#e05252' },
    { height: 50, color: '#3b82f6' },
    { height: 110, color: '#e05252' },
    { height: 75, color: '#d97706' },
    { height: 95, color: '#3b82f6' },
    { height: 45, color: '#e05252' },
  ];
  return (
    <div style={{ background: '#111', borderRadius: '12px', padding: '16px' }}>
      <div style={{ background: '#d97706', height: '8px', borderRadius: '4px', width: '40%', marginBottom: '20px' }} />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
        {bars.map((bar, i) => (
          <div key={i} style={{ flex: 1, background: bar.color, height: `${bar.height}px`, borderRadius: '3px 3px 0 0' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ flex: 1, height: '6px', background: '#333', borderRadius: '3px' }} />
        ))}
      </div>
    </div>
  );
}

function ResumeMatchMockup() {
  const scores = [
    { score: '95', color: '#22c55e' },
    { score: '90', color: '#d97706' },
    { score: '85', color: '#3b82f6' },
  ];
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <div style={{ flex: 1, background: '#111', borderRadius: '10px', padding: '12px' }}>
        <div style={{ height: '6px', background: '#333', borderRadius: '3px', marginBottom: '8px', width: '80%' }} />
        <div style={{ height: '6px', background: '#333', borderRadius: '3px', marginBottom: '8px', width: '60%' }} />
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          <div style={{ height: '16px', width: '40px', background: '#d97706', borderRadius: '3px' }} />
          <div style={{ height: '16px', width: '36px', background: '#3b82f6', borderRadius: '3px' }} />
        </div>
        <div style={{ height: '6px', background: '#e05252', borderRadius: '3px', width: '70%' }} />
      </div>
      <div style={{ flex: 1, background: '#111', borderRadius: '10px', padding: '12px', border: '1.5px solid #22c55e' }}>
        <div style={{ background: '#22c55e', height: '6px', borderRadius: '3px', width: '60%', marginBottom: '12px' }} />
        {scores.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: i < scores.length - 1 ? '10px' : '0' }}>
            <div style={{ height: '6px', background: '#333', borderRadius: '3px', flex: 1, marginRight: '10px' }} />
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
              {s.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const features = [
  {
    icon: <BriefcaseIcon />,
    title: 'Job Dashboard',
    description: 'Access thousands of job listings from top companies in one ',
    highlight: 'centralized dashboard',
    descriptionEnd: '. Real-time updates from over 1,000 scraped career pages.',
    sub: 'Browse, filter, and save opportunities before they appear on traditional job boards.',
    href: '/jobs',
    mockup: <DashboardMockup />,
    flip: false,
  },
  {
    icon: <TrendingUpIcon />,
    title: 'Analytics',
    description: 'Gain powerful insights into ',
    highlight: 'hiring trends',
    descriptionEnd: ', company patterns, and market demand. Track which companies are actively hiring and when they post positions.',
    sub: 'Make data-driven career decisions with comprehensive market intelligence.',
    href: '/dashboard',
    mockup: <AnalyticsMockup />,
    flip: true,
  },
  {
    icon: <DocumentIcon />,
    title: 'Resume Matching',
    description: 'Upload your resume and get ',
    highlight: 'personalized job recommendations',
    descriptionEnd: ' powered by AI. Our intelligent matching algorithm analyzes your skills and experience.',
    sub: 'Stop scrolling through irrelevant listings\u2014see only jobs that match your profile.',
    href: '/custom_jobs',
    mockup: <ResumeMatchMockup />,
    flip: false,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" style={{ background: '#1a1a1a' }} className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white">
            Three Core <span className="text-green-400">Features</span>
          </h2>
        </div>

        <div className="flex flex-col gap-0">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className={`grid md:grid-cols-2 gap-0 items-center relative ${idx < features.length - 1 ? 'pb-16' : ''}`}
            >
              {/* Dotted vertical divider */}
              <div
                className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 h-full"
                style={{ borderLeft: '2px dashed #333', width: '0' }}
              />

              {/* Text side */}
              <div className={`px-8 py-6 ${feature.flip ? 'md:order-2' : 'md:order-1'}`}>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: '#16a34a' }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-2">
                  {feature.description}
                  <span className="text-green-400 underline underline-offset-2">{feature.highlight}</span>
                  {feature.descriptionEnd}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.sub}</p>
              </div>

              {/* Mockup side */}
              <div className={`px-8 py-6 ${feature.flip ? 'md:order-1' : 'md:order-2'}`}>
                {feature.mockup}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
