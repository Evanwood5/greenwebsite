'use client'

import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";
import MoleculeBackground from "@/components/home/MoleculeBackground";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#1a1a1a' }}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
          <div className="text-lg text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#1a1a1a' }}>
      <MoleculeBackground />
      <Navbar />
      <HeroSection user={user} />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
