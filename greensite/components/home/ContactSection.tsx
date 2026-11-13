import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";

export default function ContactSection() {
  return (
    <section id="contact" style={{ background: 'var(--palette-cream-50)', borderTop: '1px solid rgb(var(--palette-forest-800-rgb) / 0.08)' }} className="px-6 py-24">
      <div className="max-w-5xl mx-auto">

        <FadeIn className="text-center mb-16">
          <h2
            className="text-5xl md:text-[60px] font-extrabold mb-4"
            style={{ color: 'var(--palette-forest-700)', letterSpacing: '-0.04em' }}
          >
            Get in Touch
          </h2>
          <p className="text-[17px]" style={{ color: 'var(--palette-forest-400)' }}>
            Choose how you&apos;d like to connect with us.
          </p>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: 'rgb(var(--palette-forest-800-rgb) / 0.12)', border: '1px solid rgb(var(--palette-forest-800-rgb) / 0.12)', borderRadius: '16px', overflow: 'hidden' }}>

            {/* Universities */}
            <div className="p-10 flex flex-col" style={{ background: 'var(--palette-white)' }}>
              <div className="mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: 'rgb(var(--palette-forest-800-rgb) / 0.07)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--palette-forest-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--palette-green-500)' }}>Universities</p>
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--palette-forest-700)', letterSpacing: '-0.02em' }}>Partner with us</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--palette-forest-400)' }}>
                  Bring Greenify to your campus. We partner with universities across Michigan to give students real-time access to job opportunities before they hit major boards.
                </p>
              </div>
              <ul className="space-y-3 mb-10 flex-1">
                {['Exclusive student access', 'Campus-wide job insights', 'Trusted & secure platform'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[13px]" style={{ color: 'var(--palette-forest-500)' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--palette-green-500)' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:partnerships@greenify.io"
                className="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-bold rounded transition-all duration-200 w-fit"
                style={{ background: 'var(--palette-forest-800)', color: 'var(--palette-white)' }}
              >
                Email us
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>

            {/* Discord */}
            <div className="p-10 flex flex-col" style={{ background: 'var(--palette-white)' }}>
              <div className="mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: 'rgb(var(--palette-discord-500-rgb) / 0.07)' }}
                >
                  <Image src="/disc.png" alt="Discord" width={20} height={20} />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--palette-discord-500)' }}>Community</p>
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--palette-forest-700)', letterSpacing: '-0.02em' }}>Join our Discord</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--palette-forest-400)' }}>
                  Have a question or need support? Our Discord community is the fastest way to get help from our team and connect with other Michigan students.
                </p>
              </div>
              <ul className="space-y-3 mb-10 flex-1">
                {['Get help from our team', 'Connect with other students', 'Stay updated on new features'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[13px]" style={{ color: 'var(--palette-forest-500)' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--palette-discord-500)' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://discord.gg/SduTEu4C6w"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-bold rounded transition-all duration-200 w-fit"
                style={{ background: 'var(--palette-discord-500)', color: 'var(--palette-white)' }}
              >
                Join Discord
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>

          </div>
        </FadeIn>

      </div>
    </section>
  )
}
