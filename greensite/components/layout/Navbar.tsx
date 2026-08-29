'use client'

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const [openNav, setOpenNav] = useState<string | null>(null);

  return (
    <nav
      className="sticky top-0 z-50 w-full px-6 py-3"
      style={{
        background: '#f0ece4',
        borderBottom: '1px solid rgba(30,58,30,0.1)',
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <Image src="/finally.png" alt="Greenify logo" width={26} height={26} />
          <span className="text-[22px] font-bold tracking-tight" style={{ color: '#1a2e1a' }}>Greenify</span>
        </Link>

        {/* Center nav links with dropdowns */}
        <div className="hidden md:flex items-center gap-1">
          {[
            {
              label: 'How It Works',
              href: '/how-it-works',
              items: [
                { label: 'Overview', href: '/how-it-works', desc: 'How Greenify works' },
                { label: 'What We Track', href: '/how-it-works#what-we-track', desc: 'Fields & subcategories we monitor' },
              ],
            },
            {
              label: 'AI Powered',
              href: '/ai-powered',
              items: [
                { label: 'Resume Matching', href: '/ai-powered#resume-matching', desc: 'Match your resume to live jobs' },
              ],
            },
            {
              label: 'Why Us?',
              href: '/contact',
              items: [
                { label: 'No Ghost Jobs', href: '/contact#no-ghost-jobs', desc: 'Direct from company career pages' },
                { label: 'Source of Truth', href: '/contact#source-of-truth', desc: 'Real-time, verified listings' },
                { label: 'Michigan Focused', href: '/contact#michigan-focused', desc: '100+ Michigan companies tracked' },
                { label: 'All Tools', href: '/contact#all-tools', desc: 'Everything in one place' },
              ],
            },
          ].map((nav) => (
            <div
              key={nav.label}
              className="relative"
              onMouseEnter={() => setOpenNav(nav.label)}
              onMouseLeave={() => setOpenNav(null)}
            >
              <Link
                href={nav.href}
                className="flex items-center gap-1 px-4 py-2 text-[14px] font-semibold rounded-lg transition-all duration-200 cursor-pointer"
                style={{ color: '#1a2e1a' }}
              >
                {nav.label}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1a2e1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, opacity: 0.5 }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </Link>

              {openNav === nav.label && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                  style={{ minWidth: 220 }}
                >
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid rgba(30,58,30,0.1)',
                    borderRadius: 14,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                    padding: '6px',
                    overflow: 'hidden',
                  }}>
                    {nav.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpenNav(null)}
                        style={{ display: 'block', borderRadius: 10, padding: '10px 14px', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f0')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2e1a', marginBottom: 1 }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: '#7a9a7a' }}>{item.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/#contact"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:bg-white/[0.08]"
                style={{ background: 'rgba(30,58,30,0.06)', border: '1px solid rgba(30,58,30,0.2)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a2e1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </Link>

              <Link
                href="/settings"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:bg-white/[0.08] cursor-pointer"
                style={{ background: 'rgba(30,58,30,0.06)', border: '1px solid rgba(30,58,30,0.2)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a2e1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>

              <Link
                href="/jobs"
                className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white rounded transition-all duration-200 cursor-pointer hover:brightness-110 active:scale-[0.97]"
                style={{ background: '#0f5c0f', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Dashboard
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H8M17 7v9"/>
                </svg>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/#contact"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:bg-white/[0.08]"
                style={{ background: 'rgba(30,58,30,0.06)', border: '1px solid rgba(30,58,30,0.2)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a2e1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </Link>
              <Link
                href="/auth"
                className="px-4 py-2 text-[13px] font-semibold text-white rounded transition-all duration-200 cursor-pointer hover:brightness-110 active:scale-[0.97]"
                style={{ background: '#1a8a0d' }}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
