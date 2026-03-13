'use client'

import Link from "next/link";

interface CTASectionProps {
  user?: any;
}

export default function CTASection({ user }: CTASectionProps) {
  return (
    <>
      {/* Analytics Preview CTA */}
      <section className="px-6 py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-white shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: text */}
              <div className="p-12 flex flex-col justify-center">
                <span className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-3">
                  📊 Analytics Dashboard
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  See What the Michigan Job Market Looks Like Right Now
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Track hiring trends, top industries, salary ranges, and which green companies are growing — all updated weekly with real scraped data.
                </p>
                <Link
                  href="/analytics"
                  className="self-start px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Explore Analytics →
                </Link>
              </div>

              {/* Right: dummy chart placeholder */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-12 flex items-center justify-center">
                <div className="w-full max-w-xs">
                  {/* Fake bar chart */}
                  <div className="text-sm text-gray-500 mb-4 font-medium">Top Hiring Industries</div>
                  {[
                    { label: "Clean Energy", pct: 85 },
                    { label: "AgriTech", pct: 65 },
                    { label: "EV / Auto", pct: 78 },
                    { label: "Gov / Nonprofit", pct: 50 },
                  ].map((bar) => (
                    <div key={bar.label} className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{bar.label}</span>
                        <span>{bar.pct}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="px-6 py-20 bg-gradient-to-r from-green-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            {user
              ? "Start exploring sustainable career opportunities that align with your values."
              : "Join thousands of Michigan professionals building a sustainable future."}
          </p>
          {!user && (
            <Link
              href="/auth"
              className="inline-block px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 font-semibold text-lg"
            >
              Start Your Journey
            </Link>
          )}
        </div>
      </section>
    </>
  );
}