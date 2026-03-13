'use client'

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-green-500">Greenify</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/bots" className="px-5 py-2 bg-gray-500 text-white rounded-full text-sm font-medium hover:bg-gray-600 transition-colors">
            bot
          </Link>
          <Link href="/analytics" className="px-5 py-2 bg-gray-500 text-white rounded-full text-sm font-medium hover:bg-gray-600 transition-colors">
            analytics
          </Link>
          <Link href="/jobs" className="px-5 py-2 bg-gray-800 text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors">
            Jobs
          </Link>
          <Link href="/links" className="px-5 py-2 bg-gray-500 text-white rounded-full text-sm font-medium hover:bg-gray-600 transition-colors">
            Links
          </Link>
          {user ? (
            <button
              onClick={signOut}
              className="ml-4 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              sign out
            </button>
          ) : (
            <Link
              href="/auth"
              className="ml-4 text-sm text-gray-500 hover:text-green-600 transition-colors"
            >
              sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
