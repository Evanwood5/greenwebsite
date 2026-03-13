'use client';

import { useState } from 'react';

export default function ExplodedCube() {
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);

  // Define 27 positions for a 3x3x3 cube
  // Group them into 5 distinct "pieces"
  const allSubCubes: { x: number; y: number; z: number }[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        allSubCubes.push({ x, y, z });
      }
    }
  }

  // Assign each sub-cube to one of 5 pieces based on index or position
  // Piece 1: 6 cubes, Piece 2: 5 cubes, Piece 3: 5 cubes, Piece 4: 5 cubes, Piece 5: 6 cubes
  const pieces = [
    { id: 1, indices: [0, 1, 2, 3, 4, 13], color: 'bg-green-600', dir: { x: 1, y: 1, z: 1 } },
    { id: 2, indices: [5, 6, 7, 8, 14], color: 'bg-green-500', dir: { x: -1, y: 1, z: 1 } },
    { id: 3, indices: [9, 10, 11, 12, 15], color: 'bg-green-400', dir: { x: 1, y: -1, z: 1 } },
    { id: 4, indices: [16, 17, 18, 19, 20], color: 'bg-green-700', dir: { x: -1, y: -1, z: 1 } },
    { id: 5, indices: [21, 22, 23, 24, 25, 26], color: 'bg-green-800', dir: { x: 0, y: 0, z: -1 } },
  ];

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center perspective-[1500px]">
      <div className="relative w-64 h-64 preserve-3d animate-master-rotate">
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className={`absolute inset-0 preserve-3d transition-transform duration-500 assemble-piece-${piece.id}`}
            style={{
              // Hover effect: push the piece slightly along its "explosion" vector
              transform: hoveredPiece === piece.id
                ? `translate3d(${piece.dir.x * 20}px, ${piece.dir.y * 20}px, ${piece.dir.z * 20}px)`
                : ''
            }}
            onMouseEnter={() => setHoveredPiece(piece.id)}
            onMouseLeave={() => setHoveredPiece(null)}
          >
            {piece.indices.map((idx) => {
              const pos = allSubCubes[idx];
              return (
                <div
                  key={idx}
                  className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 preserve-3d"
                  style={{
                    transform: `translate3d(${pos.x * 48}px, ${pos.y * 48}px, ${pos.z * 48}px)`,
                  }}
                >
                  {/* Sub-cube faces with puzzle details */}
                  <div className={`absolute inset-0 ${piece.color} border border-white/20 opacity-90 rounded-[2px] translate-z-[24px]`}>
                    <div className="absolute inset-2 border border-white/10 rounded-full" />
                  </div>
                  <div className={`absolute inset-0 ${piece.color} border border-white/20 opacity-90 rounded-[2px] -translate-z-[24px]`} />
                  <div className={`absolute inset-0 ${piece.color} border border-white/20 opacity-90 rounded-[2px] rotate-y-90 translate-x-[24px]`} />
                  <div className={`absolute inset-0 ${piece.color} border border-white/20 opacity-90 rounded-[2px] -rotate-y-90 -translate-x-[24px]`} />
                  <div className={`absolute inset-0 ${piece.color} border border-white/20 opacity-90 rounded-[2px] rotate-x-90 translate-y-[24px]`} />
                  <div className={`absolute inset-0 ${piece.color} border border-white/20 opacity-90 rounded-[2px] -rotate-x-90 -translate-y-[24px]`} />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        .preserve-3d { transform-style: preserve-3d; }
        .animate-master-rotate {
          animation: globalRotate 30s linear infinite;
        }

        @keyframes globalRotate {
          from { transform: rotateX(-20deg) rotateY(0deg); }
          to { transform: rotateX(-20deg) rotateY(360deg); }
        }

        /* Piece-specific assembly animations */
        ${pieces.map(p => `
          .assemble-piece-${p.id} {
            animation: assemblePiece${p.id} 12s ease-in-out infinite;
          }
          @keyframes assemblePiece${p.id} {
            0%, 20%, 80%, 100% { transform: translate3d(${p.dir.x * 120}px, ${p.dir.y * 120}px, ${p.dir.z * 120}px) scale(0.8); opacity: 0.6; }
            40%, 60% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}
