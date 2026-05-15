'use client'

import FadeIn from '@/components/ui/FadeIn'

function BriefcaseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function CompanyTrackMockup() {
  const companies = [
    { name: 'Ford', role: 'Software Engineer', color: '#3B82F6', colorRgb: '59,130,246', status: 'Watching', newJobs: 2 },
    { name: 'Sparrow Hospital', role: 'Product Manager', color: '#A855F7', colorRgb: '168,85,247', status: 'Watching', newJobs: 1 },
    { name: 'Amazon', role: 'Data Analyst', color: '#F97316', colorRgb: '249,115,22', status: 'Watching', newJobs: 0 },
    { name: 'Rocket Companies', role: 'Any role', color: '#29C115', colorRgb: '41,193,21', status: 'Watching', newJobs: 3 },
    { name: 'Rivian', role: 'Hardware Engineer', color: '#60A5FA', colorRgb: '96,165,250', status: 'Watching', newJobs: 1 },
  ];
  return (
    <div style={{ background: '#1A1B1E', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', width: '100%', height: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#e4e4e7' }}>Tracked Companies</div>
        <div style={{ fontSize: '9px', color: '#29C115', background: 'rgba(41,193,21,0.08)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(41,193,21,0.15)' }}>
          5 active
        </div>
      </div>
      {companies.map((c, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            background: c.newJobs > 0 ? `rgba(${c.colorRgb},0.04)` : 'rgba(255,255,255,0.02)',
            borderRadius: '8px',
            marginBottom: i < companies.length - 1 ? '10px' : 0,
            border: c.newJobs > 0 ? `1px solid rgba(${c.colorRgb},0.12)` : '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: '6px', background: `rgba(${c.colorRgb},0.12)`, border: `1px solid rgba(${c.colorRgb},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: c.color }}>{c.name[0]}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#e4e4e7' }}>{c.name}</div>
            <div style={{ fontSize: '9px', color: '#52525b' }}>{c.role}</div>
          </div>
          {c.newJobs > 0 ? (
            <div style={{ fontSize: '9px', fontWeight: 700, color: c.color, background: `rgba(${c.colorRgb},0.1)`, padding: '2px 7px', borderRadius: '4px', border: `1px solid rgba(${c.colorRgb},0.2)`, flexShrink: 0 }}>
              +{c.newJobs} new
            </div>
          ) : (
            <div style={{ fontSize: '9px', color: '#3f3f3f', flexShrink: 0 }}>No new</div>
          )}
        </div>
      ))}
    </div>
  );
}

function DashboardMockup() {
  const rows = [
    { company: 'Stripe', role: 'Backend Engineer', color: '#29C115', isTop: true },
    { company: 'Figma', role: 'Product Designer', color: '#a78bfa', isTop: false },
    { company: 'Notion', role: 'SWE Intern', color: '#60a5fa', isTop: false },
    { company: 'Linear', role: 'Frontend Engineer', color: '#f59e0b', isTop: false },
  ];
  return (
    <div style={{ background: '#1A1B1E', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', width: '100%', height: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ height: '6px', width: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '32px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', borderRadius: '6px', border: '1px solid rgba(41,193,21,0.2)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </div>
          <div style={{ width: '32px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'rgba(255,255,255,0.01)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: row.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>{row.role}</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>{row.company}</div>
            </div>
            <div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={row.isTop ? '#29C115' : '#52525b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsMockup() {
  const w = 500, h = 260, px = 14, py = 16;
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const stepX = (w - px * 2) / (labels.length - 1);

  const series = [
    { name: 'Engineering',  color: '#3B82F6', data: [35, 50, 42, 70, 85, 60, 78] },
    { name: 'Product',      color: '#A855F7', data: [20, 30, 55, 45, 40, 65, 50] },
    { name: 'Marketing',    color: '#F97316', data: [15, 25, 20, 35, 30, 45, 55] },
    { name: 'Sales',        color: '#EAB308', data: [10, 15, 30, 25, 50, 40, 65] },
  ];

  const maxVal = 95;
  const toY = (v: number) => py + (h - py * 2) * (1 - v / maxVal);
  const toX = (i: number) => px + i * stepX;

  const toSmooth = (data: number[]) => {
    const pts = data.map((v, i) => ({ x: toX(i), y: toY(v) }));
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cp = (pts[i].x - pts[i - 1].x) * 0.4;
      d += ` C${pts[i - 1].x + cp},${pts[i - 1].y} ${pts[i].x - cp},${pts[i].y} ${pts[i].x},${pts[i].y}`;
    }
    return d;
  };

  const toArea = (data: number[]) => {
    const line = toSmooth(data);
    const lastX = toX(data.length - 1);
    const firstX = toX(0);
    return `${line} L${lastX},${h - py} L${firstX},${h - py} Z`;
  };

  return (
    <div style={{ background: '#1A1B1E', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', width: '100%', height: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#e4e4e7' }}>Hiring Activity</div>
          <div style={{ fontSize: '9px', color: '#52525b', marginTop: '2px' }}>Weekly job postings by field</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {series.map((s) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
              <span style={{ fontSize: '9px', color: '#71717a' }}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', flex: 1, minHeight: 0, marginTop: '10px', marginBottom: '16px' }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.name} id={`grad-${s.name}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {[0, 25, 50, 75].map((v) => (
          <line key={v} x1={px} y1={toY(v)} x2={w - px} y2={toY(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="3,4" />
        ))}

        {series.map((s) => (
          <path key={`a-${s.name}`} d={toArea(s.data)} fill={`url(#grad-${s.name})`} />
        ))}

        {series.map((s) => (
          <path key={s.name} d={toSmooth(s.data)} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
        ))}

        {series.map((s) => (
          <circle key={`d-${s.name}`} cx={toX(s.data.length - 1)} cy={toY(s.data[s.data.length - 1])} r="3.5" fill={s.color} stroke="#0d0d0d" strokeWidth="2" />
        ))}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 8px 0 8px' }}>
        {labels.map((l) => (
          <span key={l} style={{ fontSize: '9px', color: '#3f3f3f', fontWeight: 500 }}>{l}</span>
        ))}
      </div>
    </div>
  );
}


function ResumeMatchMockup() {
  const matches = [
    { role: 'SWE Intern @ Google', score: 94, isTop: true },
    { role: 'Backend Eng @ Stripe', score: 87, isTop: false },
    { role: 'Data Eng @ Tesla', score: 79, isTop: false },
    { role: 'Frontend Eng @ Linear', score: 76, isTop: false },
    { role: 'Product @ Figma', score: 71, isTop: false },
  ];
  return (
    <div style={{ background: '#1A1B1E', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', width: '100%', height: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
        {/* Resume side */}
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '9px', color: '#ffffff', marginBottom: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>RESUME</div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', width: '90%', marginBottom: '10px' }} />
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', width: '70%', marginBottom: '10px' }} />
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', width: '80%', marginBottom: '20px' }} />
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ height: '16px', width: '30px', background: 'rgba(41,193,21,0.12)', borderRadius: '3px', border: '1px solid rgba(41,193,21,0.18)' }} />
            <div style={{ height: '16px', width: '26px', background: 'rgba(96,165,250,0.12)', borderRadius: '3px', border: '1px solid rgba(96,165,250,0.18)' }} />
            <div style={{ height: '16px', width: '32px', background: 'rgba(167,139,250,0.12)', borderRadius: '3px', border: '1px solid rgba(167,139,250,0.18)' }} />
          </div>
        </div>
        {/* Matches side */}
        <div style={{ flex: 1.3 }}>
          <div style={{ fontSize: '9px', color: '#ffffff', marginBottom: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>TOP MATCHES</div>
          {matches.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: i < matches.length - 1 ? '10px' : 0,
                padding: '9px 12px',
                background: m.isTop ? 'rgba(41,193,21,0.05)' : 'rgba(255,255,255,0.02)',
                borderRadius: '7px',
                border: m.isTop ? '1px solid rgba(41,193,21,0.1)' : '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div style={{ fontSize: '10px', color: '#ffffff', fontWeight: 500, flex: 1, marginRight: '6px', lineHeight: '1.3' }}>{m.role}</div>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#29C115',
                  background: 'rgba(41,193,21,0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  flexShrink: 0,
                }}
              >
                {m.score}%
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: 'rgba(41,193,21,0.05)',
          borderRadius: '8px',
          padding: '12px 16px',
          border: '1px solid rgba(41,193,21,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
        }}
      >
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#29C115', flexShrink: 0 }} className="animate-pulse" />
        <span style={{ fontSize: '9px', color: '#29C115', fontFamily: 'monospace' }}>AI matching against 1,247 open roles...</span>
      </div>
    </div>
  );
}

const features = [
  {
    icon: <BriefcaseIcon />,
    label: 'JOB DASHBOARD',
    title: 'All jobs. One place.',
    description: 'Access thousands of listings from top Michigan employers in a single centralized dashboard. Real-time updates from 1,000+ scraped career pages.',
    sub: 'Browse, filter, and save opportunities before they appear on traditional job boards.',
    mockup: <DashboardMockup />,
    flip: false,
  },
  {
    icon: <TrendingUpIcon />,
    label: 'ANALYTICS',
    title: 'Understand the market.',
    description: 'Gain deep insights into hiring trends, company patterns, and market demand. Track which companies are actively hiring and when they post positions.',
    sub: 'Make data-driven career decisions with comprehensive market intelligence.',
    mockup: <AnalyticsMockup />,
    flip: true,
  },
  {
    icon: <DocumentIcon />,
    label: 'RESUME MATCHING',
    title: 'Jobs matched to you.',
    description: 'Upload your resume and get personalized recommendations powered by AI. Our algorithm analyzes your skills against every open role.',
    sub: 'Stop scrolling through irrelevant listings. See only jobs that match your profile.',
    mockup: <ResumeMatchMockup />,
    flip: false,
  },
  {
    icon: <StarIcon />,
    label: 'COMPANY TRACKING',
    title: 'Follow the companies you want.',
    description: 'Pin specific companies and get notified the moment they post a new role. Never miss an opening at the employer you actually want to work for.',
    sub: 'Track Ford, Sparrow Hospital, Amazon, or any Michigan employer. All in one place.',
    mockup: <CompanyTrackMockup />,
    flip: true,
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{ background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.06)', scrollMarginTop: '72px' }}
      className="px-6 py-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <FadeIn className="text-center mb-20">
          <div
            className="inline-block text-[10px] font-bold tracking-widest mb-5 px-3 py-1.5 rounded-full"
            style={{
              color: '#29C115',
              background: 'rgba(41,193,21,0.08)',
              border: '1px solid rgba(41,193,21,0.15)',
              letterSpacing: '0.1em',
            }}
          >
            PLATFORM
          </div>
          <h2
            className="text-4xl font-bold text-white"
            style={{ letterSpacing: '-0.03em' }}
          >
            Everything you need to get hired first
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-24">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 100}>
            <div
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              {/* Text side */}
              <div className={feature.flip ? 'md:order-2' : 'md:order-1'}>
                <div className="flex items-center gap-2.5 mb-5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(41,193,21,0.08)', border: '1px solid rgba(41,193,21,0.15)' }}
                  >
                    {feature.icon}
                  </div>
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: '#29C115', letterSpacing: '0.1em' }}
                  >
                    {feature.label}
                  </span>
                </div>
                <h3
                  className="text-[26px] font-bold text-white mb-4"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {feature.title}
                </h3>
                <p className="text-[15px] text-zinc-400 leading-relaxed mb-3">
                  {feature.description}
                </p>
                <p className="text-[14px] leading-relaxed" style={{ color: '#52525b' }}>
                  {feature.sub}
                </p>
              </div>

              {/* Mockup side */}
              <div className={`relative ${feature.flip ? 'md:order-1' : 'md:order-2'}`}>
                {/* Backlight glow - Patchy / Nebula effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                  <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', filter: 'blur(40px)' }} />
                  <div className="absolute -top-10 -right-10 w-[70%] h-[70%] rounded-full" style={{ background: 'rgba(255,255,255,0.35)', filter: 'blur(30px)' }} />
                  <div className="absolute bottom-0 -left-10 w-[60%] h-[60%] rounded-full" style={{ background: 'rgba(255,255,255,0.4)', filter: 'blur(50px)' }} />
                  <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] rounded-full" style={{ background: 'rgba(255,255,255,0.2)', filter: 'blur(20px)' }} />
                </div>
                <div className="relative z-10">
                  {feature.mockup}
                </div>
              </div>
            </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
