'use client';

import Link from 'next/link';

export default function NotificationsPage() {
    return (
        <div className="min-h-screen bg-green-50 p-6 md:p-12 flex items-center justify-center">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-12 text-center border border-green-100">
                <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <span className="text-white text-3xl font-bold">D</span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Discord Notifications</h1>
                <p className="text-gray-600 mb-10 leading-relaxed">
                    Get real-time alerts for the jobs that match your resume. Connect your Discord account to start receiving custom notifications.
                </p>

                <div className="space-y-4">
                    <button className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-md">
                        Connect Discord
                    </button>
                    <Link
                        href="/"
                        className="block w-full py-4 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>

                <p className="mt-8 text-sm text-gray-500 italic">
                    We only send notifications for jobs that score 80% or higher against your profile.
                </p>
            </div>
        </div>
    );
}
