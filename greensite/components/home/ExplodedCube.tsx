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
    <div className="relative w-full h-[500px] flex items-center justify-center perspective-[1500px]">
      <div className="relative w-64 h-64 preserve-3d animate-master-rotate">
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute inset-0 preserve-3d"
            onMouseEnter={() => setHoveredPiece(piece.id)}
            onMouseLeave={() => setHoveredPiece(null)}
          >
            {/* Animation wrapper */}
            <div className={`absolute inset-0 preserve-3d assemble-piece-${piece.id}`}>
              {/* Hover offset wrapper */}
              <div
                className="absolute inset-0 preserve-3d transition-transform duration-500 ease-out"
                style={{
                  transform: hoveredPiece === piece.id
                    ? `translate3d(${piece.dir.x * 100}px, ${piece.dir.y * 100}px, ${piece.dir.z * 100}px)`
                    : 'translate3d(0, 0, 0)'
                }}
              >
                {piece.indices.map((idx) => {
                  const pos = allSubCubes[idx];
                  return (
                    <div
                      key={idx}
                      className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 preserve-3d"
                      style={{
                        transform: `translate3d(${pos.x * 64}px, ${pos.y * 64}px, ${pos.z * 64}px)`,
                      }}
                    >
                      {/* Cube face with beveled puzzle look */}
                      <div className={`absolute inset-0 ${piece.color} border border-green-900/10 shadow-lg translate-z-[24px]`}>
                        <div className="absolute inset-[2px] border border-white/20 rounded-[1px]" />
                      </div>
                      <div className={`absolute inset-0 ${piece.color} border border-green-900/10 -translate-z-[24px]`} />
                      <div className={`absolute inset-0 ${piece.color} border border-green-900/10 rotate-y-90 translate-x-[24px]`} />
                      <div className={`absolute inset-0 ${piece.color} border border-green-900/10 -rotate-y-90 -translate-x-[24px]`} />
                      <div className={`absolute inset-0 ${piece.color} border border-green-900/10 rotate-x-90 translate-y-[24px]`} />
                      <div className={`absolute inset-0 ${piece.color} border border-green-900/10 -rotate-x-90 -translate-y-[24px]`} />
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
          animation: globalRotate 40s linear infinite;
        }

        @keyframes globalRotate {
          0% { transform: rotateX(-15deg) rotateY(0deg); }
          100% { transform: rotateX(-15deg) rotateY(360deg); }
        }

        /* Exploded state with permanent spacing (gap) */
        ${pieces.map(p => `
          .assemble-piece-${p.id} {
            animation: assemble${p.id} 16s ease-in-out infinite;
          }
          @keyframes assemble${p.id} {
            /* Full exploded state */
            0%, 15%, 85%, 100% { 
              transform: translate3d(${p.dir.x * 260}px, ${p.dir.y * 260}px, ${p.dir.z * 260}px) rotateX(${p.dir.x * 10}deg) rotateY(${p.dir.y * 10}deg); 
              opacity: 0.8; 
            }
            /* "Fitted" state with massive mandatory gap (80px offset) */
            45%, 65% { 
              transform: translate3d(${p.dir.x * 80}px, ${p.dir.y * 80}px, ${p.dir.z * 80}px) rotateX(0deg) rotateY(0deg); 
              opacity: 1; 
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}
