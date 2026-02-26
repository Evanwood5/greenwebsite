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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-lg text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <HeroSection user={user} />
      <FeaturesSection />
      <StatsSection />
      <CTASection user={user} />

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
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