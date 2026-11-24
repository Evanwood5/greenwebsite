import { LegalSection } from '@/lib/types/terms'

export const PRIVACY_LAST_UPDATED = 'November 23, 2026'

export function paragraphsOf(body: string): string[] {
  return body.split('\n\n')
}

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: 'Overview',
    body: `This Privacy Policy explains how Greenify LLC ("Greenify," "we," "us," "our") collects, uses, shares, and protects your personal information when you use https://greenifylive.com and our related services (the "Services"). This Privacy Policy is part of our Terms of Service. By using the Services, you agree to the practices described here.`,
  },
  {
    title: '1. Information We Collect',
    body: `Information you give us:\n• Account information: your email address, name, and login credentials when you create an account.\n• Resume: the resume you upload, including the education, work history, and skills it contains.\n• Profile and preferences: the job fields, locations, experience level, job types, and remote preferences you choose, and companies you track.\n• Activity on Greenify: jobs you save and other actions you take within the Services.\n• Messages: anything you send us when you contact us.

Information collected automatically:\n• Technical information: such as your IP address, browser type, and device information, collected by our hosting and security providers to deliver the Services and protect them from abuse.\n• Cookies: we use cookies and similar technologies that are necessary to keep you signed in and to operate the Services.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use your information to:\n• create and manage your account;\n• match you with job postings and generate AI-powered job recommendations;\n• send you emails related to the Services, including job-match notifications;\n• keep the Services secure, prevent abuse, and fix problems;\n• understand and improve the Services, using aggregated or de-identified information where possible; and\n• comply with legal obligations.`,
  },
  {
    title: '3. How AI Processes Your Information',
    body: `Greenify uses AI to categorize job postings and to compare your resume and preferences with job postings. These AI features currently run on self-hosted, open-source language models operated on computing infrastructure at Michigan State University. Your resume is not sent to commercial third-party AI companies for this processing. We do not use your resume to train AI models in a way that identifies you personally without your consent.

Before storing resumes, we use automated tools to remove certain personal identifiers. No automated tool is perfect, so some personal information may remain.`,
  },
  {
    title: '4. How We Share Your Information',
    body: `We do not sell your personal information. We do not share your resume with employers unless you take an action to do so.

We share information only with service providers that help us run the Services, and only as needed for them to do so:\n• Supabase — database and account authentication\n• Vercel — website hosting\n• Render — application hosting\n• Cloudflare — security, performance, and protection from abuse\n• Resend — email delivery\n• Michigan State University computing infrastructure — AI processing

We may also disclose information if required by law, to protect the rights and safety of Greenify, our users, or others, or as part of a merger, acquisition, or sale of our business.`,
  },
  {
    title: '5. Data Retention',
    body: `We keep your account and profile information for as long as your account is active. Some data, such as job match results, is kept only temporarily. When you delete your account or ask us to delete your data, we will delete or de-identify your personal information within a reasonable time, unless we need to keep it to comply with the law, resolve disputes, or enforce our agreements.`,
  },
  {
    title: '6. Your Choices and Rights',
    body: `You can:\n• Access and update your profile and preferences in your account settings.\n• Delete your resume and profile data at any time in your account settings.\n• Delete your account by contacting us at greenifyliveteam@gmail.com.\n• Unsubscribe from non-essential emails using the link in those emails.

To make any other privacy request, contact us at greenifyliveteam@gmail.com.`,
  },
  {
    title: '7. Security',
    body: `We use reasonable safeguards to protect your information, including encrypted connections (HTTPS), database access controls, and restricted access to systems that hold personal data. No method of transmitting or storing data is completely secure, so we cannot guarantee absolute security.`,
  },
  {
    title: '8. Age Requirement',
    body: `The Services are intended for users who are at least 18 years old. We do not knowingly collect personal information from anyone under 18. If you believe someone under 18 has provided us with personal information, please contact us and we will delete it.`,
  },
  {
    title: '9. Where Your Information Is Processed',
    body: `Greenify is based in Michigan, United States. Your information is processed and stored in the United States by us and our service providers.`,
  },
  {
    title: '10. Changes to This Privacy Policy',
    body: `We may update this Privacy Policy from time to time. When we do, we will change the "Last updated" date at the top. If we make significant changes, we will notify you by email or through the Services. Continuing to use the Services after an update means you accept the revised policy.`,
  },
  {
    title: '11. Contact Us',
    body: `If you have questions about this Privacy Policy or how we handle your information, contact us at:

Greenify LLC
Michigan, United States
Email: greenifyliveteam@gmail.com
Website: https://greenifylive.com`,
  },
]
