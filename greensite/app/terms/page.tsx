import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f0ece4' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1a2e1a', letterSpacing: '-0.03em' }}>Terms of Service</h1>
        <p className="text-[13px] mb-12" style={{ color: '#7a9a7a' }}>Last updated: July 2026</p>

        {[
          {
            title: 'Acceptance of Terms',
            body: 'By accessing or using Greenify, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.',
          },
          {
            title: 'Use of the Platform',
            body: 'Greenify provides real-time job tracking sourced from public company career pages. You agree to use the platform for lawful purposes only and not to misuse, scrape, or attempt to reverse-engineer any part of the service.',
          },
          {
            title: 'Account Responsibility',
            body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.',
          },
          {
            title: 'Data & Privacy',
            body: 'We collect minimal data necessary to provide the service. Job listings are sourced from publicly available company career pages. We do not sell your personal information to third parties.',
          },
          {
            title: 'Intellectual Property',
            body: 'All content, branding, and technology on Greenify is the property of Greenify. You may not reproduce or distribute any part of the platform without written permission.',
          },
          {
            title: 'Disclaimer',
            body: 'Greenify surfaces job listings from public sources and links directly to company career pages. We make no guarantees about the accuracy, completeness, or availability of any job listing.',
          },
          {
            title: 'Changes to Terms',
            body: 'We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.',
          },
          {
            title: 'Contact',
            body: 'For questions about these terms, reach out to us via Discord or email partnerships@greenify.io.',
          },
        ].map((section) => (
          <div key={section.title} className="mb-10">
            <h2 className="text-[16px] font-bold mb-2" style={{ color: '#1a2e1a' }}>{section.title}</h2>
            <p className="text-[14px] leading-relaxed" style={{ color: '#5a7a5a' }}>{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
