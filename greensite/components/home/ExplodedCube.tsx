'use client';

import { useState } from 'react';

export default function ExplodedCube() {
  const pieces = [
    { id: 1, x: 1.3, y: 1.3, z: 1.3, color: 'bg-green-600' },
    { id: 2, x: -1.3, y: 1.3, z: 1.3, color: 'bg-green-500' },
    { id: 3, x: 1.3, y: -1.3, z: 1.3, color: 'bg-green-400' },
    { id: 4, x: -1.3, y: -1.3, z: 1.3, color: 'bg-green-700' },
    { id: 5, x: 1.3, y: 1.3, z: -1.3, color: 'bg-green-500' },
    { id: 6, x: -1.3, y: 1.3, z: -1.3, color: 'bg-green-600' },
    { id: 7, x: 1.3, y: -1.3, z: -1.3, color: 'bg-green-800' },
    { id: 8, x: -1.3, y: -1.3, z: -1.3, color: 'bg-green-500' },
  ];

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center perspective-[1200px]">
      <div className="relative w-64 h-64 preserve-3d animate-float-cube">
        {pieces.map((piece) => {
          const isHovered = hoveredId === piece.id;
          const offset = isHovered ? 1.5 : 1.3;

          return (
            <div
              key={piece.id}
              className="absolute top-1/2 left-1/2 w-20 h-20 -ml-10 -mt-10 preserve-3d transition-all duration-500 ease-out cursor-pointer"
              style={{
                transform: `translate3d(${piece.x * offset * 60}px, ${piece.y * offset * 60}px, ${piece.z * offset * 60}px)`,
              }}
              onMouseEnter={() => setHoveredId(piece.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Main Cube Body with puzzle-like feel */}
              {/* Front */}
              <div className={`absolute inset-0 ${piece.color} border-[3px] border-white/30 opacity-95 rounded-sm shadow-inner translate-z-[40px] shadow-green-900/20`} />
              {/* Back */}
              <div className={`absolute inset-0 ${piece.color} border-[3px] border-white/30 opacity-95 rounded-sm -translate-z-[40px]`} />
              {/* Left */}
              <div className={`absolute inset-0 ${piece.color} border-[3px] border-white/30 opacity-95 rounded-sm -rotate-y-90 translate-x-[-40px]`} />
              {/* Right */}
              <div className={`absolute inset-0 ${piece.color} border-[3px] border-white/30 opacity-95 rounded-sm rotate-y-90 translate-x-[40px]`} />
              {/* Top */}
              <div className={`absolute inset-0 ${piece.color} border-[3px] border-white/30 opacity-95 rounded-sm -rotate-x-90 translate-y-[-40px]`} />
              {/* Bottom */}
              <div className={`absolute inset-0 ${piece.color} border-[3px] border-white/30 opacity-95 rounded-sm rotate-x-90 translate-y-[40px]`} />

              {/* Puzzle notch simulation using small inner overlapping squares */}
              <div className="absolute inset-[30%] bg-white/10 border border-white/20 rounded-full translate-z-[41px]" />
              <div className="absolute inset-[30%] bg-white/10 border border-white/20 rounded-full rotate-y-90 translate-x-[41px]" />
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .perspective-\\[1200px\\] {
          perspective: 1200px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .animate-float-cube {
          animation: floatAndRotate 25s ease-in-out infinite;
        }
        .rotate-x-90 { transform: rotateX(90deg); }
        .rotate-y-90 { transform: rotateY(90deg); }
        .-rotate-x-90 { transform: rotateX(-90deg); }
        .-rotate-y-90 { transform: rotateY(-90deg); }
        .translate-z-\\[40px\\] { transform: translateZ(40px); }
        .-translate-z-\\[40px\\] { transform: translateZ(-40px); }
        .translate-z-\\[41px\\] { transform: translateZ(41px); }
        .translate-x-\\[41px\\] { transform: translateX(41px); }

        @keyframes floatAndRotate {
          0% { transform: rotateX(0deg) rotateY(0deg) translateY(0px); }
          25% { transform: rotateX(20deg) rotateY(90deg) translateY(-20px); }
          50% { transform: rotateX(0deg) rotateY(180deg) translateY(0px); }
          75% { transform: rotateX(-20deg) rotateY(270deg) translateY(20px); }
          100% { transform: rotateX(0deg) rotateY(360deg) translateY(0px); }
        }
      `}</style>
    </div>
  );
}
