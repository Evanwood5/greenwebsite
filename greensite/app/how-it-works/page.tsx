import Navbar from "@/components/Navbar";
import WrapperSection from "@/components/home/WrapperSection";
import Image from "next/image";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0a1a0a' }}>
      <Navbar />
      <WrapperSection />

      {/* Dashboard showcase section */}
      <section className="px-6 py-24 lg:py-32" style={{ background: '#0a1a0a', borderTop: '1px solid rgba(41,193,21,0.08)' }}>
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left: messaging */}
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: '#29C115' }}>
                The Dashboard
              </p>
              <h2
                className="text-4xl md:text-5xl font-extrabold text-white leading-[1.08] mb-6"
                style={{ letterSpacing: '-0.03em' }}
              >
                One place.<br />Every opportunity.
              </h2>
              <div className="mb-8 pl-4" style={{ borderLeft: '3px solid rgba(255,255,255,0.15)' }}>
                <p className="text-[17px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Filter by category, level, location, and job type across thousands of listings — all in a single clean dashboard built for Michigan students.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  'Filter by tech, business, health, or engineering',
                  'Sort by date, level, and job type',
                  'Save roles and track what you\'ve applied to',
                  'AI matching surfaces your best fits automatically',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#29C115' }} />
                    <span className="text-[15px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: dashboard image */}
            <div className="flex-shrink-0 w-full lg:w-[720px]">
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#ffffff', padding: '20px 12px 10px 16px' }}>
                <Image
                  src="/dash.png"
                  alt="Greenify Dashboard"
                  width={600}
                  height={400}
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer
        style={{ borderTop: '1px solid rgba(41,193,21,0.15)' }}
        className="px-6 py-6"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
            &copy; 2026 Greenify. Trusted by universities across Michigan.
          </p>
          <a
            href="/terms"
            className="text-[13px] font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}
