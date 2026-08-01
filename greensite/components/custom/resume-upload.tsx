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
            <p style={{ color: '#52525b', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Resume</p>
            <p style={{ color: '#3f3f46', fontSize: '11px', marginBottom: '14px' }}>Upload your resume to get personalized job matches</p>

            {/* Loading state */}
            {uploading && (
                <div style={{
                    background: '#141414',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '24px 20px',
                    textAlign: 'center',
                    marginBottom: '12px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            border: '2px solid rgba(255,255,255,0.08)',
                            borderTop: '2px solid #a1a1aa',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                    </div>
                    <p style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Processing resume...</p>
                    <p style={{ color: '#52525b', fontSize: '11px', lineHeight: '1.6' }}>
                        Scanning and removing sensitive information.<br />
                        This can take 15–30 seconds.
                    </p>
                    <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left', maxWidth: '210px', margin: '14px auto 0' }}>
                        {[
                            { label: 'Extracting text from PDF', delay: '0s' },
                            { label: 'Detecting personal information', delay: '0.8s' },
                            { label: 'Removing names & contact info', delay: '1.6s' },
                            { label: 'Saving securely to your profile', delay: '2.4s' },
                        ].map((step, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0, animation: 'fadeIn 0.4s ease forwards', animationDelay: step.delay }}>
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#52525b', flexShrink: 0 }} />
                                <span style={{ color: '#52525b', fontSize: '11px' }}>{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload area */}
            {!uploading && !hasResume && (
                <div
                    style={{
                        border: '1px dashed rgba(255,255,255,0.12)',
                        borderRadius: '4px',
                        padding: '28px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 150ms, background 150ms',
                        marginBottom: '12px',
                        background: 'rgba(255,255,255,0.02)',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.22)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
                    onClick={() => document.getElementById('resume-upload')?.click()}
                >
                    <input type="file" id="resume-upload" accept=".pdf" onChange={handleFileChange} disabled={uploading} style={{ display: 'none' }} />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 10px' }}>
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                    <p style={{ color: '#a1a1aa', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>Click to upload PDF</p>
                    <p style={{ color: '#52525b', fontSize: '11px', marginBottom: '12px' }}>PDF only · max 2MB · 2 pages</p>
                    <button type="button" style={{
                        padding: '5px 14px', background: 'rgba(255,255,255,0.06)', color: '#a1a1aa',
                        border: '1px solid rgba(255,255,255,0.10)', borderRadius: '4px',
                        fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                    }}>
                        Browse Files
                    </button>
                </div>
            )}

            {/* Uploaded state */}
            {!uploading && hasResume && (
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '4px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                    <div>
                        <p style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 600 }}>Resume uploaded</p>
                        <p style={{ color: '#52525b', fontSize: '11px' }}>
                            {success ? 'Successfully processed and saved' : 'Processed and saved to your profile'}
                        </p>
                    </div>
                    <input type="file" id="resume-upload-update" accept=".pdf" onChange={handleFileChange} disabled={uploading} style={{ display: 'none' }} />
                </div>
            )}

            {error && (
                <div style={{ padding: '9px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {["We'll anonymize your personal data", 'Only PDF files accepted', 'Maximum 2MB, 2 pages'].map(text => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span style={{ color: '#52525b', fontSize: '11px' }}>{text}</span>
                    </div>
                ))}
            </div>

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
