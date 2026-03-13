'use client';

import { useState } from 'react';

export default function ExplodedCube() {
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);

  // 3x3x3 grid coordinates
  const allSubCubes: { x: number; y: number; z: number }[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        allSubCubes.push({ x, y, z });
      }
    }
  }

  // Grouping 27 cubes into Tetris-style interlocking pieces
  const pieces = [
    { id: 1, name: 'L-Shape', indices: [0, 1, 2, 3, 12], color: 'bg-green-600', dir: { x: -1, y: -1, z: 1 } },
    { id: 2, name: 'T-Shape', indices: [4, 5, 13, 14, 22, 23], color: 'bg-green-500', dir: { x: 1, y: -1, z: 1 } },
    { id: 3, name: 'Z-Shape', indices: [6, 7, 8, 15, 16, 17], color: 'bg-green-400', dir: { x: -1, y: 1, z: 1 } },
    { id: 4, name: 'J-Shape', indices: [9, 10, 11, 18, 19, 20], color: 'bg-green-700', dir: { x: 1, y: 1, z: 1 } },
    { id: 5, name: 'Core', indices: [21, 24, 25, 26], color: 'bg-green-800', dir: { x: 0, y: 0, z: -1 } },
  ];

  return (
    <div className="relative w-full h-[700px] flex items-center justify-center perspective-[2500px]">
      <div className="relative w-[400px] h-[400px] preserve-3d animate-master-rotate">
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute inset-0 preserve-3d"
            onMouseEnter={() => setHoveredPiece(piece.id)}
            onMouseLeave={() => setHoveredPiece(null)}
          >
            {/* Animation wrapper */}
            <div className={`absolute inset-0 preserve-3d assemble-piece-${piece.id}`}>
              {/* Hover offset wrapper - pulling further apart */}
              <div
                className="absolute inset-0 preserve-3d transition-transform duration-1000 ease-out"
                style={{
                  transform: hoveredPiece === piece.id
                    ? `translate3d(${piece.dir.x * 250}px, ${piece.dir.y * 250}px, ${piece.dir.z * 250}px)`
                    : 'translate3d(0, 0, 0)'
                }}
              >
                {piece.indices.map((idx) => {
                  const pos = allSubCubes[idx];
                  return (
                    <div
                      key={idx}
                      className="absolute top-1/2 left-1/2 w-20 h-20 -ml-10 -mt-10 preserve-3d"
                      style={{
                        transform: `translate3d(${pos.x * 140}px, ${pos.y * 140}px, ${pos.z * 140}px)`,
                      }}
                    >
                      {/* Cube faces with technical dashed outline */}
                      <div className={`absolute inset-0 ${piece.color} border-2 border-dashed border-white/40 shadow-2xl translate-z-[40px]`}>
                        <div className="absolute inset-[4px] border border-white/10 rounded-[1px]" />
                      </div>
                      <div className={`absolute inset-0 ${piece.color} border-2 border-dashed border-white/40 -translate-z-[40px]`} />
                      <div className={`absolute inset-0 ${piece.color} border-2 border-dashed border-white/40 rotate-y-90 translate-x-[40px]`} />
                      <div className={`absolute inset-0 ${piece.color} border-2 border-dashed border-white/40 -rotate-y-90 -translate-x-[40px]`} />
                      <div className={`absolute inset-0 ${piece.color} border-2 border-dashed border-white/40 rotate-x-90 translate-y-[40px]`} />
                      <div className={`absolute inset-0 ${piece.color} border-2 border-dashed border-white/40 -rotate-x-90 -translate-y-[40px]`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .preserve-3d { transform-style: preserve-3d; }
        .animate-master-rotate {
          animation: globalRotate 60s linear infinite;
        }

        @keyframes globalRotate {
          0% { transform: rotateX(-20deg) rotateY(0deg); }
          100% { transform: rotateX(-20deg) rotateY(360deg); }
        }

        /* Pull-apart animation sequence: Compressed (0%) -> Exploded (50%) -> Compressed (100%) */
        ${pieces.map(p => `
          .assemble-piece-${p.id} {
            animation: assemble${p.id} 32s ease-in-out infinite;
          }
          @keyframes assemble${p.id} {
            /* Compressed solid cube state */
            0%, 5%, 95%, 100% { 
              transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg);
              opacity: 1;
            }
            /* Fully pull-apart (exploded) state at midpoint */
            45%, 55% { 
              transform: translate3d(${p.dir.x * 550}px, ${p.dir.y * 550}px, ${p.dir.z * 550}px) rotateX(${p.dir.x * 15}deg) rotateY(${p.dir.y * 15}deg);
              opacity: 0.4; 
            }
            /* Slow drift/resting in exploded state */
            25%, 75% { 
              transform: translate3d(${p.dir.x * 220}px, ${p.dir.y * 220}px, ${p.dir.z * 220}px) rotateX(${p.dir.x * 5}deg) rotateY(${p.dir.y * 5}deg);
              opacity: 0.8;
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}
