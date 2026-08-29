'use client'

export default function CTASection() {
  return (
    <footer
      style={{ background: '#f0ece4', borderTop: '1px solid rgba(30,58,30,0.3)' }}
      className="px-6 py-6"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <p className="text-[13px] font-semibold" style={{ color: 'rgba(30,58,30,0.85)' }}>
          &copy; 2026 Greenify LLC
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
  )
}
