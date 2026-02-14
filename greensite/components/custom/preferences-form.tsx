'use client';

interface PreferencesFormProps {
    formData: {
        jobTypes: string[];
        experienceLevel: 'moderate' | 'advanced' | 'any';
        location: string;
        maxDistance: number;
        includeRemote: boolean;
    };
    updateFormData: (field: string, value: any) => void;
}

export default function PreferencesForm({ formData, updateFormData }: PreferencesFormProps) {
    const jobTypeOptions = [
        { value: 'full-time', label: 'Full-time' },
        { value: 'internship', label: 'Internship' },
        { value: 'part-time', label: 'Part-time' },
        { value: 'co-op', label: 'Co-op' },
    ];

    const handleJobTypeToggle = (type: string) => {
        const current = formData.jobTypes;

        if (current.includes(type)) {
            // Remove if already selected
            updateFormData('jobTypes', current.filter(t => t !== type));
        } else {
            // Add if not at limit (max 2)
            if (current.length < 2) {
                updateFormData('jobTypes', [...current, type]);
            } else {
                alert('You can select up to 2 job types');
            }
        }
    };

    return (
        <div>
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

            {/* Experience Level (only for full-time) */}
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
                                    onChange={(e) => updateFormData('experienceLevel', e.target.value)}
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
                    onChange={(e) => updateFormData('location', e.target.value)}
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
                    onChange={(e) => updateFormData('maxDistance', parseInt(e.target.value))}
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
                        onChange={(e) => updateFormData('includeRemote', e.target.checked)}
                        className="w-5 h-5 text-green-600 rounded"
                    />
                    <div>
                        <p className="font-semibold text-gray-700">Include remote jobs</p>
                        <p className="text-sm text-gray-500">Get matched with remote opportunities</p>
                    </div>
                </label>
            </div>
        </div>
    );
}