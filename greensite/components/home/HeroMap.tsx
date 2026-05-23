'use client'

import React from 'react';

const TerminalCard = ({
  icon, label, sublabel, delay, x, y,
}: {
  icon: React.ReactNode
  label: string
  sublabel: string
  delay: string
  x: number
  y: number
}) => (
  <div
    className="absolute z-30 animate-float pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, animationDelay: delay }}
  >
    <div style={{
      transform: 'translate(-50%, -50%)',
      background: 'rgba(8,8,8,0.94)',
      border: '1px solid rgba(41,193,21,0.28)',
      borderRadius: '10px',
      padding: '9px 12px 10px',
      minWidth: '118px',
      boxShadow: [
        '0 0 0 1px rgba(255,255,255,0.04) inset',
        '0 8px 32px rgba(0,0,0,0.85)',
        '0 0 22px rgba(41,193,21,0.07)',
      ].join(', '),
    }}>
      {/* Accent bar */}
      <div style={{
        height: '1.5px',
        background: 'linear-gradient(90deg, #29C115 0%, rgba(41,193,21,0) 100%)',
        borderRadius: '1px',
        marginBottom: '8px',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <div style={{
          flexShrink: 0,
          color: '#29C115',
          filter: 'drop-shadow(0 0 5px rgba(41,193,21,0.75))',
        }}>
          {icon}
        </div>
        <div>
          <p style={{
            color: '#e4e4e7',
            fontSize: '10.5px',
            fontWeight: 600,
            letterSpacing: '0.03em',
            lineHeight: '1.2',
          }}>{label}</p>
          <p style={{ color: '#52525b', fontSize: '8px', marginTop: '1px' }}>{sublabel}</p>
        </div>
      </div>

      {/* Status row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        marginTop: '7px',
        paddingTop: '6px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          width: '4px', height: '4px', borderRadius: '50%',
          background: '#29C115',
          boxShadow: '0 0 6px #29C115, 0 0 12px rgba(41,193,21,0.4)',
        }} />
        <span style={{ color: '#3f3f46', fontSize: '7px', letterSpacing: '0.1em', fontWeight: 600 }}>LIVE</span>
        {/* Signal bars */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px', alignItems: 'flex-end' }}>
          {[3, 5, 7].map((h, i) => (
            <div key={i} style={{
              width: '2px',
              height: `${h}px`,
              background: `rgba(41,193,21,${0.3 + i * 0.25})`,
              borderRadius: '1px',
            }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function HeroMap() {
  return (
    <div className="relative w-full aspect-[4/3] flex items-center justify-center select-none overflow-visible">

      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 65% 60% at 50% 50%, rgba(41,193,21,0.22) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />

      {/* Network SVG — bezier routes + city node pulses */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 25 }}
        viewBox="0 0 800 600"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Glow blur — used on the soft halo layer of each route */}
          <filter id="routeHalo" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          {/* Tighter glow for node pulses */}
          <filter id="nodeHalo" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* ══════════════════════════════════════════════
            Ambient background nodes — adds network density
            to the map without connecting to cards
        ══════════════════════════════════════════════ */}
        {/* Traverse City area */}
        <circle cx="388" cy="220" r="8" fill="#29C115" fillOpacity="0.08" filter="url(#nodeHalo)" />
        <circle cx="388" cy="220" r="3.5" fill="#29C115" fillOpacity="0.18" />
        <circle cx="388" cy="220" r="1.5" fill="#29C115" fillOpacity="0.7" />

        {/* Central Michigan / Lansing area */}
        <circle cx="420" cy="345" r="7" fill="#29C115" fillOpacity="0.08" filter="url(#nodeHalo)" />
        <circle cx="420" cy="345" r="3" fill="#29C115" fillOpacity="0.16" />
        <circle cx="420" cy="345" r="1.4" fill="#29C115" fillOpacity="0.6" />

        {/* Detroit area */}
        <circle cx="548" cy="432" r="8" fill="#29C115" fillOpacity="0.08" filter="url(#nodeHalo)" />
        <circle cx="548" cy="432" r="3.5" fill="#29C115" fillOpacity="0.18" />
        <circle cx="548" cy="432" r="1.5" fill="#29C115" fillOpacity="0.7" />

        {/* Ambient connecting threads between background nodes */}
        <path d="M 388,220 C 400,278 410,310 420,345" stroke="#29C115" strokeWidth="0.6" strokeOpacity="0.12" fill="none" />
        <path d="M 420,345 C 475,385 510,408 548,432" stroke="#29C115" strokeWidth="0.6" strokeOpacity="0.12" fill="none" />
        <path d="M 388,220 C 460,232 508,265 535,305" stroke="#29C115" strokeWidth="0.5" strokeOpacity="0.10" fill="none" />

        {/* ══════════════════════════════════════════════
            Route 1 — NE node (442,192) → Job card (640,108)
            Flows up and right, curving like a transit arc
        ══════════════════════════════════════════════ */}
        {/* Soft halo */}
        <path d="M 442,192 C 508,168 582,128 640,108"
          stroke="#29C115" strokeWidth="7" strokeOpacity="0.09" fill="none" filter="url(#routeHalo)" />
        {/* Mid glow */}
        <path d="M 442,192 C 508,168 582,128 640,108"
          stroke="#29C115" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
        {/* Bright core */}
        <path d="M 442,192 C 508,168 582,128 640,108"
          stroke="#29C115" strokeWidth="0.7" strokeOpacity="0.88" fill="none" />

        {/* Node 1 — NE Michigan / Mackinac area */}
        <circle cx="442" cy="192" r="10" fill="#29C115" fillOpacity="0.09" filter="url(#nodeHalo)" />
        <circle cx="442" cy="192" r="5" fill="#29C115" fillOpacity="0.18" />
        <circle cx="442" cy="192" r="2.5" fill="#29C115" />
        <circle cx="442" cy="192" r="1.1" fill="white" />

        {/* ══════════════════════════════════════════════
            Route 2 — Thumb node (548,305) → Search card (704,300)
            Short smooth rightward arc
        ══════════════════════════════════════════════ */}
        <path d="M 548,305 C 596,294 648,296 704,300"
          stroke="#29C115" strokeWidth="7" strokeOpacity="0.09" fill="none" filter="url(#routeHalo)" />
        <path d="M 548,305 C 596,294 648,296 704,300"
          stroke="#29C115" strokeWidth="1.3" strokeOpacity="0.45" fill="none" />
        <path d="M 548,305 C 596,294 648,296 704,300"
          stroke="#29C115" strokeWidth="0.6" strokeOpacity="0.88" fill="none" />

        {/* Node 2 — Thumb / East Michigan coast */}
        <circle cx="548" cy="305" r="10" fill="#29C115" fillOpacity="0.09" filter="url(#nodeHalo)" />
        <circle cx="548" cy="305" r="5" fill="#29C115" fillOpacity="0.18" />
        <circle cx="548" cy="305" r="2.5" fill="#29C115" />
        <circle cx="548" cy="305" r="1.1" fill="white" />

        {/* ══════════════════════════════════════════════
            Route 3 — SW node (305,428) → Briefcase card (72,420)
            Sweeps left along the lower Michigan coast
        ══════════════════════════════════════════════ */}
        <path d="M 305,428 C 228,424 152,422 72,420"
          stroke="#29C115" strokeWidth="7" strokeOpacity="0.10" fill="none" filter="url(#routeHalo)" />
        <path d="M 305,428 C 228,424 152,422 72,420"
          stroke="#29C115" strokeWidth="1.4" strokeOpacity="0.42" fill="none" />
        <path d="M 305,428 C 228,424 152,422 72,420"
          stroke="#29C115" strokeWidth="0.65" strokeOpacity="0.88" fill="none" />

        {/* Node 3 — SW Michigan / Grand Rapids area */}
        <circle cx="305" cy="428" r="10" fill="#29C115" fillOpacity="0.09" filter="url(#nodeHalo)" />
        <circle cx="305" cy="428" r="5" fill="#29C115" fillOpacity="0.18" />
        <circle cx="305" cy="428" r="2.5" fill="#29C115" />
        <circle cx="305" cy="428" r="1.1" fill="white" />
      </svg>

      {/* Main Map Image */}
      <img
        src="/upda.png"
        alt="Michigan Map"
        className="w-[200%] h-auto relative z-20 transition-transform duration-1000 hover:scale-[1.01]"
        style={{ filter: 'drop-shadow(0 0 80px rgba(41,193,21,0.55)) drop-shadow(0 0 30px rgba(41,193,21,0.35))' }}
      />

      {/* ── Card 1: Job Intelligence Hub ── */}
      {/* Positioned upper-right, overlapping the NE map region */}
      <TerminalCard
        delay="0s"
        x={80}
        y={18}
        label="Job Matches"
        sublabel="AI-powered intelligence"
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        }
      />

      {/* ── Card 2: Search Terminal ── */}
      {/* Positioned right-center, overlapping the thumb coast */}
      <TerminalCard
        delay="1.5s"
        x={88}
        y={50}
        label="Active Search"
        sublabel="Michigan network"
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        }
      />

      {/* ── Card 3: Opportunity Hub ── */}
      {/* Positioned lower-left, overlapping the SW Michigan coast */}
      <TerminalCard
        delay="0.8s"
        x={9}
        y={70}
        label="Opportunities"
        sublabel="Live job routing"
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
          </svg>
        }
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
