'use client'

import Link from "next/link";

const features = [
  {
    gradient: "bg-green-100",
    title: "100+ Michigan Jobs Scraped Daily",
    description:
      "We automatically pull the latest job postings from across Michigan so you never miss an opportunity. Updated every day, always fresh.",
    cta: { label: "Browse Jobs", href: "/jobs" },
  },
  {
    gradient: "bg-green-100",
    title: "Custom Jobs That Match Your Resume",
    description:
      "Upload your resume once and our AI scores every job against your skills and experience — surfacing the best matches at the top.",
    cta: { label: "Get Custom Jobs", href: "/custom_jobs" },
  },
  {
    gradient: "bg-green-100",
    title: "Job Market Analytics",
    description:
      "See real-time trends: which industries are hiring most, average salaries by role, and where Michigan's green economy is growing.",
    cta: { label: "View Analytics", href: "/analytics" },
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-6 py-20 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Land the Job
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Greenify combines live job scraping, AI resume matching, and market analytics — all in one platform built for Michigan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Highlight */}
              <div
                className={`w-16 h-4 ${feature.gradient} rounded-full mb-6`}
              />

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed flex-1">
                {feature.description}
              </p>

              <Link
                href={feature.cta.href}
                className="mt-6 inline-flex items-center text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
              >
                {feature.cta.label} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}