'use client'

const stats = [
  { value: "1,000+", label: "Jobs Scraped", emoji: "📋" },
  { value: "500+", label: "Michigan Companies", emoji: "🏢" },
  { value: "5,000+", label: "Job Seekers", emoji: "👥" },
  { value: "95%", label: "Match Accuracy", emoji: "🎯" },
];

const testimonials = [
  {
    quote:
      "Greenify surfaced a solar energy role I never would've found on my own. Landed the interview in a week.",
    name: "Alex R.",
    role: "MSU CS Graduate",
    avatar: "AR",
  },
  {
    quote:
      "The resume matching actually works. It ranked the jobs I ended up applying to at the very top.",
    name: "Priya S.",
    role: "Environmental Science, U of M",
    avatar: "PS",
  },
  {
    quote:
      "Love that it's Michigan-focused. No more sifting through out-of-state postings that aren't relevant.",
    name: "Jordan M.",
    role: "Software Engineer, Detroit",
    avatar: "JM",
  },
];

export default function StatsSection() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-white shadow-md"
            >
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Success Stories</h2>
          <p className="text-xl text-gray-600">Real Michigan job seekers, real results.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-8 rounded-2xl bg-white shadow-lg border border-gray-100 flex flex-col gap-4"
            >
              <p className="text-gray-700 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}