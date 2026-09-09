import { Fragment } from 'react'
import { FeatureSectionData, Tool } from './types'

export function Hero() {
  return (
    <section className="px-6 pt-52 pb-72 text-center" style={{ background: '#f0ece4' }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: '#29C115' }}>
          Why Greenify
        </p>
        <h1
          className="text-6xl md:text-[76px] font-extrabold mb-6 leading-[1.03]"
          style={{ letterSpacing: '-0.04em' }}
        >
          <span style={{ color: '#1a2e1a' }}>Built different.</span>
          <br />
          <span style={{ color: '#2d6e28' }}>For a reason.</span>
        </h1>
        <p className="text-[18px] leading-relaxed" style={{ color: '#5a7a5a' }}>
          Most job boards are slow, full of fake listings, and built for everyone. Greenify was built by Michigan students, for Michigan students, and it shows.
        </p>
      </div>
    </section>
  )
}

export function FeatureSection({ data, visual }: { data: FeatureSectionData; visual: React.ReactNode }) {
  const dark = data.dark
  const borderColor = dark ? 'rgba(255,255,255,0.15)' : 'rgba(30,58,30,0.2)'
  const textColor = dark ? 'rgba(255,255,255,0.65)' : '#5a7a5a'

  return (
    <section id={data.id} className="px-6 py-36" style={{ background: data.background }}>
      <div className={`max-w-5xl mx-auto flex flex-col lg:flex-row${data.reverse ? '-reverse' : ''} items-center gap-16`}>
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: '#29C115' }}>
            {data.eyebrow}
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-6 leading-[1.08]"
            style={{ color: dark ? '#ffffff' : '#1a2e1a', letterSpacing: '-0.03em' }}
          >
            {data.title.map((line, i) => (
              <Fragment key={i}>
                {line}
                {i < data.title.length - 1 && <br />}
              </Fragment>
            ))}
          </h2>
          <div className="mb-8 pl-4" style={{ borderLeft: `3px solid ${borderColor}` }}>
            <p className="text-[17px] leading-relaxed" style={{ color: textColor }}>
              {data.blurb}
            </p>
          </div>
          <ul className="space-y-3">
            {data.bullets.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#29C115' }} />
                <span className="text-[15px]" style={{ color: textColor }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        {visual}
      </div>
    </section>
  )
}

export function MichiganMap() {
  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 200 210" width="360" height="360" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M68.5,100.6 L64.9,97.4 L67.1,93.1 L61.5,92.4 L63.7,88.2 L64.0,82.9 L59.1,79.2 L56.4,75.4 L46.3,72.4 L43.2,73.4 L33.2,68.9 L8.9,62.7 L6.4,57.6 L2.0,55.7 L11.1,52.6 L15.3,48.9 L25.6,47.4 L32.3,42.9 L35.4,42.7 L37.9,39.6 L45.3,35.1 L49.0,31.2 L54.6,28.7 L59.9,30.9 L50.6,40.2 L48.4,43.4 L48.5,49.1 L53.0,44.7 L61.1,45.4 L67.5,48.4 L73.1,56.7 L76.2,58.2 L82.1,56.9 L83.6,58.7 L89.5,59.7 L102.1,52.7 L108.7,52.1 L117.5,52.4 L123.4,50.1 L127.9,49.9 L128.8,58.4 L133.4,59.6 L138.1,58.2 L140.0,60.2 L143.1,57.7 L149.9,56.9 L150.1,67.6 L153.2,72.1 L157.8,73.2 L158.3,70.2 L162.8,70.2 L165.3,73.4 L163.2,75.7 L150.3,73.7 L144.1,75.1 L137.4,71.4 L135.5,74.7 L136.4,77.6 L133.4,76.9 L129.1,72.7 L121.5,70.2 L117.6,70.1 L113.8,74.1 L107.7,75.1 L101.0,74.2 L98.3,75.9 L97.6,79.2 L90.3,82.1 L90.7,78.1 L87.4,77.2 L86.1,81.4 L80.7,81.6 L78.3,83.4 L74.7,90.6 L68.0,99.7 Z"
          fill="rgba(249,115,22,0.12)"
        />
        <path
          d="M165.8,202.9 L134.0,204.1 L106.1,202.1 L86.5,202.1 L91.3,198.1 L94.5,191.3 L97.5,187.1 L99.7,181.3 L101.0,172.9 L100.4,163.9 L93.5,146.3 L95.7,139.6 L94.1,131.6 L99.5,123.4 L100.7,116.6 L99.9,112.9 L103.8,111.4 L104.3,106.4 L110.4,105.1 L115.0,99.6 L114.6,110.6 L117.1,111.1 L120.2,105.6 L120.3,96.2 L122.2,93.9 L128.7,92.4 L126.6,85.9 L130.9,80.4 L136.1,80.1 L142.1,83.6 L147.9,84.1 L150.7,88.4 L155.1,88.7 L162.4,92.7 L165.0,92.6 L169.0,99.1 L165.8,102.6 L168.9,107.1 L170.0,112.2 L168.6,123.6 L163.8,126.4 L162.7,132.3 L157.0,134.3 L153.9,141.3 L155.1,143.9 L160.8,146.4 L165.1,142.6 L170.3,134.8 L178.4,131.8 L182.4,134.1 L184.9,138.4 L187.3,151.1 L187.7,157.4 L190.3,165.1 L187.8,176.1 L184.0,177.8 L183.8,173.8 L181.2,174.9 L178.3,184.1 L173.5,187.6 L172.1,194.6 L166.2,200.4 Z"
          fill="rgba(249,115,22,0.12)"
        />
      </svg>
    </div>
  )
}

export function ToolsSection({ tools }: { tools: Tool[] }) {
  return (
    <section id="all-tools" className="px-6 py-36" style={{ background: '#c8391e' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
            One platform
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5" style={{ color: '#ffffff', letterSpacing: '-0.03em' }}>
            Every tool you need.
            <br />
            All in one place.
          </h2>
          <p className="text-[16px] max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            No switching between tabs, apps, or spreadsheets. Greenify brings your entire job search under one roof.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.label}
              className="rounded-xl p-6 flex flex-col gap-3"
              style={{ background: '#ffffff', border: '1px solid rgba(30,58,30,0.08)' }}
            >
              <div className="text-[15px] font-bold" style={{ color: '#1a2e1a' }}>{tool.label}</div>
              <p className="text-[13px] leading-relaxed" style={{ color: '#5a7a5a' }}>{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer style={{ background: '#f0ece4', borderTop: '1px solid rgba(30,58,30,0.3)' }} className="px-6 py-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <p className="text-[13px] font-semibold" style={{ color: 'rgba(30,58,30,0.85)' }}>
          &copy; 2026 Greenify LLC
        </p>
        <a href="/terms" className="text-[13px] font-semibold transition-opacity hover:opacity-70" style={{ color: 'rgba(30,58,30,0.85)' }}>
          Terms of Service
        </a>
      </div>
    </footer>
  )
}