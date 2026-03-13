'use client';

import Link from 'next/link';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-green-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Market Analytics</h1>
                    <p className="text-xl text-gray-600">
                        Real-time trends and insights into Michigan's green economy.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hiring Trends</h2>
                        <div className="h-48 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-medium italic">
                            Chart placeholder: Industry growth over time
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Skills</h2>
                        <div className="h-48 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-medium italic">
                            Chart placeholder: Most requested certifications
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Salary Ranges</h2>
                        <div className="h-48 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-medium italic">
                            Chart placeholder: Pay distribution by role
                        </div>
                    </div>
                </div>

                <div className="mt-12 bg-green-900 text-white p-12 rounded-3xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Need Deeper Insights?</h2>
                    <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                        Our premium analytics reports provide granular data on specific Michigan counties and emerging sustainable sectors.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-4 bg-white text-green-900 rounded-xl font-bold hover:bg-green-50 transition-colors"
                    >
                        Request Full Report
                    </Link>
                </div>
            </div>
        </div>
    );
}
