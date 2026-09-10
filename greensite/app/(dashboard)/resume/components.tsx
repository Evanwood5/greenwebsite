'use client'

import { useState } from 'react'
import { JOB_FIELDS, Preference, displayLocation } from '@/lib/types/settings'
import { MatchedJob } from '@/lib/types/matches'
import { DarkJobCard } from '@/components/jobs/JobList'

const card: React.CSSProperties = {
  background: '#1e1e1e',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '4px',
  padding: '10px 12px',
  marginBottom: '6px',
}

const sectionLabel: React.CSSProperties = {
  fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.1em', color: '#52525b', marginBottom: '8px',
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  )
}

// ─── Page Header ──────────────────────────────────────────────────────────────

export function PageHeader() {
  return (
    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '34px', height: '34px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>
      <div>
        <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '1px', letterSpacing: '-0.02em' }}>Resume Matching</h1>
        <p style={{ color: '#52525b', fontSize: '12px' }}>Upload your resume and set preferences to get personalized job matches.</p>
      </div>
    </div>
  )
}

// ─── Resume Card ──────────────────────────────────────────────────────────────

export function ResumeCard({
  resumeUploaded, uploading, removing, onFileChange, onRemove,
}: {
  resumeUploaded: boolean
  uploading: boolean
  removing: boolean
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}) {
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={resumeUploaded ? '#4ade80' : '#52525b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <span style={{ color: resumeUploaded ? '#e4e4e7' : '#71717a', fontSize: '12px', fontWeight: 500 }}>
            {resumeUploaded ? 'Resume uploaded' : 'No resume'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input type="file" accept=".pdf" id="resume-file" style={{ display: 'none' }} onChange={onFileChange} />
          {!resumeUploaded && (
            <button
              onClick={() => document.getElementById('resume-file')?.click()}
              disabled={uploading}
              style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', color: '#e4e4e7', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '4px', fontSize: '11px', fontWeight: 500, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </button>
          )}
          {resumeUploaded && (
            <button
              onClick={onRemove}
              disabled={removing}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'rgba(239,68,68,0.07)', color: '#f87171', border: '1px solid rgba(239,68,68,0.18)', borderRadius: '4px', fontSize: '11px', fontWeight: 500, cursor: removing ? 'not-allowed' : 'pointer', opacity: removing ? 0.6 : 1 }}>
              <TrashIcon />{removing ? 'Removing...' : 'Remove'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Pref Editor ──────────────────────────────────────────────────────────────

const EXPERIENCE_OPTIONS = [
  { value: 'moderate', label: 'Moderate (0–2 yrs)' },
  { value: 'advanced', label: 'Advanced (2+ yrs)' },
  { value: 'any', label: 'Any level' },
]

function PrefEditor({ pref, onChange, michiganCities }: {
  pref: Preference
  onChange: (p: Preference) => void
  michiganCities: string[]
}) {
  const jobTypeOptions = ['full-time', 'internship', 'part-time']
  const selectedCities = pref.location ? pref.location.split(',').filter(Boolean) : []

  function toggleJobType(type: string) {
    if (pref.jobTypes.includes(type)) {
      onChange({ ...pref, jobTypes: pref.jobTypes.filter(t => t !== type) })
    } else {
      if (pref.jobTypes.length >= 2) { alert('You can select up to 2 job types'); return }
      onChange({ ...pref, jobTypes: [...pref.jobTypes, type] })
    }
  }

  function toggleCategory(cat: string) {
    if (pref.jobCategories.includes(cat)) {
      const subsToRemove = JOB_FIELDS[cat] ?? []
      onChange({ ...pref, jobCategories: pref.jobCategories.filter(c => c !== cat), jobSubcategories: pref.jobSubcategories.filter(s => !subsToRemove.includes(s)) })
    } else {
      onChange({ ...pref, jobCategories: [...pref.jobCategories, cat] })
    }
  }

  function toggleSubcategory(sub: string) {
    if (pref.jobSubcategories.includes(sub)) {
      onChange({ ...pref, jobSubcategories: pref.jobSubcategories.filter(s => s !== sub) })
    } else {
      onChange({ ...pref, jobSubcategories: [...pref.jobSubcategories, sub] })
    }
  }

  function toggleCity(cityValue: string) {
    const next = cityValue === '' ? [] : selectedCities.includes(cityValue) ? selectedCities.filter(c => c !== cityValue) : [...selectedCities, cityValue]
    onChange({ ...pref, location: next.join(',') })
  }

  const chipBtn = (selected: boolean): React.CSSProperties => ({
    padding: '4px 10px', borderRadius: '4px',
    border: `1px solid ${selected ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.07)'}`,
    background: selected ? 'rgba(255,255,255,0.07)' : '#141414',
    color: selected ? '#e4e4e7' : '#71717a',
    fontSize: '11px', fontWeight: selected ? 600 : 400, cursor: 'pointer',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Job Types */}
      <div>
        <p style={sectionLabel}>Job Type (up to 2)</p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {jobTypeOptions.map(type => (
            <button key={type} type="button" onClick={() => toggleJobType(type)} style={{ ...chipBtn(pref.jobTypes.includes(type)), textTransform: 'capitalize' }}>
              {pref.jobTypes.includes(type) && '✓ '}{type}
            </button>
          ))}
        </div>
      </div>

      {/* Job Categories */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <p style={{ ...sectionLabel, marginBottom: 0 }}>Categories</p>
          <span style={{ fontSize: '9px', fontWeight: 600, padding: '1px 5px', borderRadius: '3px', background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>required</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {Object.keys(JOB_FIELDS).map(cat => (
            <button key={cat} type="button" onClick={() => toggleCategory(cat)} style={chipBtn(pref.jobCategories.includes(cat))}>
              {pref.jobCategories.includes(cat) && '✓ '}{cat}
            </button>
          ))}
        </div>
        {pref.jobCategories.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pref.jobCategories.map(cat => (
              <div key={cat}>
                <p style={{ ...sectionLabel, marginBottom: '6px' }}>{cat}</p>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {JOB_FIELDS[cat].map(sub => (
                    <button key={sub} type="button" onClick={() => toggleSubcategory(sub)} style={chipBtn(pref.jobSubcategories.includes(sub))}>
                      {pref.jobSubcategories.includes(sub) && '✓ '}{sub}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {pref.jobCategories.length === 0 && (
          <p style={{ color: '#f87171', fontSize: '11px' }}>Select at least one category to save</p>
        )}
      </div>

      {/* Experience Level */}
      {pref.jobTypes.includes('full-time') && (
        <div>
          <p style={sectionLabel}>Experience Level</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {EXPERIENCE_OPTIONS.map(opt => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '4px', border: `1px solid ${pref.experienceLevel === opt.value ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.07)'}`, background: pref.experienceLevel === opt.value ? 'rgba(255,255,255,0.07)' : '#141414', cursor: 'pointer' }}>
                <input type="radio" name="exp" value={opt.value} checked={pref.experienceLevel === opt.value} onChange={() => onChange({ ...pref, experienceLevel: opt.value })} style={{ accentColor: '#e4e4e7', width: '12px', height: '12px' }} />
                <span style={{ color: '#a1a1aa', fontSize: '11px' }}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      <div>
        <p style={sectionLabel}>Location</p>
        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '8px', maxHeight: '180px', overflowY: 'auto' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4px' }}>
            <input type="checkbox" checked={selectedCities.length === 0} onChange={() => toggleCity('')} style={{ accentColor: '#e4e4e7', width: '12px', height: '12px', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: '#e4e4e7', fontWeight: 600 }}>All Michigan</span>
          </label>
          {michiganCities.map(city => (
            <label key={city} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 4px', cursor: 'pointer' }}>
              <input type="checkbox" checked={selectedCities.includes(city)} onChange={() => toggleCity(city)} style={{ accentColor: '#e4e4e7', width: '12px', height: '12px', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#71717a' }}>{city}</span>
            </label>
          ))}
        </div>
        {selectedCities.length > 0 && <p style={{ color: '#52525b', fontSize: '10px', marginTop: '4px' }}>{selectedCities.length} {selectedCities.length === 1 ? 'city' : 'cities'} selected</p>}
      </div>

      {/* Remote */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', cursor: 'pointer' }}>
        <input type="checkbox" checked={pref.includeRemote} onChange={e => onChange({ ...pref, includeRemote: e.target.checked })} style={{ accentColor: '#e4e4e7', width: '13px', height: '13px', flexShrink: 0 }} />
        <span style={{ color: '#a1a1aa', fontSize: '11px' }}>Include remote jobs</span>
      </label>
    </div>
  )
}

// ─── Preference Summary ───────────────────────────────────────────────────────

function PreferenceSummary({ pref }: { pref: Preference }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <p style={{ color: '#71717a', fontSize: '11px' }}>
        {pref.jobTypes.join(', ')}
        {pref.jobCategories.length > 0 && ` · ${pref.jobCategories.join(', ')}`}
        {' · '}{displayLocation(pref.location)}
        {pref.includeRemote && ' · remote'}
      </p>
      {pref.jobSubcategories.length > 0 && (
        <p style={{ color: '#3f3f46', fontSize: '10px' }}>{pref.jobSubcategories.join(', ')}</p>
      )}
    </div>
  )
}

// ─── Preference Card ──────────────────────────────────────────────────────────

export function PreferenceCard({
  pref, draft, isEditing, saving, saveMsg, saveDisabledReason,
  label, sub, michiganCities, onEdit, onRemove, onSave, onCancel, onDraftChange,
}: {
  pref: Preference; draft: Preference; isEditing: boolean; saving: boolean
  saveMsg: string; saveDisabledReason: string | null; label: string; sub: string
  michiganCities: string[]; onEdit: () => void; onRemove: () => void
  onSave: () => void; onCancel: () => void; onDraftChange: (p: Preference) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const hasPrefs = pref.jobTypes.length > 0

  return (
    <div style={card}>
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <div style={{ textAlign: 'left' }}>
          <p style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 500 }}>{label}</p>
          {!expanded && hasPrefs && <PreferenceSummary pref={pref} />}
          {!expanded && !hasPrefs && <p style={{ color: '#3f3f46', fontSize: '11px' }}>{sub}</p>}
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease', flexShrink: 0, marginLeft: '8px' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div style={{ marginTop: '10px' }}>
          {!isEditing && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              <button onClick={onEdit} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', color: '#e4e4e7', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '4px', fontSize: '11px', fontWeight: 500, cursor: 'pointer' }}>
                {hasPrefs ? 'Edit' : 'Set Up'}
              </button>
              {hasPrefs && (
                <button onClick={onRemove} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'rgba(239,68,68,0.07)', color: '#f87171', border: '1px solid rgba(239,68,68,0.18)', borderRadius: '4px', fontSize: '11px', fontWeight: 500, cursor: 'pointer' }}>
                  <TrashIcon />Delete
                </button>
              )}
            </div>
          )}

          {isEditing ? (
            <>
              <PrefEditor pref={draft} onChange={onDraftChange} michiganCities={michiganCities} />
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button onClick={onSave} disabled={saving || !!saveDisabledReason} title={saveDisabledReason ?? ''}
                  style={{ padding: '5px 12px', background: saveDisabledReason ? 'transparent' : 'rgba(255,255,255,0.07)', color: saveDisabledReason ? '#52525b' : '#e4e4e7', border: saveDisabledReason ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', fontWeight: 500, fontSize: '11px', cursor: saveDisabledReason ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={onCancel} disabled={saving}
                  style={{ padding: '5px 12px', background: 'transparent', color: '#71717a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', fontWeight: 500, fontSize: '11px', cursor: 'pointer' }}>
                  Cancel
                </button>
                {saveDisabledReason && !saving && <span style={{ color: '#f87171', fontSize: '11px' }}>{saveDisabledReason}</span>}
                {saveMsg && <span style={{ color: saveMsg === 'Saved!' ? '#4ade80' : '#f87171', fontSize: '11px' }}>{saveMsg}</span>}
              </div>
            </>
          ) : hasPrefs ? (
            <PreferenceSummary pref={pref} />
          ) : (
            <p style={{ color: '#3f3f46', fontSize: '11px' }}>Not configured. Click Set Up to add preferences.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Matched Jobs Panel ───────────────────────────────────────────────────────

export function MatchedJobsPanel({ jobs, loading, resumeUploaded }: {
  jobs: MatchedJob[]
  loading: boolean
  resumeUploaded: boolean
}) {
  return (
    <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 600 }}>Matched Jobs</span>
        {!loading && jobs.length > 0 && (
          <span style={{ color: '#3f3f46', fontSize: '11px' }}>{jobs.length} result{jobs.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      <div style={{ padding: '12px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 11px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', marginBottom: '14px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <p style={{ color: '#71717a', fontSize: '11px' }}>
            Matched jobs shown for <strong>7 days</strong>. Save jobs you want to keep — saved jobs never expire.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: '#141414', borderRadius: '4px', height: '160px', border: '1px solid rgba(255,255,255,0.06)' }} />
            ))}
          </div>
        ) : !resumeUploaded ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ color: '#3f3f46', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>No resume uploaded</p>
            <p style={{ color: '#52525b', fontSize: '11px' }}>Upload your resume to start getting matches.</p>
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ color: '#3f3f46', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>No matches yet</p>
            <p style={{ color: '#52525b', fontSize: '11px' }}>Matches arrive once per day during the nightly run.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {jobs.map(job => (
              <DarkJobCard key={job.job_id} job={job as any} showSave={true} showDelete={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
