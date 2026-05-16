'use client'

import React from 'react';

const StackedCard = ({ icon, delay, x, y }: { icon: React.ReactNode, delay: string, x: number, y: number }) => (
  <div 
    className="absolute z-30 animate-float pointer-events-none"
    style={{ 
      left: `${x}%`, 
      top: `${y}%`, 
      animationDelay: delay, 
      perspective: '1500px' 
    }}
  >
    {/* Center offset wrapper */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div 
        className="relative w-20 h-20 md:w-24 md:h-24"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(-45deg)' }}
      >
        {/* Bottom Layer - Deep shadow and faint border */}
        <div className="absolute inset-0 rounded-[20px] border border-[#29C115]/20 bg-transparent shadow-[0_15px_40px_rgba(0,0,0,0.9)]" style={{ transform: 'translateZ(-30px)' }} />
        {/* Middle Layer - Brighter border */}
        <div className="absolute inset-0 rounded-[20px] border border-[#29C115]/40 bg-transparent" style={{ transform: 'translateZ(-15px)' }} />
        {/* Top Layer - Main card with glowing border */}
        <div className="absolute inset-0 rounded-[20px] border-[1.5px] border-[#29C115] bg-[#020802]/95 shadow-[0_0_30px_rgba(41,193,21,0.4)] flex items-center justify-center overflow-hidden" style={{ transform: 'translateZ(0px)' }}>
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(41,193,21,0.05) 0%, transparent 70%)" />
          <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            {icon}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function HeroMap() {
  return (
    <div className="relative w-full aspect-[4/3] flex items-center justify-center select-none overflow-visible">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(41,193,21,0.12) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Background Isometric Plates - Expansive and faint */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" style={{ perspective: '1500px' }}>
        <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(-45deg)', width: '120%', height: '120%', position: 'relative' }}>
          <div className="absolute inset-0 border border-[#29C115]/15 rounded-[100px]" style={{ transform: 'translateZ(-120px)' }} />
          <div className="absolute -inset-24 border border-[#29C115]/5 rounded-[120px]" style={{ transform: 'translateZ(-200px)' }} />
        </div>
      </div>

      {/* Connection Lines (SVG) - Dotted and isometric angles */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-10" 
        viewBox="0 0 800 600" 
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#29C115" stopOpacity="1" />
            <stop offset="100%" stopColor="#29C115" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Top Right Line (to User) */}
        <path d="M540 230 L700 130" stroke="#29C115" strokeWidth="2.5" strokeDasharray="1 10" strokeLinecap="round" strokeOpacity="0.9" />
        <circle cx="540" cy="230" r="5" fill="url(#nodeGlow)" className="animate-pulse" />
        <circle cx="700" cy="130" r="5" fill="url(#nodeGlow)" />

        {/* Middle Right Line (to Search) */}
        <path d="M620 370 L740 370" stroke="#29C115" strokeWidth="2.5" strokeDasharray="1 10" strokeLinecap="round" strokeOpacity="0.9" />
        <circle cx="620" cy="370" r="5" fill="url(#nodeGlow)" className="animate-pulse" />
        <circle cx="740" cy="370" r="5" fill="url(#nodeGlow)" />

        {/* Bottom Left Line (to Briefcase) */}
        <path d="M320 440 L100 480" stroke="#29C115" strokeWidth="2.5" strokeDasharray="1 10" strokeLinecap="round" strokeOpacity="0.9" />
        <circle cx="320" cy="440" r="5" fill="url(#nodeGlow)" className="animate-pulse" />
        <circle cx="100" cy="480" r="5" fill="url(#nodeGlow)" />
      </svg>

      {/* Main Map Image */}
      <img 
        src="/upda.png" 
        alt="Michigan Map" 
        className="w-[88%] h-auto relative z-20 transition-transform duration-1000 hover:scale-[1.01]"
        style={{ 
          filter: 'drop-shadow(0 0 60px rgba(41,193,21,0.25))',
        }}
      />

      {/* Floating Stacked Cards */}
      
      {/* User Card (Top Right) */}
      <StackedCard 
        delay="0s" 
        x={87.5} 
        y={21.6} 
        icon={
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#29C115" stroke="none">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        }
      />

      {/* Search Card (Middle Right) */}
      <StackedCard 
        delay="1.5s" 
        x={92.5} 
        y={61.6} 
        icon={
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        }
      />

      {/* Briefcase Card (Bottom Left) */}
      <StackedCard 
        delay="0.8s" 
        x={12.5} 
        y={80} 
        icon={
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#29C115" stroke="none">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
          </svg>
        }
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}


