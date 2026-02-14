'use client';

import Link from 'next/link';

interface JobMatchDashboardProps {
    formData: {
        resume: File | null;
        jobTypes: string[];
        experienceLevel: 'moderate' | 'advanced' | 'any';
        location: string;
        maxDistance: number;
        includeRemote: boolean;
    };
}

export default function JobMatchDashboard({ formData }: JobMatchDashboardProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Success Message */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">You're all set!</h1>
                    <p className="text-gray-600 mb-6">
                        Your profile is active and we're matching you with jobs daily.
                    </p>

                    {/* Stats */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Your Stats</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-green-600">{formData.jobTypes.length}</p>
                                <p className="text-sm text-gray-600">Active Preferences</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600">0</p>
                                <p className="text-sm text-gray-600">Jobs Matched</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-purple-600">Tomorrow 9 AM</p>
                                <p className="text-sm text-gray-600">Next Update</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/custom_jobs/edit_preferences"
                            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 inline-block"
                        >
                            Edit Preferences
                        </Link>
                        <Link
                            href="/custom_jobs/matches"
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 inline-block"
                        >
                            View Matches
                        </Link>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white rounded-lg p-6 shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
                    <ul className="space-y-2 text-gray-600 text-sm">
                        <li>• We'll check for new jobs matching your preferences daily</li>
                        <li>• You'll receive notifications when we find a good match</li>
                        <li>• You can update your preferences anytime</li>
                        <li>• All your data is kept secure and anonymous</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}