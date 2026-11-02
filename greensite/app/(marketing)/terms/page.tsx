import Navbar from '@/components/layout/Navbar'
import { LAST_UPDATED, SECTIONS } from '@/lib/utils/terms'
import { TermsHeader, TermsSection } from './components'

export default function TermsPage() {
  return (
    <div className="theme-marketing-light min-h-screen" style={{ background: 'var(--surface-app)' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <TermsHeader lastUpdated={LAST_UPDATED} />
        {SECTIONS.map((section) => (
          <TermsSection key={section.title} section={section} />
        ))}
      </div>
    </div>
  )
}