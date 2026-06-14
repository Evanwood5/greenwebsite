'use client'

import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CTASection from "@/components/home/CTASection";
import AISection from "@/components/home/AISection";
import AIMatchingSection from "@/components/home/AIMatchingSection";
import DetroitSection from "@/components/home/DetroitSection";


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
      <AISection />
      <AIMatchingSection />
      <DetroitSection />
      <CTASection />
    </div>
  );
}
