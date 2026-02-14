'use client';

interface ResumeUploadProps {
    resume: File | null;
    onResumeChange: (file: File | null) => void;
}

export default function ResumeUpload({ resume, onResumeChange }: ResumeUploadProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Validate file type
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }

        onResumeChange(file);
    };

    const handleRemove = () => {
        onResumeChange(null);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📄 Upload Your Resume</h2>
            <p className="text-gray-600 mb-6">Upload your resume to get personalized job matches</p>

            {!resume ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-500 transition-colors">
                    <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                        <div className="text-6xl mb-4">📎</div>
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 mb-4">PDF only, max 2MB, 2 pages</p>
                        <button
                            type="button"
                            onClick={() => document.getElementById('resume-upload')?.click()}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                        >
                            Browse Files
                        </button>
                    </label>
                </div>
            ) : (
                <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="text-4xl">✅</div>
                            <div>
                                <p className="font-semibold text-gray-900">{resume.name}</p>
                                <p className="text-sm text-gray-600">
                                    {(resume.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleRemove}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold"
                        >
                            Remove
                        </button>
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
            </div>
        </div>
    );
}