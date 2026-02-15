'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ResumeUploadProps {
    onResumeUploaded: (uploaded: boolean) => void;
    userId?: string;
    existingResumeUrl?: string | null;
}

export default function ResumeUpload({ onResumeUploaded, userId, existingResumeUrl }: ResumeUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Check if resume exists based on existingResumeUrl prop
    const hasResume = Boolean(existingResumeUrl) || Boolean(uploadedFile);

    // Reset uploadedFile when existingResumeUrl changes to null
    React.useEffect(() => {
        if (!existingResumeUrl) {
            setUploadedFile(null);
        }
    }, [existingResumeUrl]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Validate file type
        if (file.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('File size must be less than 2MB');
            return;
        }

        if (!userId) {
            setError('You must be logged in to upload a resume');
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            // Upload file to Supabase storage
            const fileName = `${userId}.pdf`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(fileName, file, {
                    upsert: true, // Allow overwriting existing files
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl(fileName);

            // Update profiles table with resume URL
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    user_id: userId,
                    resume: publicUrl,
                }, {
                    onConflict: 'user_id'
                });

            if (updateError) throw updateError;

            setUploadedFile(file.name);
            onResumeUploaded(true);
            
            // Clear the file input
            const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
            const updateInput = document.getElementById('resume-upload-update') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            if (updateInput) updateInput.value = '';
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload resume');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📄 Upload Your Resume</h2>
            <p className="text-gray-600 mb-6">Upload your resume to get personalized job matches</p>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {!hasResume && !uploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-500 transition-colors">
                    <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                    />
                    <label htmlFor="resume-upload" className={isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}>
                        <div className="text-6xl mb-4">📎</div>
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                            {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">PDF only, max 2MB, 2 pages</p>
                        <button
                            type="button"
                            onClick={() => document.getElementById('resume-upload')?.click()}
                            disabled={isUploading}
                            className={`px-6 py-2 rounded-lg font-semibold ${
                                isUploading 
                                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                                    : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                            {isUploading ? 'Uploading...' : 'Browse Files'}
                        </button>
                    </label>
                </div>
            ) : (
                <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
                    {/* Hidden input for updating resume */}
                    <input
                        type="file"
                        id="resume-upload-update"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                    />
                    
                    <div className="flex items-center gap-3">
                        <div className="text-4xl">✅</div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                                {uploadedFile || 'Resume uploaded'}
                            </p>
                            <p className="text-sm text-gray-600">
                                {isUploading ? 'Processing...' : 'Successfully uploaded to secure storage'}
                            </p>
                        </div>
                    </div>
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
                <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Securely stored in encrypted storage
                </p>
            </div>
        </div>
    );
}