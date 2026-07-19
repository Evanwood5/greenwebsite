import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";

export default function DetroitHeroSection() {
  return (
    <section className="relative overflow-hidden px-8 md:px-16 lg:px-24 flex items-center justify-center" style={{ minHeight: '980px' }}>
      {/* Detroit.jpg background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/Detroit.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Lighter overlay — image stays visible */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.58)' }} />

      {/* Centered content */}
      <FadeIn className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">

        <h2
          className="text-5xl md:text-6xl lg:text-[68px] font-extrabold text-white leading-[1.05] mb-5"
          style={{ letterSpacing: '-0.03em' }}
        >
          Find Jobs Before<br />Anyone Else
        </h2>

        <p className="text-[18px] text-white/80 leading-relaxed mb-10 max-w-lg">
          Real-time job tracking directly from company career pages.
          Discover opportunities before they hit major job boards.
        </p>

        <Link
          href="/how-it-works"
          className="inline-flex items-center gap-2 px-4 py-2 text-[15px] font-bold rounded transition-all duration-200 active:scale-[0.97]"
          style={{ background: '#ffffff', color: '#1a1a1a' }}
        >
          How It Works
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>

      </FadeIn>
    </section>
  );
}
