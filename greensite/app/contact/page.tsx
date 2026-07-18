import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f0ece4' }}>
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-20">

        <div className="text-center mb-16">
          <h1
            className="text-5xl md:text-[60px] font-extrabold mb-4"
            style={{ color: '#1a2e1a', letterSpacing: '-0.04em' }}
          >
            Get in Touch
          </h1>
          <p className="text-[17px]" style={{ color: '#5a7a5a' }}>
            Choose how you&apos;d like to connect with us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: 'rgba(30,58,30,0.12)', border: '1px solid rgba(30,58,30,0.12)', borderRadius: '16px', overflow: 'hidden' }}>

          {/* Universities */}
          <div className="p-10 flex flex-col" style={{ background: '#ffffff' }}>
            <div className="mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                style={{ background: 'rgba(30,58,30,0.07)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2e1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: '#29C115' }}>Universities</p>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#1a2e1a', letterSpacing: '-0.02em' }}>Partner with us</h2>
              <p className="text-[14px] leading-relaxed" style={{ color: '#5a7a5a' }}>
                Bring Greenify to your campus. We partner with universities across Michigan to give students real-time access to job opportunities before they hit major boards.
              </p>
            </div>

            <ul className="space-y-3 mb-10 flex-1">
              {['Exclusive student access', 'Campus-wide job insights', 'Trusted & secure platform'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[13px]" style={{ color: '#4a5e4a' }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#29C115' }} />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="mailto:partnerships@greenify.io"
              className="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-bold rounded transition-all duration-200 w-fit"
              style={{ background: '#1e3a1e', color: '#ffffff' }}
            >
              Email us
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          {/* Discord */}
          <div className="p-10 flex flex-col" style={{ background: '#ffffff' }}>
            <div className="mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                style={{ background: 'rgba(88,101,242,0.07)' }}
              >
                <Image src="/disc.png" alt="Discord" width={20} height={20} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: '#5865F2' }}>Community</p>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#1a2e1a', letterSpacing: '-0.02em' }}>Join our Discord</h2>
              <p className="text-[14px] leading-relaxed" style={{ color: '#5a7a5a' }}>
                Have a question or need support? Our Discord community is the fastest way to get help from our team and connect with other Michigan students.
              </p>
            </div>

            <ul className="space-y-3 mb-10 flex-1">
              {['Get help from our team', 'Connect with other students', 'Stay updated on new features'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[13px]" style={{ color: '#4a5e4a' }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#5865F2' }} />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="https://discord.gg/SduTEu4C6w"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-bold rounded transition-all duration-200 w-fit"
              style={{ background: '#5865F2', color: '#ffffff' }}
            >
              Join Discord
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

        </div>
      </div>

      <footer
        style={{ borderTop: '1px solid rgba(30,58,30,0.3)' }}
        className="px-6 py-6"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-[13px] font-semibold" style={{ color: 'rgba(30,58,30,0.85)' }}>
            &copy; 2026 Greenify. Trusted by universities across Michigan.
          </p>
          <a
            href="/terms"
            className="text-[13px] font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'rgba(30,58,30,0.85)' }}
          >
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}
