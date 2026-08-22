import Navbar from "@/components/Navbar";

const sections = [
  {
    title: "AGREEMENT TO OUR LEGAL TERMS",
    body: `We are Greenify ("Company," "we," "us," "our"), a startup project based in Michigan, United States, in the process of formally incorporating as a limited liability company (LLC).

We operate the website greenify.com (the "Site") and any related products and services that refer or link to these legal terms (collectively, the "Services").

Greenify is an AI-powered sustainable job discovery platform. Job seekers use Greenify to discover green and sustainability-focused career opportunities, receive AI-powered job matches, and manage their job search. Greenify provides software and tools only. It is not an employer, staffing agency, or a party to any employment contracts.

These Legal Terms constitute a legally binding agreement between you and Greenify concerning your access to and use of the Services. By accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.

We reserve the right to make changes to these Legal Terms at any time by updating the "Last updated" date. Your continued use of the Services after such changes constitutes your acceptance of the revised terms.

The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services.`,
  },
  {
    title: "1. Our Services",
    body: `Greenify is a job discovery platform focused on sustainable, green, and environmentally conscious career opportunities, with a current focus on the state of Michigan. The Services allow users to browse job postings, receive AI-generated job matches, save jobs, upload resumes, and track companies of interest.

The information provided through the Services is not intended for distribution in any jurisdiction where such use would be contrary to law or regulation. Greenify does not guarantee the availability, accuracy, or completeness of any job listing, match, or recommendation provided through the Services.`,
  },
  {
    title: "2. Intellectual Property Rights",
    body: `We are the owner or licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, text, graphics, and other content (collectively, the "Content"), as well as any trademarks, service marks, and logos (the "Marks").

Subject to your compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable license to access and use the Services solely for your personal, non-commercial job-search purposes.

No part of the Services, Content, or Marks may be copied, reproduced, scraped, aggregated, republished, sold, or otherwise exploited for any commercial purpose without our express prior written permission. Any breach of these Intellectual Property Rights will constitute a material breach of these Legal Terms and your right to use the Services will terminate immediately.`,
  },
  {
    title: "3. User Representations",
    body: `By using the Services, you represent and warrant that: (1) all registration information you submit is true, accurate, current, and complete; (2) you will maintain the accuracy of such information; (3) you have the legal capacity to agree to these Legal Terms; (4) you are not a minor in the jurisdiction in which you reside; (5) you will not access the Services through automated or non-human means, including bots or scripts; (6) you will not use the Services for any illegal or unauthorized purpose; (7) your use of the Services will not violate any applicable law or regulation; and (8) any resume, profile, or application information you provide is truthful and accurately represents your qualifications and experience.

If you provide any information that is untrue, inaccurate, or incomplete, we have the right to suspend or terminate your account and refuse any current or future use of the Services.`,
  },
  {
    title: "4. User Registration",
    body: `You may be required to register to use certain features of the Services. You agree to keep your password confidential and are responsible for all use of your account. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate or otherwise objectionable. You are responsible for maintaining the security of your account credentials. Greenify is not liable for any loss or damage arising from your failure to maintain account security.`,
  },
  {
    title: "5. Prohibited Activities",
    body: `You may not access or use the Services for any purpose other than that for which we make the Services available. As a user of the Services, you agree not to: systematically retrieve data to compile a database or directory without written permission; use data mining, robots, scrapers, or similar tools on the Services; attempt to gain unauthorized access to any portion of the Services; circumvent, disable, or interfere with security-related features; upload or transmit viruses or other harmful code; attempt to impersonate another user; use the Services to harass or harm another person; submit false, misleading, or fraudulent resume or profile information; use the Services for revenue-generating purposes without authorization; sell or transfer your account; decipher, decompile, disassemble, or reverse engineer any software comprising the Services; or apply to jobs without a genuine intent to seek employment.`,
  },
  {
    title: "6. Third-Party Job Data and Content",
    body: `Many job postings available through the Services are aggregated from third-party websites, public sources, and job boards through automated data collection processes. Greenify does not create, verify, or endorse these job listings.

Greenify makes no representations or warranties regarding: the accuracy, completeness, or currency of any job listing; whether a listed position is still open or actively hiring; the legitimacy or conduct of any employer whose jobs appear on the platform; or whether compensation, location, or other listed details are accurate.

Job listings and other content may contain links to third-party websites that are not under our control. We are not responsible for their content, privacy practices, or accuracy. The appearance of a company or job posting on Greenify does not constitute an endorsement or verification of that employer or opportunity.`,
  },
  {
    title: "7. AI-Powered Features — Disclaimer and Limitations",
    body: `Greenify uses artificial intelligence and machine learning algorithms to provide job matching, recommendations, and analytics features (collectively, "AI Features").

You acknowledge and agree that: AI-generated matches and recommendations are suggestions only and do not constitute professional career advice; AI Features may produce inaccurate, incomplete, or irrelevant results — no AI system is perfect; Greenify does not guarantee that AI-generated matches will result in interviews, job offers, or employment outcomes of any kind; you should not rely solely on AI-generated recommendations when making career decisions; Greenify is not responsible for any decisions you make based on AI-generated content; and AI models used in the Services may be provided by or incorporate third-party AI providers.

We reserve the right to modify, update, or discontinue AI Features at any time without notice.`,
  },
  {
    title: "8. Resume and Profile Data",
    body: `When you upload a resume or provide profile information through the Services, you grant Greenify a limited, non-exclusive license to store, process, and use that information solely for the purpose of providing the Services to you, including generating AI-powered job matches and recommendations.

You represent and warrant that any resume or profile information you upload is accurate, your own original work, and that you have the right to upload and share such information.

We will not sell your resume data to third parties, share your resume with employers without your explicit action, or use your resume data to train AI models in a way that identifies you personally without your consent. You may delete your resume and profile data at any time through your account settings.`,
  },
  {
    title: "9. User Data and Retention",
    body: `We collect and store certain data you provide or that is generated through your use of the Services. We maintain the following data retention practices: saved jobs are retained for 1 year from the date saved; job match results are retained for 7 days; company tracking matches are retained for 7 days; job rejection records are retained for 1 day; scraper and activity logs are retained for 1 day; and account and profile data is retained until account deletion.

You are solely responsible for any data you transmit to the Services. We do not guarantee that data will be retained for any specific period beyond what is stated above. You agree that we shall have no liability for any loss or corruption of your data, and you waive any right of action against us arising from any such loss or corruption. You may request deletion of your account and associated data at any time by contacting us.`,
  },
  {
    title: "10. Services Management",
    body: `We reserve the right to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who violates the law or these Legal Terms; (3) in our sole discretion and without notice, restrict access to or limit the availability of any portion of the Services; (4) remove or disable files and content that are excessive in size or burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.`,
  },
  {
    title: "11. Privacy Policy",
    body: `We care about data privacy and security. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms by reference. A full Privacy Policy will be published separately. If you have questions about how we collect or use your data, please contact us.`,
  },
  {
    title: "12. Copyright Infringements",
    body: `We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please notify us using the contact information provided below. Please be advised that you may be held liable for damages if you make material misrepresentations in a copyright infringement notification.`,
  },
  {
    title: "13. Term and Termination",
    body: `These Legal Terms shall remain in full force and effect while you use the Services. We reserve the right, in our sole discretion and without notice or liability, to deny access to and use of the Services to any person for any reason, including breach of any representation, warranty, or covenant in these Legal Terms. We may terminate your account and delete any content or information associated with your account at any time, without warning, in our sole discretion.

If your account is terminated, you are prohibited from registering a new account under any name without our permission. We reserve the right to take appropriate legal action, including pursuing civil, criminal, and injunctive redress.`,
  },
  {
    title: "14. Modifications and Interruptions",
    body: `We reserve the right to change, modify, or remove the contents of the Services at any time for any reason at our sole discretion without notice. We may also modify or discontinue all or part of the Services without notice at any time. We cannot guarantee the Services will be available at all times. We have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access the Services during any downtime.`,
  },
  {
    title: "15. Governing Law",
    body: `These Legal Terms and your use of the Services are governed by and construed in accordance with the laws of the State of Michigan, without regard to its conflict of law principles.`,
  },
  {
    title: "16. Dispute Resolution",
    body: `Before initiating any formal dispute, you agree to first contact us and attempt to resolve the dispute informally. If the parties are unable to resolve a dispute informally within 30 days, any dispute shall be finally and exclusively resolved by binding arbitration under the Commercial Arbitration Rules of the American Arbitration Association (AAA). YOU UNDERSTAND THAT WITHOUT THIS PROVISION, YOU WOULD HAVE THE RIGHT TO SUE IN COURT AND HAVE A JURY TRIAL. The arbitration will take place in Michigan.

Any arbitration shall be limited to the dispute between the parties individually — no class-action arbitration is permitted. The following disputes are not subject to arbitration: disputes seeking to enforce or protect intellectual property rights; disputes related to theft, piracy, or invasion of privacy; and claims for injunctive relief. Any dispute must be commenced within one (1) year after the cause of action arose.`,
  },
  {
    title: "17. Disclaimer",
    body: `THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

WE MAKE NO WARRANTIES REGARDING THE ACCURACY OR COMPLETENESS OF JOB LISTINGS, AI-GENERATED RECOMMENDATIONS, OR ANY OTHER CONTENT ON THE SERVICES. GREENIFY IS NOT AN EMPLOYMENT AGENCY AND DOES NOT GUARANTEE ANY EMPLOYMENT OUTCOME, INCLUDING INTERVIEWS, JOB OFFERS, OR HIRING DECISIONS. ALL HIRING DECISIONS ARE MADE SOLELY BY EMPLOYERS AND ARE ENTIRELY OUTSIDE OF GREENIFY'S CONTROL.`,
  },
  {
    title: "18. Limitations of Liability",
    body: `IN NO EVENT WILL WE OR OUR OFFICERS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING. IF YOU HAVE NOT PAID US ANY AMOUNT, OUR TOTAL LIABILITY TO YOU SHALL NOT EXCEED $100.`,
  },
  {
    title: "19. Indemnification",
    body: `You agree to defend, indemnify, and hold us harmless, including our affiliates and all of our respective officers, agents, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees, arising out of: (1) your use of the Services; (2) breach of these Legal Terms; (3) any breach of your representations and warranties; (4) your violation of the rights of a third party; or (5) any harmful act toward any other user of the Services.`,
  },
  {
    title: "20. Electronic Communications and Signatures",
    body: `Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, and other communications we provide to you electronically satisfy any legal requirement that such communication be in writing.`,
  },
  {
    title: "21. Future Purchases and Subscriptions",
    body: `Greenify currently offers free access to the Services. We intend to introduce paid subscription tiers in the future. When paid features are introduced, pricing, billing periods, and features will be clearly disclosed before any purchase. Subscriptions will auto-renew unless canceled before the renewal date. Refund and cancellation policies will be published and incorporated into these Legal Terms at that time. Your continued use of the Services does not obligate you to purchase any future paid tier.`,
  },
  {
    title: "22. Miscellaneous",
    body: `These Legal Terms and any policies posted by us on the Services constitute the entire agreement between you and us regarding the Services. Our failure to exercise any right or provision of these Legal Terms shall not operate as a waiver. If any provision of these Legal Terms is determined to be unlawful or unenforceable, that provision shall be severed and the remaining provisions shall remain in full effect. There is no joint venture, partnership, employment, or agency relationship created between you and us as a result of these Legal Terms.`,
  },
  {
    title: "23. Contact Us",
    body: `To resolve a complaint or receive further information regarding use of the Services, please contact us at:\n\nGreenify\nMichigan, United States\nEmail: legal@greenify.com (coming soon)`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f0ece4' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1a2e1a', letterSpacing: '-0.03em' }}>
          Terms of Service
        </h1>
        <p className="text-[13px] mb-12" style={{ color: '#7a9a7a' }}>Last updated: August 21, 2026</p>

        {sections.map((section) => (
          <div key={section.title} className="mb-10">
            <h2 className="text-[16px] font-bold mb-2" style={{ color: '#1a2e1a' }}>{section.title}</h2>
            {section.body.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-[14px] leading-relaxed mb-3" style={{ color: '#5a7a5a' }}>
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
