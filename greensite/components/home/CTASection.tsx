'use client'

import Link from "next/link";

interface CTASectionProps {
  user?: any;
}

export default function CTASection({ user }: CTASectionProps) {
  return (
    <>
      {/* Analytics Preview CTA */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-green-50 border border-green-100 shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: text */}
              <div className="p-12 flex flex-col justify-center">
                <span className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3">
                  Analytics Dashboard
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  See What the Michigan Job Market Looks Like Right Now
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Track hiring trends, top industries, salary ranges, and which green companies are growing — all updated weekly with real scraped data.
                </p>
                <Link
                  href="/analytics"
                  className="self-start px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Explore Analytics →
                </Link>
              </div>

              {/* Right: dummy chart placeholder */}
              <div className="bg-green-100 p-12 flex items-center justify-center">
                <div className="w-full max-w-xs">
                  {/* Fake bar chart */}
                  <div className="text-sm text-green-800 mb-4 font-medium">Top Hiring Industries</div>
                  {[
                    { label: "Clean Energy", pct: 85 },
                    { label: "AgriTech", pct: 65 },
                    { label: "EV / Auto", pct: 78 },
                    { label: "Gov / Nonprofit", pct: 50 },
                  ].map((bar) => (
                    <div key={bar.label} className="mb-3">
                      <div className="flex justify-between text-xs text-green-800 mb-1">
                        <span>{bar.label}</span>
                        <span>{bar.pct}%</span>
                      </div>
                      <div className="h-2.5 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
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
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center p-12 bg-green-900 rounded-3xl">
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
              className="inline-block px-8 py-4 bg-white text-green-900 rounded-xl hover:bg-green-50 transition-all duration-200 shadow-sm hover:-translate-y-0.5 font-bold text-lg"
            >
              Start Your Journey
            </Link>
          )}
        </div>
      </section>
    </>
  );
}