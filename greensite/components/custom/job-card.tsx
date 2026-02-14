'use client';

interface JobCardProps {
    job: {
        job_id: string;
        title: string;
        company: string;
        location: string;
        job_type?: string;
        is_remote?: boolean;
        application_url?: string;
        posted_date?: string;
        matched_at: string;
    };
}

export default function JobCard({ job }: JobCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {job.title}
                    </h3>
                    <p className="text-lg font-semibold text-green-600 mb-2">
                        {job.company}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <span>📍</span>
                            <span>{job.location}</span>
                        </div>
                        {job.job_type && (
                            <div className="flex items-center gap-1">
                                <span>💼</span>
                                <span className="capitalize">{job.job_type}</span>
                            </div>
                        )}
                        {job.is_remote && (
                            <div className="flex items-center gap-1 text-blue-600">
                                <span>🌐</span>
                                <span>Remote</span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Match indicator */}
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    ✨ Match
                </div>
            </div>

            {/* Job info section */}
            <div className="mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm">
                        This job matches your preferences and requirements. Click "Apply Now" to view the full job posting and submit your application.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                    {job.posted_date && (
                        <span>Posted {formatDate(job.posted_date)} • </span>
                    )}
                    <span>Matched {formatDate(job.matched_at)}</span>
                </div>
                
                <button
                    onClick={() => {
                        if (job.application_url) {
                            window.open(job.application_url, '_blank');
                        }
                    }}
                    disabled={!job.application_url}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        job.application_url
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {job.application_url ? '🚀 Apply Now' : 'No Application Link'}
                </button>
            </div>
        </div>
    );
}