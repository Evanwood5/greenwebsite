'use client'

function DiscordIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="40" fill="#2a2a2a"/>
      <circle cx="40" cy="30" r="14" fill="#444"/>
      <ellipse cx="34" cy="28" rx="3" ry="4" fill="#222"/>
      <ellipse cx="46" cy="28" rx="3" ry="4" fill="#222"/>
      <circle cx="34" cy="28" r="1.5" fill="white"/>
      <circle cx="46" cy="28" r="1.5" fill="white"/>
      <path d="M32 35 Q40 40 48 35" stroke="#888" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M28 20 Q26 14 30 12" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
      <path d="M52 20 Q54 14 50 12" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
      <rect x="24" y="46" width="32" height="18" rx="4" fill="#333"/>
      <circle cx="32" cy="55" r="4" fill="#555"/>
      <circle cx="48" cy="55" r="4" fill="#555"/>
    </svg>
  );
}

function UniversityIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="40" fill="#2a2a2a"/>
      <rect x="18" y="38" width="44" height="24" rx="2" fill="#444"/>
      <polygon points="40,16 14,38 66,38" fill="#555"/>
      <rect x="34" y="50" width="12" height="12" rx="1" fill="#333"/>
      <rect x="20" y="44" width="8" height="8" rx="1" fill="#333"/>
      <rect x="52" y="44" width="8" height="8" rx="1" fill="#333"/>
      <rect x="37" y="10" width="6" height="8" fill="#666"/>
      <rect x="36" y="8" width="8" height="4" rx="1" fill="#777"/>
    </svg>
  );
}

export default function CTASection() {
  return (
    <>
      <section id="contact" style={{ background: '#1a1a1a' }} className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold">
              <span className="text-white">Get in </span>
              <span className="text-green-400">Touch</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Need Help */}
            <div style={{ background: '#242424' }} className="rounded-2xl p-8">
              <h3 className="text-white font-bold text-lg mb-3">Need Help?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                For{' '}
                <span className="text-green-400">personal support</span>
                , questions, or technical issues, join our{' '}
                <span className="text-green-400">Discord community</span>
                . Our team and fellow students are ready to help you get the most out of Greenify.
              </p>
              <div className="flex items-center justify-between gap-4">
                <a
                  href="https://discord.gg/greenify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors duration-200 cursor-pointer"
                  style={{ background: '#5865F2' }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#4752C4')}
                  onMouseOut={(e) => (e.currentTarget.style.background = '#5865F2')}
                >
                  Join Discord Community
                </a>
                <DiscordIcon />
              </div>
            </div>

            {/* University Partnerships */}
            <div style={{ background: '#242424' }} className="rounded-2xl p-8">
              <h3 className="text-white font-bold text-lg mb-3">University Partnerships</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Is your{' '}
                <span className="text-green-400">institution</span>
                {' '}interested in bringing{' '}
                <span className="text-green-400">Greenify</span>
                {' '}to your students? We&apos;d love to partner with you to provide{' '}
                <span className="text-green-400">exclusive job tracking services</span>
                {' '}to your university.
              </p>
              <div className="flex items-center justify-between gap-4">
                <a
                  href="mailto:partnerships@greenify.io"
                  className="px-5 py-2.5 text-sm font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                >
                  Get in Touch
                </a>
                <UniversityIcon />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: '#1a1a1a' }} className="px-6 pb-8 pt-2 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-center relative">
          <p className="text-gray-500 text-sm text-center">
            &copy; 2026 Greenify. Trusted by universities across Michigan.
          </p>
          <button
            className="absolute right-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200"
            style={{ background: '#242424' }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#333')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#242424')}
            aria-label="Help"
          >
            <span className="text-white text-sm font-bold">?</span>
          </button>
        </div>
      </footer>
    </>
  );
}
