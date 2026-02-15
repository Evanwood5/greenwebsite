'use client'

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-lg text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your
              <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent"> Green </span>
              Career
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Discover sustainable job opportunities that match your values. Connect with eco-conscious companies building a better future.
            </p>
            
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/jobs"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg"
                >
                  Browse Jobs
                </Link>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold text-lg"
                >
                  View Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/auth"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/jobs"
                  className="px-8 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold text-lg"
                >
                  Explore Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse delay-200"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-400"></div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Greenify?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We connect environmentally conscious professionals with companies that share their values.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sustainable Jobs</h3>
              <p className="text-gray-600 leading-relaxed">
                Find positions at companies committed to environmental sustainability and positive impact.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Our platform matches you with opportunities that align with your skills and environmental values.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Growing Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Join a network of like-minded professionals making a difference in sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Green Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">5000+</div>
              <div className="text-gray-600 font-medium">Job Seekers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600 font-medium">Match Success</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-green-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            {user ? 
              "Start exploring sustainable career opportunities that align with your values." :
              "Join thousands of professionals building a sustainable future through meaningful work."
            }
          </p>
          {!user && (
            <Link
              href="/auth"
              className="inline-block px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg"
            >
              Start Your Journey
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-bold text-white">Greenify</span>
          </div>
          <p className="text-gray-400 mb-4">
            Connecting sustainable careers with purpose-driven professionals.
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/jobs" className="text-gray-400 hover:text-white transition-colors">Jobs</Link>
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}