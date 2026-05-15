'use client';

import { useState, useEffect } from 'react';
import ResumeUpload from '../../components/custom/resume-upload';
import PreferencesForm from '../../components/custom/preferences-form';
import { DarkJobCard } from '../../components/jobs/JobList';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import AppShell from '../../components/AppShell';

const MATCH_EXPIRY_DAYS = 7;

export default function CustomJobsClient() {
    const { user } = useAuth();
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [currentView, setCurrentView] = useState('main');
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(false);

    const [preference1, setPreference1] = useState({
        jobTypes: [] as string[],
        experienceLevel: 'any' as 'moderate' | 'advanced' | 'any',
        location: '',
        includeRemote: true,
    });

    const [preference2, setPreference2] = useState({
        jobTypes: [] as string[],
        experienceLevel: 'any' as 'moderate' | 'advanced' | 'any',
        location: '',
        includeRemote: true,
    });

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
            // Only fetch matches from the last 7 days
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - MATCH_EXPIRY_DAYS);

            const { data: matchesData, error: matchesError } = await supabase
                .from('user_job_matches')
                .select('job_id, created_at')
                .eq('user_id', user.id)
                .gte('created_at', cutoff.toISOString())
                .order('created_at', { ascending: false });

            if (matchesError) throw matchesError;
            if (!matchesData || matchesData.length === 0) { setMatchedJobs([]); return; }

            const jobIds = matchesData.map(match => match.job_id);
            const { data: jobsData, error: jobsError } = await supabase
                .from('job_postings_ingest_test')
                .select('job_id, job_title, company_name, city, state, job_type, is_remote, job_href, created_at, experience_level, job_field_id')
                .in('job_id', jobIds);

            if (jobsError) throw jobsError;

            const jobs = matchesData.map(match => {
                const jobDetails = jobsData?.find(job => job.job_id === match.job_id);
                if (!jobDetails) return null;
                return {
                    ...jobDetails,
                    matched_at: match.created_at,
                };
            }).filter(Boolean);

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
            const { data, error } = await supabase.from('profiles').select('resume').eq('user_id', user.id).single();
            if (error && error.code !== 'PGRST116') throw error;
            setResumeUploaded(!!(data?.resume));
            setResumeUrl(data?.resume || null);
        } catch (error) { console.error('Error loading resume status:', error); }
    };

    const removeResume = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            await supabase.from('profiles').update({ resume: null }).eq('user_id', user.id);
            setResumeUploaded(false);
            setResumeUrl(null);
            setSaveStatus({ type: 'success', message: 'Resume removed successfully!' });
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (err: any) {
            setSaveStatus({ type: 'error', message: err.message || 'Failed to remove resume' });
        } finally { setLoading(false); }
    };

    const loadUserPreferences = async () => {
        if (!user?.id) return;
        try {
            const { data, error } = await supabase.from('user_job_preferences').select('*').eq('user_id', user.id).in('preference_id', [1, 2]);
            if (error) throw error;
            data?.forEach(pref => {
                const prefData = {
                    jobTypes: pref.job_types || [],
                    experienceLevel: (pref.job_types?.includes('full-time') && pref.experience_level) ? (pref.experience_level as 'moderate' | 'advanced' | 'any') : 'any',
                    location: pref.locations?.join(',') || '',
                    includeRemote: pref.include_remote || false,
                };
                if (pref.preference_id === 1) setPreference1(prefData);
                else if (pref.preference_id === 2) setPreference2(prefData);
            });
        } catch (error) { console.error('Error loading preferences:', error); }
    };

    const savePreference = async (preferenceId: 1 | 2) => {
        if (!user?.id) return;
        const prefData = preferenceId === 1 ? preference1 : preference2;
        setLoading(true); setSaveStatus(null);
        try {
            const locationsArray = prefData.location.split(',').map(loc => loc.trim()).filter(loc => loc.startsWith('MI:'));
            const { error } = await supabase.from('user_job_preferences').upsert({
                user_id: user.id, preference_id: preferenceId,
                job_types: prefData.jobTypes, max_distance_miles: 30,
                include_remote: prefData.includeRemote, locations: locationsArray,
                experience_level: prefData.jobTypes.includes('full-time') ? prefData.experienceLevel : null,
            }, { onConflict: 'user_id,preference_id' });
            if (error) throw error;
            setSaveStatus({ type: 'success', message: `Preference #${preferenceId} saved!` });
            setTimeout(() => { setSaveStatus(null); setCurrentView('main'); }, 1000);
            await Promise.all([loadUserPreferences(), loadResumeStatus(), loadMatchedJobs()]);
        } catch (error: any) {
            setSaveStatus({ type: 'error', message: error.message || 'Failed to save preference' });
        } finally { setLoading(false); }
    };

    const removePreference = async (preferenceId: 1 | 2) => {
        if (!user?.id) return;
        setLoading(true); setSaveStatus(null);
        try {
            await supabase.from('user_job_preferences').delete().eq('user_id', user.id).eq('preference_id', preferenceId);
            const empty = { jobTypes: [] as string[], experienceLevel: 'any' as const, location: '', includeRemote: true };
            if (preferenceId === 1) setPreference1(empty);
            else setPreference2(empty);
            setSaveStatus({ type: 'success', message: `Preference #${preferenceId} removed!` });
            setTimeout(() => { setSaveStatus(null); setCurrentView('main'); }, 1000);
        } catch (error: any) {
            setSaveStatus({ type: 'error', message: error.message || 'Failed to remove preference' });
        } finally { setLoading(false); }
    };

    const updatePreference1 = (field: string, value: any) => {
        setPreference1(prev => { const u = { ...prev, [field]: value }; if (field === 'jobTypes' && !value.includes('full-time')) u.experienceLevel = 'any'; return u; });
    };
    const updatePreference2 = (field: string, value: any) => {
        setPreference2(prev => { const u = { ...prev, [field]: value }; if (field === 'jobTypes' && !value.includes('full-time')) u.experienceLevel = 'any'; return u; });
    };

    const displayLocation = (loc: string) => {
        if (!loc) return 'Not set';
        const cities = loc.split(',');
        if (cities.includes('MI:all')) return 'All Michigan';
        if (cities.length === 1) return cities[0].replace('MI:', '');
        return `${cities.length} cities selected`;
    };

    // Preference setup screens
    if (currentView === 'preference1' || currentView === 'preference2') {
        const prefId = currentView === 'preference1' ? 1 : 2;
        const prefData = prefId === 1 ? preference1 : preference2;
        const updateFn = prefId === 1 ? updatePreference1 : updatePreference2;

        return (
            <AppShell>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <button onClick={() => setCurrentView('main')} style={{ background: 'none', border: 'none', color: '#71717a', fontSize: '13px', cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            ← Back
                        </button>
                        <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '2px' }}>Job Preference #{prefId}</h1>
                        <p style={{ color: '#52525b', fontSize: '12px' }}>Set up your job search criteria</p>
                    </div>

                    <div style={{ background: '#1c1c1c', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.18)', padding: '20px', boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset' }}>
                        {saveStatus && (
                            <div style={{ marginBottom: '14px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', background: saveStatus.type === 'success' ? 'rgba(41,193,21,0.08)' : 'rgba(239,68,68,0.08)', color: saveStatus.type === 'success' ? '#29C115' : '#ef4444', border: `1px solid ${saveStatus.type === 'success' ? 'rgba(41,193,21,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                                {saveStatus.message}
                            </div>
                        )}
                        <PreferencesForm formData={prefData} updateFormData={updateFn} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => setCurrentView('main')} disabled={loading} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.04)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                {prefData.jobTypes.length > 0 && (
                                    <button onClick={() => { if (confirm('Delete this preference?')) removePreference(prefId); }} disabled={loading} style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                                        Delete
                                    </button>
                                )}
                            </div>
                            <button onClick={() => savePreference(prefId)} disabled={loading} style={{ padding: '8px 20px', background: loading ? '#1a1a1a' : '#29C115', color: loading ? '#52525b' : 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </AppShell>
        );
    }

    // Main dashboard
    return (
        <AppShell>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: '16px' }}>
                    <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '2px', letterSpacing: '-0.02em' }}>Custom Job Matching</h1>
                    <p style={{ color: '#52525b', fontSize: '12px' }}>Upload your resume and set preferences to get personalized job matches</p>
                </div>

                {saveStatus && (
                    <div style={{ marginBottom: '14px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', background: saveStatus.type === 'success' ? 'rgba(41,193,21,0.08)' : 'rgba(239,68,68,0.08)', color: saveStatus.type === 'success' ? '#29C115' : '#ef4444', border: `1px solid ${saveStatus.type === 'success' ? 'rgba(41,193,21,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                        {saveStatus.message}
                    </div>
                )}

                {/* Resume + Preferences row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>

                    {/* Resume */}
                    <div style={{ background: '#1c1c1c', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.18)', padding: '16px', boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset' }}>
                        <ResumeUpload onResumeUploaded={(uploaded) => { setResumeUploaded(uploaded); loadResumeStatus(); }} userId={user?.id} existingResumeUrl={resumeUrl} />
                        {resumeUploaded && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <button onClick={() => document.getElementById('resume-upload-update')?.click()} disabled={loading} style={{ flex: 1, padding: '7px 12px', background: 'rgba(29,78,216,0.15)', color: '#60a5fa', border: '1px solid rgba(29,78,216,0.25)', borderRadius: '7px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                                    Update Resume
                                </button>
                                <button onClick={removeResume} disabled={loading} style={{ flex: 1, padding: '7px 12px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '7px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Preferences */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {([1, 2] as const).map(prefId => {
                            const pref = prefId === 1 ? preference1 : preference2;
                            const configured = pref.jobTypes.length > 0;
                            return (
                                <div key={prefId} style={{ background: '#1c1c1c', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.18)', padding: '14px', flex: 1, cursor: 'pointer', boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset', position: 'relative' }} onClick={() => setCurrentView(`preference${prefId}`)}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                                        <div>
                                            <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Job Preference #{prefId}</p>
                                            {configured ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                    <span style={{ color: '#29C115', fontSize: '11px' }}>✓ {pref.jobTypes.join(', ')}</span>
                                                    <span style={{ color: '#52525b', fontSize: '11px' }}>📍 {displayLocation(pref.location)}</span>
                                                    {pref.includeRemote && <span style={{ color: '#52525b', fontSize: '11px' }}>🌐 Remote included</span>}
                                                </div>
                                            ) : (
                                                <span style={{ color: '#f97316', fontSize: '11px' }}>⚠ Not configured yet</span>
                                            )}
                                        </div>
                                        <span style={{ color: '#52525b', fontSize: '16px', flexShrink: 0 }}>→</span>
                                    </div>
                                    {configured && (
                                        <button onClick={(e) => { e.stopPropagation(); if (confirm(`Delete Preference #${prefId}?`)) removePreference(prefId); }} disabled={loading} style={{ position: 'absolute', bottom: '10px', right: '10px', padding: '3px 8px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '5px', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Matched Jobs */}
                <div style={{ background: '#1c1c1c', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.18)', padding: '16px', boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', gap: '12px' }}>
                        <div>
                            <h2 style={{ color: 'white', fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>Your Job Matches</h2>
                            <p style={{ color: '#52525b', fontSize: '11px' }}>
                                {matchedJobs.length > 0
                                    ? `${matchedJobs.length} match${matchedJobs.length !== 1 ? 'es' : ''} from the last ${MATCH_EXPIRY_DAYS} days`
                                    : 'Matches appear here when the daily run finds jobs for you'
                                }
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                            <button onClick={loadMatchedJobs} disabled={loadingJobs} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.04)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', fontSize: '11px', fontWeight: 500, cursor: loadingJobs ? 'not-allowed' : 'pointer' }}>
                                {loadingJobs ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                    </div>

                    {/* Expiry notice */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 12px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '7px', marginBottom: '14px' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <p style={{ color: '#fbbf24', fontSize: '11px' }}>
                            Matched jobs are shown for <strong>{MATCH_EXPIRY_DAYS} days</strong>. Save any jobs you want to keep using the bookmark icon — saved jobs don't expire.
                        </p>
                    </div>

                    {loadingJobs ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} style={{ background: '#0d0d0d', borderRadius: '10px', height: '180px', border: '1px solid rgba(255,255,255,0.07)' }} />
                            ))}
                        </div>
                    ) : matchedJobs.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            {matchedJobs.map((job) => (
                                <DarkJobCard key={job.job_id} job={job} showSave={true} showDelete={false} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#0d0d0d', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <p style={{ color: '#71717a', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>No matches yet</p>
                            <p style={{ color: '#3f3f46', fontSize: '12px' }}>
                                {!resumeUploaded ? 'Upload your resume and ' : ''}
                                {(!preference1.jobTypes.length && !preference2.jobTypes.length) ? 'Set up a job preference to get started.' : 'Matches arrive once per day during the nightly run.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
