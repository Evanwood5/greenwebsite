'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import AppShell from '@/components/AppShell'
import { DarkJobCard } from '@/components/jobs/JobList'

interface MatchedJob {
  id: number
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

      if (!matchRows || matchRows.length === 0) {
        setJobs([])
        return
      }

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
    { label: 'Total Matches', value: jobs.length.toString(), color: '#29C115' },
    { label: 'New This Week', value: jobs.length > 0 ? jobs.length.toString() : '0', color: '#60a5fa' },
    { label: 'Saved Jobs', value: '0', color: '#facc15' },
    { label: 'Applications', value: '0', color: '#f472b6' },
  ]

  return (
    <AppShell>
      <div style={{ maxWidth: '1100px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Resume-Matched Jobs</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>AI-powered job matches based on your resume and preferences</p>
        </div>

        {/* Resume settings banner */}
        <div style={{ background: '#1e1e1e', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1a8a0d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <p style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>Resume Settings</p>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>Manage your resume and job preferences</p>
            </div>
          </div>
          <Link
            href="/settings"
            style={{ padding: '8px 16px', background: '#29C115', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Go to Settings
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {statCards.map((card) => (
            <div key={card.label} style={{ background: '#1e1e1e', borderRadius: '12px', padding: '16px 20px', border: '1px solid #2a2a2a' }}>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>{card.label}</p>
              <p style={{ color: card.color, fontSize: '28px', fontWeight: 700 }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Jobs */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: '#1e1e1e', borderRadius: '14px', height: '220px', border: '1px solid #2a2a2a' }} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ background: '#1e1e1e', borderRadius: '14px', padding: '60px 20px', textAlign: 'center', border: '1px solid #2a2a2a' }}>
            <p style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No matches yet</p>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
              Upload your resume and set job preferences to receive AI-powered matches.
            </p>
            <Link
              href="/settings"
              style={{ padding: '10px 20px', background: '#29C115', color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
            >
              Set Up Resume
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {jobs.map((job) => (
              <DarkJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
