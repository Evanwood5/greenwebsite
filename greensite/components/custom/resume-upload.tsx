'use client';

import { useState } from 'react';

interface ResumeUploadProps {
    onResumeUploaded: (uploaded: boolean) => void;
    userId?: string;
    existingResumeUrl?: string | null;
}

export default function ResumeUpload({ onResumeUploaded, userId, existingResumeUrl }: ResumeUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        // Validate file type
        if (selectedFile.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            return;
        }

        // Validate file size (2MB)
        if (selectedFile.size > 2 * 1024 * 1024) {
            setError('File size must be less than 2MB');
            return;
        }

        setFile(selectedFile);
        setError(null);
        handleUpload(selectedFile);
    };

    const handleUpload = async (fileToUpload: File) => {
        if (!userId) {
            setError('You must be logged in to upload a resume');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            // Create form data
            const formData = new FormData();
            formData.append('resume', fileToUpload);
            formData.append('userId', userId);

            // Call API route
            const response = await fetch('/api/resume/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            console.log('Upload success:', data);
            onResumeUploaded(true);

        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload resume');
            onResumeUploaded(false);
        } finally {
            setUploading(false);
        }
    };

    // Check if resume exists
    const hasResume = Boolean(existingResumeUrl);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📄 Upload Your Resume</h2>
            <p className="text-gray-600 mb-6">Upload your resume to get personalized job matches</p>

            {!hasResume ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-500 transition-colors">
                    <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                        <div className="text-6xl mb-4">📎</div>
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                            {uploading ? 'Processing...' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">PDF only, max 2MB, 2 pages</p>
                        {!uploading && (
                            <button
                                type="button"
                                onClick={() => document.getElementById('resume-upload')?.click()}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                            >
                                Browse Files
                            </button>
                        )}
                    </label>
                </div>
            ) : (
                <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="text-4xl">✅</div>
                            <div>
                                <p className="font-semibold text-gray-900">Resume uploaded</p>
                                <p className="text-sm text-gray-600">
                                    {uploading ? 'Processing...' : 'Your resume has been processed and saved'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hidden input for updating resume */}
                    <input
                        type="file"
                        id="resume-upload-update"
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {uploading && (
                <div className="mt-4 text-center text-gray-600">
                    <div className="text-2xl mb-2">⏳</div>
                    <p className="text-sm">Processing your resume and removing sensitive information...</p>
                </div>
            )}

            <div className="mt-6 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> We'll anonymize your personal data
                </p>
                <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Only PDF files accepted
                </p>
                <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Maximum 2MB, 2 pages
                </p>
            </div>
        </div>
    );
}