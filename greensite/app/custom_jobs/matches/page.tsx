'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface JobMatch {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    jobType: string;
    experienceLevel?: string;
    score: number;
    jobLink: string;
    matchedPreference: string | number;
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<JobMatch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch matches from backend
        // For now, show empty state
        setTimeout(() => {
            setMatches([]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">⏳</div>
                        <p className="text-gray-600">Loading your matches...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Job Matches</h1>
                    <p className="text-gray-600">
                        AI-powered recommendations based on your resume and preferences
                    </p>
                </div>

                {/* Matches List */}
                {matches.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No matches yet</h2>
                        <p className="text-gray-600 mb-6">
                            We're checking for new jobs daily at 9 AM. Check back tomorrow!
                        </p>
                        <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-sm text-blue-900">
                                💡 <strong>Tip:</strong> You'll receive an email notification when we find a good match
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {matches.map((match) => (
                            <div
                                key={match.id}
                                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {match.jobTitle}
                                        </h3>
                                        <p className="text-gray-600">{match.company}</p>
                                        <p className="text-sm text-gray-500">
                                            📍 {match.location} • {match.jobType}
                                            {match.experienceLevel && ` • ${match.experienceLevel}`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold text-sm">
                                            {Math.round(match.score * 100)}% Match
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <a
                                        href={match.jobLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                                    >
                                        View Job →
                                    </a>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">
                                        Save
                                    </button>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">
                                        Not Interested
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <Link
                        href="/custom_jobs"

                        className="inline-block px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}