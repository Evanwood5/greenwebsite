'use client'

import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CTASection from "@/components/home/CTASection";
import AIMatchingSection from "@/components/home/AIMatchingSection";
import GrandSection from "@/components/home/GrandSection";
import DetroitHeroSection from "@/components/home/DetroitHeroSection";
import SuccessSection from "@/components/home/SuccessSection";


export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#1e1e1e' }}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
          <div className="text-lg text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#000000' }}>

      <Navbar />
      <HeroSection user={user} />
      <DetroitHeroSection />
      <SuccessSection />
      <AIMatchingSection user={user} />
      <GrandSection />
      <CTASection />
    </div>
  );
}
