'use client';

// Force re-build to clear stale imports

import { useState } from 'react';
import ResumeUpload from '../../components/custom/resume-upload';
import PreferencesForm from '../../components/custom/preferences-form';
import ReviewSubmit from '../../components/custom/review-submit';
import JobMatchDashboard from '../../components/custom/job-match-dashboard';

export default function CustomJobsPage() {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        resume: null as File | null,
        jobTypes: [] as string[],
        experienceLevel: 'any' as 'moderate' | 'advanced' | 'any',
        location: 'East Lansing, MI',
        maxDistance: 50,
        includeRemote: true,
    });

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        console.log('Submitting form data:', formData);
        setIsSubmitted(true);
    };

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // If submitted, show dashboard
    if (isSubmitted) {
        return <JobMatchDashboard formData={formData} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Job Matcher
                    </h1>
                    <p className="text-gray-600">
                        Find your perfect job match with AI-powered recommendations
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        {[1, 2, 3].map((stepNum) => (
                            <div key={stepNum} className="flex items-center flex-1">
                                {/* Step Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${stepNum === step
                                        ? 'bg-green-600 text-white'
                                        : stepNum < step
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {stepNum < step ? '✓' : stepNum}
                                </div>

                                {/* Connecting Line */}
                                {stepNum < 3 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 ${stepNum < step ? 'bg-green-500' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Step Labels */}
                    <div className="flex justify-between text-sm mt-2">
                        <span className={step === 1 ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                            Upload Resume
                        </span>
                        <span className={step === 2 ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                            Set Preferences
                        </span>
                        <span className={step === 3 ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                            Review & Submit
                        </span>
                    </div>
                </div>

                {/* Step Content Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    {step === 1 && (
                        <ResumeUpload
                            resume={formData.resume}
                            onResumeChange={(file: File | null) => updateFormData('resume', file)}
                        />
                    )}

                    {step === 2 && (
                        <PreferencesForm
                            formData={formData}
                            updateFormData={updateFormData}
                        />
                    )}

                    {step === 3 && (
                        <ReviewSubmit formData={formData} />
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className={`px-6 py-3 rounded-lg font-semibold ${step === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        ← Back
                    </button>

                    {step < totalSteps ? (
                        <button
                            onClick={handleNext}
                            disabled={step === 1 && !formData.resume}
                            className={`px-6 py-3 rounded-lg font-semibold ${step === 1 && !formData.resume
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                                }`}
                        >
                            Continue →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 shadow-lg"
                        >
                            Start Matching! 🚀
                        </button>
                    )}
                </div>

                {/* Helper Text */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    {step === 1 && 'Upload your resume to get started'}
                    {step === 2 && 'Select up to 2 job types and set your preferences'}
                    {step === 3 && 'Review your information before submitting'}
                </div>
            </div>
        </div>
    );
}