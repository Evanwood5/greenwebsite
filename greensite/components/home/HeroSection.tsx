'use client'

import Link from "next/link";
import ExplodedCube from "./ExplodedCube";

interface HeroSectionProps {
  user?: any;
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative px-6 py-20 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <div className="text-left">
          <span className="inline-block px-4 py-1 mb-6 text-sm font-semibold text-green-800 dark:text-green-100 bg-green-100 dark:bg-green-900/50 rounded-full">
            🌱 Michigan&apos;s #1 Green Job Platform
          </span>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            Best Job Search &amp;{" "}
            <span className="text-green-600 dark:text-green-500">
              Analytics
            </span>{" "}
            in Michigan
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            We scrape 100+ Michigan job postings daily and match them to your resume using AI — so you spend less time searching and more time applying.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <>
                <Link
                  href="/jobs"
                  className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold text-lg shadow-sm hover:bg-green-700 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Browse Jobs
                </Link>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-lg transition-all duration-200"
                >
                  View Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold text-lg shadow-sm hover:bg-green-700 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Jobs Now
                </Link>
                <Link
                  href="/jobs"
                  className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-lg transition-all duration-200"
                >
                  Explore Jobs
                </Link>
              </>
            )}
          </div>

          <p className="mt-10 text-sm text-gray-400 dark:text-gray-500 font-medium">
            Built by Spartans, powered by MSU · Trusted by 500+ Michigan job seekers
          </p>
        </div>

        {/* Right: 3D Exploded Cube */}
        <div className="hidden lg:block relative">
          <ExplodedCube />
        </div>
      </div>
    </section>
  );
}