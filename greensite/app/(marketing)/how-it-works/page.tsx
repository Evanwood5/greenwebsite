import Navbar from '@/components/layout/Navbar'
import WrapperSection from '@/components/home/WrapperSection'
import { FIELDS } from '@/lib/types/how-it-works'
import { FieldCard, SiteFooter, TrackHeader } from './components'

export default function HowItWorksPage() {
  return (
    <div className="theme-marketing-light min-h-screen" style={{ background: 'var(--surface-app)' }}>
      <Navbar />
      <div style={{ background: 'var(--palette-cream-50)', padding: '16px 120px 0' }}>
        <WrapperSection />
      </div>

      <section id="what-we-track" className="px-6 py-28" style={{ background: 'var(--palette-cream-50)' }}>
        <div className="max-w-5xl mx-auto">
          <TrackHeader />
          <div className="space-y-4">
            {FIELDS.map((field, i) => (
              <FieldCard key={field.id} field={field} index={i} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}