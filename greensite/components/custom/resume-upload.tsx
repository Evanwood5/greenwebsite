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
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        if (selectedFile.type !== 'application/pdf') { setError('Please upload a PDF file'); return; }
        if (selectedFile.size > 2 * 1024 * 1024) { setError('File size must be less than 2MB'); return; }
        setFile(selectedFile);
        setError(null);
        setSuccess(false);
        handleUpload(selectedFile);
    };

    const handleUpload = async (fileToUpload: File) => {
        if (!userId) { setError('You must be logged in to upload a resume'); return; }
        setUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('resume', fileToUpload);
            formData.append('userId', userId);
            const response = await fetch('/api/resume/upload', { method: 'POST', body: formData });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Upload failed');
            setSuccess(true);
            onResumeUploaded(true);
        } catch (err: any) {
            setError(err.message || 'Failed to upload resume');
            onResumeUploaded(false);
        } finally {
            setUploading(false);
        }
    };

    const hasResume = Boolean(existingResumeUrl);

    return (
        <div>
            <h2 style={{ color: 'white', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>📄 Upload Your Resume</h2>
            <p style={{ color: '#71717a', fontSize: '12px', marginBottom: '14px' }}>Upload your resume to get personalized job matches</p>

            {/* Loading overlay — shown during upload */}
            {uploading && (
                <div style={{
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '10px',
                    border: '1px solid rgba(41,193,21,0.25)',
                    padding: '28px 20px',
                    textAlign: 'center',
                    marginBottom: '12px',
                }}>
                    {/* Spinner */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            border: '3px solid rgba(41,193,21,0.2)',
                            borderTop: '3px solid #29C115',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                    </div>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Processing your resume...
                    </p>
                    <p style={{ color: '#71717a', fontSize: '11px', lineHeight: '1.6' }}>
                        Scanning and removing sensitive information.<br />
                        This can take 15–30 seconds — please don't close the page.
                    </p>

                    {/* Animated progress steps */}
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', maxWidth: '220px', margin: '16px auto 0' }}>
                        {[
                            { label: 'Extracting text from PDF', delay: '0s' },
                            { label: 'Detecting personal information', delay: '0.8s' },
                            { label: 'Removing names & contact info', delay: '1.6s' },
                            { label: 'Saving securely to your profile', delay: '2.4s' },
                        ].map((step, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0, animation: `fadeIn 0.4s ease forwards`, animationDelay: step.delay }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#29C115', flexShrink: 0 }} />
                                <span style={{ color: '#9ca3af', fontSize: '11px' }}>{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload area — only shown when not loading */}
            {!uploading && !hasResume && (
                <div style={{
                    border: '2px dashed rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    padding: '28px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 150ms',
                    marginBottom: '12px',
                }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(41,193,21,0.4)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                    onClick={() => document.getElementById('resume-upload')?.click()}
                >
                    <input type="file" id="resume-upload" accept=".pdf" onChange={handleFileChange} disabled={uploading} style={{ display: 'none' }} />
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>📎</div>
                    <p style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Click to upload PDF</p>
                    <p style={{ color: '#52525b', fontSize: '11px', marginBottom: '12px' }}>PDF only · max 2MB · 2 pages</p>
                    <button type="button" style={{
                        padding: '6px 16px', background: 'rgba(41,193,21,0.1)', color: '#29C115',
                        border: '1px solid rgba(41,193,21,0.2)', borderRadius: '7px',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    }}>
                        Browse Files
                    </button>
                </div>
            )}

            {/* Success / already uploaded state */}
            {!uploading && hasResume && (
                <div style={{
                    background: 'rgba(41,193,21,0.06)',
                    border: '1px solid rgba(41,193,21,0.2)',
                    borderRadius: '10px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1a8a0d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                    <div>
                        <p style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>Resume uploaded</p>
                        <p style={{ color: '#86efac', fontSize: '11px' }}>
                            {success ? 'Successfully processed and saved!' : 'Your resume has been processed and saved'}
                        </p>
                    </div>
                    <input type="file" id="resume-upload-update" accept=".pdf" onChange={handleFileChange} disabled={uploading} style={{ display: 'none' }} />
                </div>
            )}

            {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {["We'll anonymize your personal data", 'Only PDF files accepted', 'Maximum 2MB, 2 pages'].map(text => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span style={{ color: '#71717a', fontSize: '11px' }}>{text}</span>
                    </div>
                ))}
            </div>

            {/* CSS animations */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-6px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}
