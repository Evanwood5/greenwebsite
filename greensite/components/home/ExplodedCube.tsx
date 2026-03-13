'use client';

export default function ExplodedCube() {
    return (
        <div className="relative w-full h-[400px] flex items-center justify-center perspective-[1000px]">
            <div className="relative w-48 h-48 preserve-3d animate-rotate-slow">
                {/* Core center cube (optional) */}

                {/* Exploded pieces mapping */}
                {[
                    { x: 1.2, y: 1.2, z: 1.2, color: 'bg-green-600' },
                    { x: -1.2, y: 1.2, z: 1.2, color: 'bg-green-500' },
                    { x: 1.2, y: -1.2, z: 1.2, color: 'bg-green-400' },
                    { x: -1.2, y: -1.2, z: 1.2, color: 'bg-green-700' },
                    { x: 1.2, y: 1.2, z: -1.2, color: 'bg-green-500' },
                    { x: -1.2, y: 1.2, z: -1.2, color: 'bg-green-600' },
                    { x: 1.2, y: -1.2, z: -1.2, color: 'bg-green-800' },
                    { x: -1.2, y: -1.2, z: -1.2, color: 'bg-green-500' },
                ].map((piece, i) => (
                    <div
                        key={i}
                        className="absolute top-0 left-0 w-16 h-16 preserve-3d transition-transform duration-700 hover:scale-110"
                        style={{
                            transform: `translate3d(${piece.x * 60}px, ${piece.y * 60}px, ${piece.z * 60}px)`,
                        }}
                    >
                        {/* Cube faces */}
                        <div className={`absolute inset-0 ${piece.color} border border-white/20 opacity-90 translate-z-[32px]`} />
                        <div className={`absolute inset-0 ${piece.color} border border-white/20 opacity-90 -translate-z-[32px]`} />
                        <div className={`absolute inset-0 ${piece.color} border border-white/20 opacity-90 rotate-y-90 translate-x-[32px]`} />
                        <div className={`absolute inset-0 ${piece.color} border border-white/20 opacity-90 -rotate-y-90 -translate-x-[32px]`} />
                        <div className={`absolute inset-0 ${piece.color} border border-white/20 opacity-90 rotate-x-90 translate-y-[32px]`} />
                        <div className={`absolute inset-0 ${piece.color} border border-white/20 opacity-90 -rotate-x-90 -translate-y-[32px]`} />
                    </div>
                ))}
            </div>

            <style jsx>{`
        .perspective-[1000px] {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .animate-rotate-slow {
          animation: rotate 20s linear infinite;
        }
        .rotate-x-90 { transform: rotateX(90deg); }
        .rotate-y-90 { transform: rotateY(90deg); }
        .-rotate-x-90 { transform: rotateX(-90deg); }
        .-rotate-y-90 { transform: rotateY(-90deg); }
        .translate-z-\\[32px\\] { transform: translateZ(32px); }
        .-translate-z-\\[32px\\] { transform: translateZ(-32px); }
        .translate-x-\\[32px\\] { transform: translateX(32px); }
        .-translate-x-\\[32px\\] { transform: translateX(-32px); }
        .translate-y-\\[32px\\] { transform: translateY(32px); }
        .-translate-y-\\[32px\\] { transform: translateY(-32px); }

        @keyframes rotate {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>
        </div>
    );
}
