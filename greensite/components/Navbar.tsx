'use client'

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Greenify</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/jobs" className="text-gray-600 hover:text-gray-900 transition-colors">
            Jobs
          </Link>
          <Link href="/custom_jobs" className="text-gray-600 hover:text-gray-900 transition-colors">
            Custom Jobs
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
            Dashboard
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user.email}</span>
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/auth"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
