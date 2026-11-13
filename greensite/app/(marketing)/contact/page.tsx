import Navbar from '@/components/layout/Navbar'
import { BeforeAfterCard, TerminalCard } from '@/components/home/WhyUsVisuals'
import { FEATURE_SECTIONS, TOOLS } from '@/lib/types/contact'
import { FeatureSection, Hero, MichiganMap, SiteFooter, ToolsSection } from './components'

export default function WhyUsPage() {
  return (
    <div className="theme-marketing-light min-h-screen flex flex-col" style={{ background: 'var(--surface-app)' }}>
      <Navbar />
      <Hero />
      <FeatureSection data={FEATURE_SECTIONS[0]} visual={<BeforeAfterCard />} />
      <FeatureSection data={FEATURE_SECTIONS[1]} visual={<TerminalCard />} />
      <FeatureSection data={FEATURE_SECTIONS[2]} visual={<MichiganMap />} />
      <ToolsSection tools={TOOLS} />
      <SiteFooter />
    </div>
  )
}