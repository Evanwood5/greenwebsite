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
    <div className="relative w-full h-[600px] flex items-center justify-center perspective-[2000px]">
      <div className="relative w-80 h-80 preserve-3d animate-master-rotate">
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
                className="absolute inset-0 preserve-3d transition-transform duration-500 ease-out"
                style={{
                  transform: hoveredPiece === piece.id
                    ? `translate3d(${piece.dir.x * 200}px, ${piece.dir.y * 200}px, ${piece.dir.z * 200}px)`
                    : 'translate3d(0, 0, 0)'
                }}
              >
                {piece.indices.map((idx) => {
                  const pos = allSubCubes[idx];
                  return (
                    <div
                      key={idx}
                      className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 preserve-3d"
                      style={{
                        transform: `translate3d(${pos.x * 110}px, ${pos.y * 110}px, ${pos.z * 110}px)`,
                      }}
                    >
                      {/* Cube faces with technical dashed outline */}
                      <div className={`absolute inset-0 ${piece.color} border-2 border-dashed border-white/40 shadow-2xl translate-z-[32px]`}>
                        <div className="absolute inset-[3px] border border-white/10 rounded-[1px]" />
                      </div>
                      <div className={`absolute inset-0 ${piece.color} border-2 border-dashed border-white/40 -translate-z-[32px]`} />
                      <div className={`absolute inset-0 ${piece.color} border-2 border-dashed border-white/40 rotate-y-90 translate-x-[32px]`} />
                      <div className={`absolute inset-0 ${piece.color} border-2 border-dashed border-white/40 -rotate-y-90 -translate-x-[32px]`} />
                      <div className={`absolute inset-0 ${piece.color} border-2 border-dashed border-white/40 rotate-x-90 translate-y-[32px]`} />
                      <div className={`absolute inset-0 ${piece.color} border-2 border-dashed border-white/40 -rotate-x-90 -translate-y-[32px]`} />
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
          animation: globalRotate 45s linear infinite;
        }

        @keyframes globalRotate {
          0% { transform: rotateX(-20deg) rotateY(0deg); }
          100% { transform: rotateX(-20deg) rotateY(360deg); }
        }

        /* Pull-apart animation sequence with massive offsets */
        ${pieces.map(p => `
          .assemble-piece-${p.id} {
            animation: assemble${p.id} 18s ease-in-out infinite;
          }
          @keyframes assemble${p.id} {
            /* Fully pull-apart (exploded) state */
            0%, 15%, 85%, 100% { 
              transform: translate3d(${p.dir.x * 500}px, ${p.dir.y * 500}px, ${p.dir.z * 500}px);
              opacity: 0.5; 
            }
            /* "Resting" exploded state (massive whitespace) */
            45%, 65% { 
              transform: translate3d(${p.dir.x * 180}px, ${p.dir.y * 180}px, ${p.dir.z * 180}px);
              opacity: 1; 
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}
