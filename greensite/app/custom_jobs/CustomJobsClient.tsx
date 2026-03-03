'use client';

import { useState, useEffect } from 'react';
import ResumeUpload from '../../components/custom/resume-upload';
import PreferencesForm from '../../components/custom/preferences-form';
import JobCard from '../../components/custom/job-card';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function CustomJobsClient() {
    const { user } = useAuth();
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [currentView, setCurrentView] = useState('main'); // 'main', 'preference1', 'preference2'
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(false);

    // State for two separate job preferences - NO DEFAULT LOCATION
    const [preference1, setPreference1] = useState({
        jobTypes: [] as string[],
        experienceLevel: 'any' as 'moderate' | 'advanced' | 'any',
        location: '', // Empty string, no default
        includeRemote: true,
    });

    const [preference2, setPreference2] = useState({
        jobTypes: [] as string[],
        experienceLevel: 'any' as 'moderate' | 'advanced' | 'any',
        location: '', // Empty string, no default
        includeRemote: true,
    });

    // Load existing preferences, resume status, and matched jobs on component mount
    useEffect(() => {
        if (user?.id) {
            loadUserPreferences();
            loadResumeStatus();
            loadMatchedJobs();
        }
    }, [user?.id]);

    const loadMatchedJobs = async () => {
        if (!user?.id) return;

        setLoadingJobs(true);
        try {
            const { data: matchesData, error: matchesError } = await supabase
                .from('user_job_matches')
                .select('job_id, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (matchesError) {
                console.error('Error loading matches:', matchesError);
                throw matchesError;
            }

            if (!matchesData || matchesData.length === 0) {
                setMatchedJobs([]);
                return;
            }

            const jobIds = matchesData.map(match => match.job_id);
            const { data: jobsData, error: jobsError } = await supabase
                .from('job_postings_ingest_test')
                .select(`
                    job_id,
                    job_title,
                    company_name,
                    city,
                    state,
                    job_type,
                    is_remote,
                    job_href,
                    created_at
                `)
                .in('job_id', jobIds);

            if (jobsError) {
                console.error('Error loading job details:', jobsError);
                const basicJobs = matchesData.map(match => ({
                    job_id: match.job_id,
                    title: 'Job Details Unavailable',
                    company: 'Unknown Company',
                    location: 'Unknown Location',
                    matched_at: match.created_at
                }));
                setMatchedJobs(basicJobs);
                return;
            }

            const jobs = matchesData.map(match => {
                const jobDetails = jobsData?.find(job => job.job_id === match.job_id);
                if (!jobDetails) return null;

                return {
                    job_id: jobDetails.job_id,
                    title: jobDetails.job_title,
                    company: jobDetails.company_name,
                    location: `${jobDetails.city}, ${jobDetails.state}`.replace(', null', '').replace('null, ', ''),
                    job_type: jobDetails.job_type,
                    is_remote: jobDetails.is_remote,
                    application_url: jobDetails.job_href,
                    posted_date: jobDetails.created_at,
                    matched_at: match.created_at
                };
            }).filter(job => job !== null);

            setMatchedJobs(jobs);
        } catch (error: any) {
            console.error('Error loading matched jobs:', error);
        } finally {
            setLoadingJobs(false);
        }
    };

    const loadResumeStatus = async () => {
        if (!user?.id) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('resume')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            const hasResume = data?.resume && data.resume !== null;
            setResumeUploaded(hasResume);
            setResumeUrl(data?.resume || null);
        } catch (error) {
            console.error('Error loading resume status:', error);
        }
    };

    const removeResume = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ resume: null })
                .eq('user_id', user.id);

            if (updateError) throw updateError;

            setResumeUploaded(false);
            setResumeUrl(null);

            setSaveStatus({ type: 'success', message: 'Resume removed successfully!' });
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (err: any) {
            console.error('Remove error:', err);
            setSaveStatus({ type: 'error', message: err.message || 'Failed to remove resume' });
        } finally {
            setLoading(false);
        }
    };

    const loadUserPreferences = async () => {
        if (!user?.id) return;

        try {
            const { data, error } = await supabase
                .from('user_job_preferences')
                .select('*')
                .eq('user_id', user.id)
                .in('preference_id', [1, 2]);

            if (error) throw error;

            data?.forEach(pref => {
                // Join locations array back to comma-separated string for multi-select
                const locationString = pref.locations?.join(',') || '';

                const prefData = {
                    jobTypes: pref.job_types || [],
                    experienceLevel: (pref.job_types?.includes('full-time') && pref.experience_level)
                        ? (pref.experience_level as 'moderate' | 'advanced' | 'any')
                        : 'any',
                    location: locationString,
                    includeRemote: pref.include_remote || false,
                };

                if (pref.preference_id === 1) {
                    setPreference1(prefData);
                } else if (pref.preference_id === 2) {
                    setPreference2(prefData);
                }
            });
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    };

    const savePreference = async (preferenceId: 1 | 2) => {
        if (!user?.id) {
            setSaveStatus({ type: 'error', message: 'You must be logged in to save preferences' });
            return;
        }

        const prefData = preferenceId === 1 ? preference1 : preference2;
        setLoading(true);
        setSaveStatus(null);

        try {
            // FIXED: Split by comma and filter empty strings
            // Location string format: "MI:Detroit,MI:Lansing,MI:Ann Arbor"
            const locationsArray = prefData.location
                .split(',')
                .map(loc => loc.trim())  // Remove whitespace
                .filter(loc => loc.startsWith('MI:'));  // Only keep valid MI:City format

            const { error } = await supabase
                .from('user_job_preferences')
                .upsert({
                    user_id: user.id,
                    preference_id: preferenceId,
                    job_types: prefData.jobTypes,
                    max_distance_miles: 30,
                    include_remote: prefData.includeRemote,
                    locations: locationsArray, // Clean array
                    experience_level: prefData.jobTypes.includes('full-time') ? prefData.experienceLevel : null,
                }, {
                    onConflict: 'user_id,preference_id'
                });

            if (error) throw error;

            setSaveStatus({ type: 'success', message: `Preference #${preferenceId} saved successfully!` });
            setTimeout(() => setSaveStatus(null), 3000);
            await loadUserPreferences();
            await loadResumeStatus();
            await loadMatchedJobs();
            setCurrentView('main');
        } catch (error: any) {
            console.error('Error saving preference:', error);
            setSaveStatus({ type: 'error', message: error.message || 'Failed to save preference' });
        } finally {
            setLoading(false);
        }
    };

    const removePreference = async (preferenceId: 1 | 2) => {
        if (!user?.id) {
            setSaveStatus({ type: 'error', message: 'You must be logged in to remove preferences' });
            return;
        }

        setLoading(true);
        setSaveStatus(null);

        try {
            const { error } = await supabase
                .from('user_job_preferences')
                .delete()
                .eq('user_id', user.id)
                .eq('preference_id', preferenceId);

            if (error) throw error;

            const defaultPreference = {
                jobTypes: [] as string[],
                experienceLevel: 'any' as 'moderate' | 'advanced' | 'any',
                location: '', // No default
                includeRemote: true,
            };

            if (preferenceId === 1) {
                setPreference1(defaultPreference);
            } else {
                setPreference2(defaultPreference);
            }

            setSaveStatus({ type: 'success', message: `Preference #${preferenceId} removed successfully!` });
            setTimeout(() => setSaveStatus(null), 3000);
            await loadUserPreferences();
            await loadResumeStatus();
            await loadMatchedJobs();
            setCurrentView('main');
        } catch (error: any) {
            console.error('Error removing preference:', error);
            setSaveStatus({ type: 'error', message: error.message || 'Failed to remove preference' });
        } finally {
            setLoading(false);
        }
    };

    const updatePreference1 = (field: string, value: any) => {
        setPreference1(prev => {
            const updated = { ...prev, [field]: value };
            if (field === 'jobTypes' && !value.includes('full-time')) {
                updated.experienceLevel = 'any';
            }
            return updated;
        });
    };

    const updatePreference2 = (field: string, value: any) => {
        setPreference2(prev => {
            const updated = { ...prev, [field]: value };
            if (field === 'jobTypes' && !value.includes('full-time')) {
                updated.experienceLevel = 'any';
            }
            return updated;
        });
    };

    // Helper function to display location nicely
    const displayLocation = (locationString: string) => {
        if (!locationString) return 'Not set';
        const cities = locationString.split(',');
        if (cities.includes('MI:all')) return 'All Michigan';
        if (cities.length === 1) return cities[0].replace('MI:', '');
        return `${cities.length} cities selected`;
    };

    // Render preference setup screens
    if (currentView === 'preference1') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <button
                            onClick={() => setCurrentView('main')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            🎯 Job Preference #1
                        </h1>
                        <p className="text-gray-600">
                            Set up your first job preference
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {saveStatus && (
                            <div className={`mb-6 p-4 rounded-lg border ${saveStatus.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                {saveStatus.message}
                            </div>
                        )}

                        <PreferencesForm
                            formData={preference1}
                            updateFormData={updatePreference1}
                        />
                        <div className="mt-6 flex justify-between">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCurrentView('main')}
                                    disabled={loading}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${loading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-500 text-white hover:bg-gray-600'
                                        }`}
                                >
                                    Cancel
                                </button>
                                {preference1.jobTypes.length > 0 && (
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this preference?')) {
                                                removePreference(1);
                                            }
                                        }}
                                        disabled={loading}
                                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${loading
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                    >
                                        {loading ? '🔄 Deleting...' : '🗑️ Delete Preference'}
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => savePreference(1)}
                                disabled={loading}
                                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${loading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                            >
                                {loading ? '🔄 Saving...' : '💾 Save Preference #1'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === 'preference2') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <button
                            onClick={() => setCurrentView('main')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            🎯 Job Preference #2
                        </h1>
                        <p className="text-gray-600">
                            Set up your second job preference
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {saveStatus && (
                            <div className={`mb-6 p-4 rounded-lg border ${saveStatus.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                {saveStatus.message}
                            </div>
                        )}

                        <PreferencesForm
                            formData={preference2}
                            updateFormData={updatePreference2}
                        />
                        <div className="mt-6 flex justify-between">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCurrentView('main')}
                                    disabled={loading}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${loading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-500 text-white hover:bg-gray-600'
                                        }`}
                                >
                                    Cancel
                                </button>
                                {preference2.jobTypes.length > 0 && (
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this preference?')) {
                                                removePreference(2);
                                            }
                                        }}
                                        disabled={loading}
                                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${loading
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                    >
                                        {loading ? '🔄 Deleting...' : '🗑️ Delete Preference'}
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => savePreference(2)}
                                disabled={loading}
                                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${loading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                            >
                                {loading ? '🔄 Saving...' : '💾 Save Preference #2'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main dashboard view
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Custom Job Matching
                    </h1>
                    <p className="text-gray-600">
                        Upload your resume, set your preferences, and find your perfect job matches
                    </p>
                </div>

                {/* Success/Error Messages */}
                {saveStatus && currentView === 'main' && (
                    <div className={`mb-6 p-4 rounded-lg border ${saveStatus.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                        {saveStatus.message}
                    </div>
                )}

                {/* Top Section: Resume Upload + Preference Buttons */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Left: Resume Upload */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <ResumeUpload
                            onResumeUploaded={(uploaded) => {
                                setResumeUploaded(uploaded);
                                loadResumeStatus();
                            }}
                            userId={user?.id}
                            existingResumeUrl={resumeUrl}
                        />

                        {/* Resume Action Buttons */}
                        {resumeUploaded && (
                            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => document.getElementById('resume-upload-update')?.click()}
                                    disabled={loading}
                                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${loading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {loading ? '🔄 Updating...' : '📝 Update Resume'}
                                </button>
                                <button
                                    onClick={removeResume}
                                    disabled={loading}
                                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${loading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}
                                >
                                    {loading ? '🔄 Removing...' : '🗑️ Remove Resume'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Preference Buttons */}
                    <div className="flex flex-col gap-4">
                        {/* Preference 1 Button */}
                        <div className="bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-green-200 hover:shadow-2xl flex-1 relative transition-all duration-200">
                            <div
                                onClick={() => setCurrentView('preference1')}
                                className="p-6 cursor-pointer h-full min-h-[200px] flex flex-col"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">🎯</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            Job Preference #1
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            Set up your first job search criteria
                                        </p>

                                        {preference1.jobTypes.length > 0 ? (
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-green-600 font-semibold">✓ Job Types:</span>
                                                    <span className="text-gray-700">{preference1.jobTypes.join(', ')}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="text-green-600 font-semibold">📍 Location:</span>
                                                    <span className="text-gray-700">{displayLocation(preference1.location)}</span>
                                                </div>

                                                {preference1.jobTypes.includes('full-time') && preference1.experienceLevel !== 'any' && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-600 font-semibold">💼 Experience:</span>
                                                        <span className="text-gray-700 capitalize">{preference1.experienceLevel}</span>
                                                    </div>
                                                )}

                                                {preference1.includeRemote && (
                                                    <div className="flex items-center gap-2 text-blue-600">
                                                        <span>🌐 Remote jobs included</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-orange-500 text-sm font-medium">⚠ Not configured yet</div>
                                        )}
                                    </div>
                                    <div className="text-2xl text-gray-400">→</div>
                                </div>
                            </div>

                            {/* Delete button */}
                            {preference1.jobTypes.length > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Are you sure you want to delete Preference #1?')) {
                                            removePreference(1);
                                        }
                                    }}
                                    disabled={loading}
                                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-full hover:bg-red-700 transition-colors shadow-lg border-2 border-red-600 hover:border-red-700"
                                    title="Delete preference"
                                >
                                    🗑️ Delete
                                </button>
                            )}
                        </div>

                        {/* Preference 2 Button */}
                        <div className="bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-green-200 hover:shadow-2xl flex-1 relative transition-all duration-200">
                            <div
                                onClick={() => setCurrentView('preference2')}
                                className="p-6 cursor-pointer h-full min-h-[200px] flex flex-col"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">🎯</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            Job Preference #2
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            Set up your second job search criteria
                                        </p>

                                        {preference2.jobTypes.length > 0 ? (
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-green-600 font-semibold">✓ Job Types:</span>
                                                    <span className="text-gray-700">{preference2.jobTypes.join(', ')}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="text-green-600 font-semibold">📍 Location:</span>
                                                    <span className="text-gray-700">{displayLocation(preference2.location)}</span>
                                                </div>

                                                {preference2.jobTypes.includes('full-time') && preference2.experienceLevel !== 'any' && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-600 font-semibold">💼 Experience:</span>
                                                        <span className="text-gray-700 capitalize">{preference2.experienceLevel}</span>
                                                    </div>
                                                )}

                                                {preference2.includeRemote && (
                                                    <div className="flex items-center gap-2 text-blue-600">
                                                        <span>🌐 Remote jobs included</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-orange-500 text-sm font-medium">⚠ Not configured yet</div>
                                        )}
                                    </div>
                                    <div className="text-2xl text-gray-400">→</div>
                                </div>
                            </div>

                            {/* Delete button */}
                            {preference2.jobTypes.length > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Are you sure you want to delete Preference #2?')) {
                                            removePreference(2);
                                        }
                                    }}
                                    disabled={loading}
                                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-full hover:bg-red-700 transition-colors shadow-lg border-2 border-red-600 hover:border-red-700"
                                    title="Delete preference"
                                >
                                    🗑️ Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Matched Jobs */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                🔍 Your Job Matches
                            </h2>
                            <p className="text-gray-600">
                                {matchedJobs.length > 0
                                    ? `Found ${matchedJobs.length} job match${matchedJobs.length > 1 ? 'es' : ''} based on your preferences`
                                    : 'Job matches will appear here when available'
                                }
                            </p>
                        </div>

                        <button
                            onClick={loadMatchedJobs}
                            disabled={loadingJobs}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${loadingJobs
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {loadingJobs ? '🔄 Refreshing...' : '🔄 Refresh Matches'}
                        </button>
                    </div>

                    {loadingJobs ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">🔄</div>
                            <p className="text-gray-600">Loading your job matches...</p>
                        </div>
                    ) : matchedJobs.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {matchedJobs.map((job) => (
                                <JobCard key={job.job_id} job={job} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-gray-50 rounded-lg p-12 border-2 border-dashed border-gray-300">
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-lg font-semibold text-gray-700 mb-2">
                                    No Job Matches Yet
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Complete your resume upload and preference setup to start receiving personalized job matches
                                </p>
                                <div className="text-xs text-gray-400">
                                    {!resumeUploaded && '• Upload your resume'}
                                    {(!preference1.jobTypes.length && !preference2.jobTypes.length) &&
                                        <div>• Configure at least one job preference</div>
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}