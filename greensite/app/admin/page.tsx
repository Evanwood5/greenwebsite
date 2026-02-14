'use client';

import { useState } from 'react';

export default function AdminPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const classifyJobs = async () => {
        setLoading(true);
        setResult(null);
        try {
            const response = await fetch('/api/classify-jobs', { method: 'POST' });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: 'Failed to classify jobs', details: String(error) });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600 mb-8">Manage job classifications and system tasks</p>

                {/* Classification Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Classification</h2>
                    <p className="text-gray-600 mb-4">
                        Classify unclassified jobs by category (tech, engineering, health, business)
                        and experience level (moderate, advanced).
                    </p>

                    <button
                        onClick={classifyJobs}
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Classifying...' : 'Classify Unclassified Jobs'}
                    </button>
                </div>

                {/* Results Card */}
                {result && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>

                        {result.success ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-green-600">
                                    <span className="text-2xl">✅</span>
                                    <span className="font-semibold">{result.message}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">{result.classified}</p>
                                        <p className="text-sm text-gray-600">Successfully Classified</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-2xl font-bold text-red-600">{result.errors || 0}</p>
                                        <p className="text-sm text-gray-600">Errors</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-600">{result.total || 0}</p>
                                        <p className="text-sm text-gray-600">Total Processed</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-red-600">
                                <p className="font-semibold">❌ Error: {result.error}</p>
                                {result.details && (
                                    <p className="text-sm mt-2 text-gray-600">{result.details}</p>
                                )}
                            </div>
                        )}

                        {/* Raw JSON */}
                        <details className="mt-6">
                            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                                View Raw Response
                            </summary>
                            <pre className="mt-2 p-4 bg-gray-50 rounded text-xs overflow-auto">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
}