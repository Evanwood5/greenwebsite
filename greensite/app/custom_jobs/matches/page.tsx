'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'
import { DarkJobCard } from '@/components/jobs/JobList'

interface MatchedJob {
  id: number
  job_id: string
  created_at: string
  company_name: string | null
  job_title: string | null
  job_href: string | null
  job_type: string | null
  city: string | null
  state: string | null
  is_remote: boolean | null
  matched_at: string
}

export default function ResumeJobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<MatchedJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) loadMatches()
  }, [user?.id])

  const loadMatches = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const { data: matchRows } = await supabase
        .from('user_job_matches')
        .select('job_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!matchRows || matchRows.length === 0) { setJobs([]); return }

      const jobIds = matchRows.map(m => m.job_id)
      const { data: jobRows } = await supabase
        .from('job_postings_ingest_test')
        .select('*')
        .in('job_id', jobIds)

      if (jobRows) {
        const merged: MatchedJob[] = matchRows
          .map(match => {
            const job = jobRows.find((j: any) => j.job_id === match.job_id)
            if (!job) return null
            return { ...job, id: job.id || job.job_id, matched_at: match.created_at }
          })
          .filter(Boolean) as MatchedJob[]
        setJobs(merged)
      }
    } catch (err) {
      console.error('Error loading matches:', err)
    } finally {
      setLoading(false)
    }
  }

  const newThisWeek = jobs.filter(j => {
    const days = Math.floor((Date.now() - new Date(j.matched_at).getTime()) / 86400000)
    return days < 7
  }).length

  const statCards = [
    { label: 'Total Matches', value: jobs.length.toString(), color: '#4ade80', labelColor: '#6ee7a0', bg: 'rgba(41,193,21,0.13)', border: 'rgba(41,193,21,0.28)' },
    { label: 'New This Week',  value: newThisWeek.toString(),  color: '#93c5fd', labelColor: '#7dd3fc', bg: 'rgba(96,165,250,0.13)',  border: 'rgba(96,165,250,0.28)' },
    { label: 'Saved Jobs',     value: '0',                     color: '#fb923c', labelColor: '#fdba74', bg: 'rgba(249,115,22,0.13)',  border: 'rgba(249,115,22,0.28)' },
  ]

  return (
    <AppShell>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '2px', letterSpacing: '-0.02em' }}>Resume Jobs</h1>
          <p style={{ color: '#71717a', fontSize: '12px' }}>AI-powered matches based on your resume and preferences</p>
        </div>

        {/* Resume settings banner */}
        <div style={{
          background: '#1c1c1c',
          borderRadius: '10px',
          padding: '10px 16px',
          marginBottom: '14px',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: 'rgba(41,193,21,0.1)', border: '1px solid rgba(41,193,21,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#29C115" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <p style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 600 }}>Resume Settings</p>
              <p style={{ color: '#71717a', fontSize: '11px' }}>Manage your resume and job preferences</p>
            </div>
          </div>
          <Link
            href="/settings"
            style={{
              padding: '5px 12px',
              background: '#22a010',
              color: 'white',
              borderRadius: '7px',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Go to Settings
          </Link>
        </div>

        {/* Stats — 3 cards, no Applications */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
          {statCards.map((card) => (
            <div key={card.label} style={{ background: card.bg, borderRadius: '10px', padding: '12px 14px', border: `1px solid ${card.border}` }}>
              <p style={{ color: card.labelColor, fontSize: '11px', marginBottom: '6px', fontWeight: 500 }}>{card.label}</p>
              <p style={{ color: card.color, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Jobs panel */}
        <div style={{
          background: '#1c1c1c',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '12px',
          minHeight: '300px',
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset',
        }}>
          {/* Panel header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 600 }}>Matched Jobs</span>
            {!loading && jobs.length > 0 && (
              <span style={{ color: '#52525b', fontSize: '11px' }}>{jobs.length} result{jobs.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          <div style={{ padding: '16px' }}>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ background: '#0d0d0d', borderRadius: '10px', height: '180px', border: '1px solid rgba(255,255,255,0.07)' }} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                <div style={{ color: '#3f3f46', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <p style={{ color: '#e4e4e7', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>No matches yet</p>
                <p style={{ color: '#71717a', fontSize: '12px' }}>
                  Upload your resume and set job preferences to receive AI-powered matches.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {jobs.map((job) => (
                  <DarkJobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </AppShell>
  )
}
