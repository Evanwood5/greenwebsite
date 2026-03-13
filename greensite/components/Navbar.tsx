'use client'

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="w-full px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-green-500 dark:text-green-400">Greenify</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/bots" className="px-5 py-2 bg-gray-500 text-white rounded-full text-sm font-medium hover:bg-gray-600 transition-colors">
            bot
          </Link>
          <Link href="/analytics" className="px-5 py-2 bg-gray-500 text-white rounded-full text-sm font-medium hover:bg-gray-600 transition-colors">
            analytics
          </Link>
          <Link href="/jobs" className="px-5 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-full text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors">
            Jobs
          </Link>
          <Link href="/links" className="px-5 py-2 bg-gray-500 text-white rounded-full text-sm font-medium hover:bg-gray-600 transition-colors">
            Links
          </Link>

          <div className="pl-4 border-l border-gray-200 dark:border-gray-800 flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <button
                onClick={signOut}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
              >
                sign out
              </button>
            ) : (
              <Link
                href="/auth"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors"
              >
                sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
