'use client'

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav
      className="sticky top-0 z-50 w-full px-6 py-4"
      style={{
        background: '#f0ece4',
        borderBottom: '1px solid rgba(30,58,30,0.1)',
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <Image src="/finally.png" alt="Greenify logo" width={26} height={26} />
          <span className="text-[19px] font-bold tracking-tight" style={{ color: '#1a2e1a' }}>Greenify</span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: 'How It Works', href: '/how-it-works' },
            { label: 'AI Powered', href: '/#ai-matching' },
            { label: 'Get in Touch', href: '/contact' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 cursor-pointer"
              style={{ color: '#1a2e1a' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="https://discord.gg/SduTEu4C6w"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:bg-white/[0.08]"
                style={{ background: 'rgba(30,58,30,0.06)', border: '1px solid rgba(30,58,30,0.2)' }}
              >
                <Image src="/disc.png" alt="Discord" width={18} height={18} />
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
                href="https://discord.gg/SduTEu4C6w"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:bg-white/[0.08]"
                style={{ background: 'rgba(30,58,30,0.06)', border: '1px solid rgba(30,58,30,0.2)' }}
              >
                <Image src="/disc.png" alt="Discord" width={18} height={18} />
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
