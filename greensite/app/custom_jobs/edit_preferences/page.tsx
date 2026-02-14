'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPreferencesPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        jobTypes: [] as string[],
        experienceLevel: 'any' as 'moderate' | 'advanced' | 'any',
        location: 'East Lansing, MI',
        maxDistance: 50,
        includeRemote: true,
    });

    const jobTypeOptions = [
        { value: 'full-time', label: 'Full-time' },
        { value: 'internship', label: 'Internship' },
        { value: 'part-time', label: 'Part-time' },
        { value: 'co-op', label: 'Co-op' },
    ];

    const handleJobTypeToggle = (type: string) => {
        const current = formData.jobTypes;

        if (current.includes(type)) {
            setFormData({ ...formData, jobTypes: current.filter(t => t !== type) });
        } else {
            if (current.length < 2) {
                setFormData({ ...formData, jobTypes: [...current, type] });
            } else {
                alert('You can select up to 2 job types');
            }
        }
    };

    const handleSave = async () => {
        // TODO: Save to backend
        console.log('Saving preferences:', formData);

        // Redirect back to dashboard
        router.push('/custom_jobs');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Preferences</h1>
                    <p className="text-gray-600">Update your job matching preferences</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    {/* Job Types */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Job Type (select up to 2)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {jobTypeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleJobTypeToggle(option.value)}
                                    className={`p-4 rounded-lg border-2 font-semibold transition-all ${formData.jobTypes.includes(option.value)
                                            ? 'border-green-600 bg-green-50 text-green-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {formData.jobTypes.includes(option.value) && '✓ '}
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Experience Level */}
                    {formData.jobTypes.includes('full-time') && (
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Experience Level (for full-time jobs)
                            </label>
                            <div className="space-y-2">
                                {[
                                    { value: 'moderate', label: 'Moderate (0-2 years)' },
                                    { value: 'advanced', label: 'Advanced (2+ years)' },
                                    { value: 'any', label: 'Any level' },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name="experienceLevel"
                                            value={option.value}
                                            checked={formData.experienceLevel === option.value}
                                            onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                                            className="w-4 h-4 text-green-600"
                                        />
                                        <span className="font-medium text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Location */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            📍 Location
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                            placeholder="East Lansing, MI"
                        />
                    </div>

                    {/* Max Distance */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Max Distance: {formData.maxDistance} miles
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            step="10"
                            value={formData.maxDistance}
                            onChange={(e) => setFormData({ ...formData, maxDistance: parseInt(e.target.value) })}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>10 mi</span>
                            <span>100 mi</span>
                        </div>
                    </div>

                    {/* Include Remote */}
                    <div className="mb-6">
                        <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={formData.includeRemote}
                                onChange={(e) => setFormData({ ...formData, includeRemote: e.target.checked })}
                                className="w-5 h-5 text-green-600 rounded"
                            />
                            <div>
                                <p className="font-semibold text-gray-700">Include remote jobs</p>
                                <p className="text-sm text-gray-500">Get matched with remote opportunities</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-between">
                    <button
                        onClick={() => router.push('/custom_jobs')}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-lg"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
