'use client'

import Link from "next/link";

interface HeroSectionProps {
  user?: any;
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative px-6 py-24 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse" />

      <div className="max-w-7xl mx-auto text-center max-w-4xl">
        <span className="inline-block px-4 py-1 mb-6 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
          🌱 Michigan&apos;s #1 Green Job Platform
        </span>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Best Job Search &amp;{" "}
          <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
            Analytics
          </span>{" "}
          in Michigan
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          We scrape 100+ Michigan job postings daily and match them to your resume using AI — so you spend less time searching and more time applying.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <Link
                href="/jobs"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                Browse Jobs
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-semibold text-lg transition-all duration-200"
              >
                View Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                Get Jobs Now 🚀
              </Link>
              <Link
                href="/jobs"
                className="px-8 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-semibold text-lg transition-all duration-200"
              >
                Explore Jobs
              </Link>
            </>
          )}
        </div>

        {/* Dummy trust bar */}
        <p className="mt-10 text-sm text-gray-400">
          Built by Spartans, powered by MSU · Trusted by 500+ Michigan job seekers
        </p>
      </div>
    </section>
  );
}