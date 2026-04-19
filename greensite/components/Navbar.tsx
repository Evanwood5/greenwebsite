'use client'

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav style={{ background: '#1a1a1a' }} className="w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="7" width="20" height="14" rx="2" stroke="#22c55e" strokeWidth="2"/>
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#22c55e" strokeWidth="2"/>
              <line x1="12" y1="12" x2="12" y2="16" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
              <line x1="10" y1="14" x2="14" y2="14" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-green-400">Greenify</span>
        </Link>

        <div className="flex items-center space-x-8">
          <Link href="#features" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm cursor-pointer">
            Features
          </Link>
          <Link href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm cursor-pointer">
            Contact Us
          </Link>
          {user ? (
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 text-sm text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
