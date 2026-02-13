'use client';

interface ReviewSubmitProps {
    formData: {
        resume: File | null;
        jobTypes: string[];
        experienceLevel: 'moderate' | 'advanced' | 'any';
        location: string;
        maxDistance: number;
        includeRemote: boolean;
    };
}

export default function ReviewSubmit({ formData }: ReviewSubmitProps) {
    const experienceLevelLabels = {
        moderate: 'Moderate (0-2 years)',
        advanced: 'Advanced (2+ years)',
        any: 'Any level',
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">✅ Review Your Profile</h2>
            <p className="text-gray-600 mb-6">Make sure everything looks good before submitting</p>

            <div className="space-y-4">
                {/* Resume */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Resume</p>
                    <p className="text-gray-900">
                        ✓ {formData.resume?.name || 'No resume uploaded'}
                    </p>
                </div>

                {/* Job Preferences */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Preferences</p>
                    <ul className="space-y-1 text-gray-900">
                        {formData.jobTypes.map((type) => (
                            <li key={type}>
                                • {type.charAt(0).toUpperCase() + type.slice(1)}
                                {type === 'full-time' && ` (${experienceLevelLabels[formData.experienceLevel]})`}
                            </li>
                        ))}
                        <li>• {formData.location} ({formData.maxDistance} mile radius)</li>
                        {formData.includeRemote && <li>• Remote jobs included</li>}
                    </ul>
                </div>

                {/* Notifications */}
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                        You'll receive job matches via:
                    </p>
                    <ul className="space-y-1 text-blue-900">
                        <li>📧 Email notifications</li>
                        <li>🔔 In-app notifications</li>
                    </ul>
                </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <p className="text-sm text-green-900">
                    <strong>Ready to go!</strong> We'll start matching you with jobs as soon as you submit.
                    New matches are checked daily at 9 AM.
                </p>
            </div>
        </div>
    );
}