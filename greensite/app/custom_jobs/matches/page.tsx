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

  const statCards = [
    { label: 'Total Matches', value: jobs.length.toString(), color: '#29C115', bg: 'rgba(41,193,21,0.08)', border: 'rgba(41,193,21,0.15)' },
    { label: 'New This Week', value: jobs.length > 0 ? jobs.length.toString() : '0', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.15)' },
    { label: 'Saved Jobs', value: '0', color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.15)' },
    { label: 'Applications', value: '0', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.15)' },
  ]

  return (
    <AppShell>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '2px', letterSpacing: '-0.02em' }}>Resume Jobs</h1>
          <p style={{ color: '#52525b', fontSize: '12px' }}>AI-powered matches based on your resume and preferences</p>
        </div>

        {/* Resume settings banner */}
        <div style={{
          background: '#0d0d0d',
          borderRadius: '10px',
          padding: '10px 16px',
          marginBottom: '14px',
          border: '1px solid rgba(255,255,255,0.07)',
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
              <p style={{ color: '#52525b', fontSize: '11px' }}>Manage your resume and job preferences</p>
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

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
          {statCards.map((card) => (
            <div key={card.label} style={{ background: card.bg, borderRadius: '10px', padding: '12px 14px', border: `1px solid ${card.border}` }}>
              <p style={{ color: '#52525b', fontSize: '11px', marginBottom: '6px', fontWeight: 500 }}>{card.label}</p>
              <p style={{ color: card.color, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Jobs list */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: '#0d0d0d', borderRadius: '10px', height: '180px', border: '1px solid rgba(255,255,255,0.07)' }} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{
            background: '#0d0d0d',
            borderRadius: '10px',
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <p style={{ color: 'white', fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>No matches yet</p>
            <p style={{ color: '#52525b', fontSize: '12px', marginBottom: '18px' }}>
              Upload your resume and set job preferences to receive AI-powered matches.
            </p>
            <Link
              href="/settings"
              style={{ padding: '7px 16px', background: '#22a010', color: 'white', borderRadius: '7px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
            >
              Set Up Resume
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {jobs.map((job) => (
              <DarkJobCard key={job.id} job={job} />
            ))}
          </div>
        )}

      </div>
    </AppShell>
  )
}
