'use client'

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav
      className="sticky top-0 z-50 w-full px-6 py-3.5"
      style={{
        background: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image src="/grepic.png" alt="Greenify logo" width={36} height={36} style={{ borderRadius: '6px' }} />
          <span className="text-[15px] font-semibold text-white tracking-tight">Greenify</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="#features"
            className="text-[13px] text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Features
          </Link>
          <Link
            href="#contact"
            className="text-[13px] text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Contact
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/jobs"
                className="px-3 py-1 text-[13px] text-white font-medium rounded-md transition-all duration-200 cursor-pointer"
                style={{ background: '#22a010' }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#1a8a0d')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#22a010')}
              >
                Dashboard
              </Link>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-3 py-1 text-[13px] text-zinc-300 font-medium rounded-md transition-all duration-200 cursor-pointer"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
