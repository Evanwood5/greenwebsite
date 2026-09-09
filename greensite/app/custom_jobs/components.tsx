'use client'

import Link from 'next/link'
import ResumeUpload from '@/components/custom/resume-upload'
import PreferencesForm from '@/components/custom/preferences-form'
import { DarkJobCard } from '@/components/jobs/JobList'
import {
  CustomPreference,
  MatchedJob,
  PreferenceId,
  SaveStatus,
  MATCH_EXPIRY_DAYS,
  displayLocation,
} from './types'

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function LoadingGate() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <p style={{ color: '#52525b', fontSize: '13px' }}>Loading...</p>
    </div>
  )
}

export function SignInCard() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '400px', width: '100%', background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '32px', textAlign: 'center' }}>
        <svg style={{ margin: '0 auto 20px', display: 'block', color: '#3f3f46' }} width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 style={{ color: '#e4e4e7', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Sign in required</h2>
        <p style={{ color: '#52525b', fontSize: '12px', marginBottom: '20px' }}>
          Please sign in to access custom job matching features.
        </p>
        <Link
          href="/auth"
          style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.08)', color: '#e4e4e7', fontWeight: 600, padding: '9px 16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.14)', textDecoration: 'none', fontSize: '13px', boxSizing: 'border-box' }}
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h1 style={{ color: '#e4e4e7', fontSize: '18px', fontWeight: 600, marginBottom: '2px', letterSpacing: '-0.02em' }}>{title}</h1>
      <p style={{ color: '#52525b', fontSize: '12px' }}>{subtitle}</p>
    </div>
  )
}

export function MessageBanner({ status }: { status: SaveStatus }) {
  const success = status.type === 'success'
  return (
    <div style={{ marginBottom: '14px', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', background: success ? 'rgba(41,193,21,0.08)' : 'rgba(239,68,68,0.08)', color: success ? '#29C115' : '#ef4444', border: `1px solid ${success ? 'rgba(41,193,21,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
      {status.message}
    </div>
  )
}

export function ResumePanel({ userId, existingResumeUrl, resumeUploaded, loading, onResumeUploaded, onUpdateResume, onRemoveResume }: {
  userId?: string
  existingResumeUrl: string | null
  resumeUploaded: boolean
  loading: boolean
  onResumeUploaded: (uploaded: boolean) => void
  onUpdateResume: () => void
  onRemoveResume: () => void
}) {
  return (
    <div style={{ background: '#1e1e1e', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', padding: '16px' }}>
      <ResumeUpload onResumeUploaded={onResumeUploaded} userId={userId} existingResumeUrl={existingResumeUrl} />
      {resumeUploaded && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={onUpdateResume} disabled={loading} style={{ flex: 1, padding: '7px 12px', background: 'rgba(255,255,255,0.05)', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
            Update Resume
          </button>
          <button onClick={onRemoveResume} disabled={loading} style={{ flex: 1, padding: '7px 12px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
            Remove
          </button>
        </div>
      )}
    </div>
  )
}

export function PreferenceCard({ id, pref, loading, onOpen, onDelete }: {
  id: PreferenceId
  pref: CustomPreference
  loading: boolean
  onOpen: () => void
  onDelete: () => void
}) {
  const configured = pref.jobTypes.length > 0
  return (
    <div style={{ background: '#1e1e1e', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', flex: 1, cursor: 'pointer', position: 'relative' }} onClick={onOpen}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div>
          <p style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Job Preference #{id}</p>
          {configured ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ color: '#4ade80', fontSize: '11px' }}>✓ {pref.jobTypes.join(', ')}</span>
              <span style={{ color: '#52525b', fontSize: '11px' }}>📍 {displayLocation(pref.location)}</span>
              {pref.includeRemote && <span style={{ color: '#52525b', fontSize: '11px' }}>🌐 Remote included</span>}
            </div>
          ) : (
            <span style={{ color: '#71717a', fontSize: '11px' }}>Not configured yet</span>
          )}
        </div>
        <span style={{ color: '#3f3f46', fontSize: '14px', flexShrink: 0 }}>→</span>
      </div>
      {configured && (
        <button onClick={(e) => { e.stopPropagation(); if (confirm(`Delete Preference #${id}?`)) onDelete(); }} disabled={loading} style={{ position: 'absolute', bottom: '10px', right: '10px', padding: '3px 8px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
          Delete
        </button>
      )}
    </div>
  )
}

export function MatchedJobsPanel({ jobs, loadingJobs, resumeUploaded, hasPreferences, onRefresh }: {
  jobs: MatchedJob[]
  loadingJobs: boolean
  resumeUploaded: boolean
  hasPreferences: boolean
  onRefresh: () => void
}) {
  return (
    <div style={{ background: '#1e1e1e', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', gap: '12px' }}>
        <div>
          <h2 style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>Your Job Matches</h2>
          <p style={{ color: '#52525b', fontSize: '11px' }}>
            {jobs.length > 0
              ? `${jobs.length} match${jobs.length !== 1 ? 'es' : ''} from the last ${MATCH_EXPIRY_DAYS} days`
              : 'Matches appear here when the daily run finds jobs for you'
            }
          </p>
        </div>
        <button onClick={onRefresh} disabled={loadingJobs} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.04)', color: '#71717a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', fontSize: '11px', fontWeight: 500, cursor: loadingJobs ? 'not-allowed' : 'pointer' }}>
          {loadingJobs ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 11px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', marginBottom: '14px' }}>
        <ClockIcon />
        <p style={{ color: '#71717a', fontSize: '11px' }}>
          Matched jobs are shown for <strong>{MATCH_EXPIRY_DAYS} days</strong>. Save any jobs you want to keep using the bookmark icon — saved jobs don&apos;t expire.
        </p>
      </div>

      {loadingJobs ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ background: '#141414', borderRadius: '4px', height: '180px', border: '1px solid rgba(255,255,255,0.06)' }} />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {jobs.map((job) => (
            <DarkJobCard key={job.job_id} job={job} showSave={true} showDelete={false} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#141414', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>No matches yet</p>
          <p style={{ color: '#52525b', fontSize: '12px' }}>
            {!resumeUploaded ? 'Upload your resume and ' : ''}
            {!hasPreferences ? 'Set up a job preference to get started.' : 'Matches arrive once per day during the nightly run.'}
          </p>
        </div>
      )}
    </div>
  )
}

export function PreferenceEditor({ id, pref, loading, saveStatus, onUpdate, onBack, onCancel, onSave, onDelete }: {
  id: PreferenceId
  pref: CustomPreference
  loading: boolean
  saveStatus: SaveStatus | null
  onUpdate: (field: string, value: unknown) => void
  onBack: () => void
  onCancel: () => void
  onSave: () => void
  onDelete: () => void
}) {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#71717a', fontSize: '13px', cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Back
        </button>
        <h1 style={{ color: '#e4e4e7', fontSize: '18px', fontWeight: 600, marginBottom: '2px' }}>Job Preference #{id}</h1>
        <p style={{ color: '#52525b', fontSize: '12px' }}>Set up your job search criteria</p>
      </div>

      <div style={{ background: '#1e1e1e', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', padding: '20px' }}>
        {saveStatus && <MessageBanner status={saveStatus} />}
        <PreferencesForm formData={pref} updateFormData={onUpdate} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onCancel} disabled={loading} style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.04)', color: '#71717a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
            {pref.jobTypes.length > 0 && (
              <button onClick={() => { if (confirm('Delete this preference?')) onDelete(); }} disabled={loading} style={{ padding: '7px 14px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                Delete
              </button>
            )}
          </div>
          <button onClick={onSave} disabled={loading} style={{ padding: '7px 18px', background: loading ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)', color: loading ? '#52525b' : '#e4e4e7', border: `1px solid ${loading ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.14)'}`, borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}