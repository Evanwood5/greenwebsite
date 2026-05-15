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
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <Image src="/finally.png" alt="Greenify logo" width={26} height={26} />
          <span className="text-[19px] font-bold text-white tracking-tight">Greenify</span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Features', href: '#features' },
            { label: 'Contact', href: '#contact' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-[13px] font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all duration-200 cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Discord — icon only, ghost style */}
              <Link
                href="https://discord.gg/SduTEu4C6w"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:bg-white/[0.08]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(88, 101, 242, 0.4)' }}
              >
                <Image src="/disc.png" alt="Discord" width={18} height={18} />
              </Link>

              {/* User icon — ghost style matching Discord */}
              <Link
                href="/settings"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:bg-white/[0.08] cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>

              {/* Dashboard CTA */}
              <Link
                href="/jobs"
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-zinc-300 rounded-lg transition-all duration-200 cursor-pointer hover:text-white active:scale-[0.97]"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(41, 193, 21, 0.4)' }}
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
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <Image src="/disc.png" alt="Discord" width={18} height={18} />
              </Link>
              <Link
                href="/auth"
                className="px-3.5 py-1.5 text-[13px] font-semibold text-white rounded-md transition-all duration-200 cursor-pointer hover:brightness-110 active:scale-[0.97]"
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
