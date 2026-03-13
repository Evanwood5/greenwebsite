'use client'

import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-lg text-gray-700 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-950 transition-colors duration-300">
      <HeroSection user={user} />
      <FeaturesSection />

      {/* Discord Notifications Box */}
      <section className="px-6 py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="bg-green-50 dark:bg-gray-800 border border-green-100 dark:border-gray-700 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-sm transition-colors duration-300">
            <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Get Custom Discord Notifications</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Never miss a match. Get real-time alerts for jobs that fit your profile.
              </p>
            </div>
            <Link
              href="/notifications"
              className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-md whitespace-nowrap"
            >
              Connect Discord
            </Link>
          </div>
        </div>
      </section>

      <StatsSection />
      <CTASection user={user} />

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 dark:bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-bold text-white">Greenify</span>
          </div>
          <p className="text-gray-400 mb-4">
            Connecting sustainable careers with purpose-driven professionals.
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/jobs" className="text-gray-400 hover:text-white transition-colors">Jobs</Link>
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}