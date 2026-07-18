import Navbar from "@/components/Navbar";
import WrapperSection from "@/components/home/WrapperSection";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0a1a0a' }}>
      <Navbar />
      <WrapperSection />
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
