import Navbar from '@/components/layout/Navbar'
import { AiHero, ResumeCard, ResumeMatching, SiteFooter } from './components'

export default function AIPoweredPage() {
  return (
    <>
      <Navbar />
      <AiHero />

      <section id="resume-matching" className="px-6 py-36" style={{ background: '#0f2510' }}>
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <ResumeMatching />
          <ResumeCard />
        </div>
      </section>

      <SiteFooter />
    </>
  )
}