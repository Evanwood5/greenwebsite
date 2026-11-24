import Navbar from '@/components/layout/Navbar'
import { PRIVACY_LAST_UPDATED, PRIVACY_SECTIONS } from '@/lib/utils/privacy'
import { PrivacyHeader, PrivacySection } from './components'

export default function PrivacyPage() {
  return (
    <div className="theme-marketing-light min-h-screen" style={{ background: 'var(--surface-app)' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <PrivacyHeader lastUpdated={PRIVACY_LAST_UPDATED} />
        {PRIVACY_SECTIONS.map((section) => (
          <PrivacySection key={section.title} section={section} />
        ))}
      </div>
    </div>
  )
}
