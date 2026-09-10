import { LegalSection, paragraphsOf } from '@/lib/types/terms'

export function TermsHeader({ lastUpdated }: { lastUpdated: string }) {
  return (
    <>
      <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1a2e1a', letterSpacing: '-0.03em' }}>
        Terms of Service
      </h1>
      <p className="text-[13px] mb-12" style={{ color: '#7a9a7a' }}>Last updated: {lastUpdated}</p>
    </>
  )
}

export function TermsSection({ section }: { section: LegalSection }) {
  return (
    <div className="mb-10">
      <h2 className="text-[16px] font-bold mb-2" style={{ color: '#1a2e1a' }}>{section.title}</h2>
      {paragraphsOf(section.body).map((paragraph, i) => (
        <p key={i} className="text-[14px] leading-relaxed mb-3" style={{ color: '#5a7a5a' }}>
          {paragraph}
        </p>
      ))}
    </div>
  )
}