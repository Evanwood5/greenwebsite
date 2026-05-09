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
        <Link href="/" className="flex items-center gap-1 cursor-pointer">
          <Image src="/finally.png" alt="Greenify logo" width={24} height={24} />
          <span className="text-[15px] font-semibold text-white tracking-tight">Greenify</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="#how-it-works"
            className="text-[13px] text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            How It Works
          </Link>
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
              <Link
                href="https://discord.gg/SduTEu4C6w"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200"
                style={{ background: 'rgba(88,101,242,0.12)', border: '1px solid rgba(88,101,242,0.25)' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(88,101,242,0.22)' }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(88,101,242,0.12)' }}
              >
                <Image src="/disc.png" alt="Discord" width={18} height={18} />
              </Link>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
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
