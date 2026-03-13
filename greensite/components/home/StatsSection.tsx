'use client'

const stats = [
  { value: "1,000+", label: "Jobs Scraped" },
  { value: "500+", label: "Michigan Companies" },
  { value: "5,000+", label: "Job Seekers" },
  { value: "95%", label: "Match Accuracy" },
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
    <section className="px-6 py-20 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-8 rounded-2xl bg-green-50 dark:bg-green-900/20 shadow-sm border border-green-100 dark:border-green-800 transition-colors duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold text-green-900 dark:text-green-400 mb-2">
                {stat.value}
              </div>
              <div className="text-green-700 dark:text-green-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">Success Stories</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Real Michigan job seekers, real results.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 flex flex-col gap-4 transition-colors duration-300"
            >
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{t.name}</div>
                  <div className="text-gray-500 dark:text-gray-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}