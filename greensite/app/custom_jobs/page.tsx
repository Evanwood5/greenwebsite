'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import CustomJobsClient from './CustomJobsClient';

export default function CustomJobsPage() {
    const { user, loading } = useAuth();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
                <div className="text-center">
                    <div className="text-4xl mb-4">🔄</div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, show sign-in prompt
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="mb-6">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Authentication Required
                    </h2>

                    <p className="text-gray-600 mb-8">
                        Please sign in to access custom job matching features.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/auth"
                            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-xl"
                        >
                            Sign In
                        </Link>
                    </div>

                    <p className="mt-6 text-sm text-gray-500">
                        Get personalized job matches based on your resume and preferences
                    </p>
                </div>
            </div>
        );
    }

    // If authenticated, show the actual custom jobs page
    return <CustomJobsClient />;
}