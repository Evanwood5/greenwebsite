'use client'

import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
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
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080808',
        flexDirection: 'column',
        gap: '24px',
      }}>
        <div style={{ position: 'relative', width: '40px', height: '40px' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: 'rgba(255,255,255,0.7)',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
        <span style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        }}>
          Greenify
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
