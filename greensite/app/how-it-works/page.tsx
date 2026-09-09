import Navbar from '@/components/layout/Navbar'
import WrapperSection from '@/components/home/WrapperSection'
import { FIELDS } from './types'
import { FieldCard, SiteFooter, TrackHeader } from './components'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f0ece4' }}>
      <Navbar />
      <div style={{ background: '#f0ece4', padding: '16px 120px 0' }}>
        <WrapperSection />
      </div>

      <section id="what-we-track" className="px-6 py-28" style={{ background: '#f0ece4' }}>
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