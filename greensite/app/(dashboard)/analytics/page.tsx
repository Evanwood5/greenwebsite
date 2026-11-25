'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import AppShell from '@/components/layout/AppShell'
import { getAnalytics, getSubcategoryTrends } from '@/lib/services/analytics'
import { TIMEFRAMES, AnalyticsData, SubcategoryTrendData, CityOption } from '@/lib/types/analytics'
import {
  FieldSelector,
  LocationFilter,
  TimeframeFilter,
  TopHiringCompaniesList,
  TopCitiesChart,
  SubcategoryTrendChart,
  JobTypePieChart,
  ExperienceLevelChart,
} from './components'

// Two-column rows: the list takes ~2/3, the chart ~1/3. Columns wrap and
// stack once the page is too narrow for both.
const rowStyle: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'stretch' }
const mainColStyle: React.CSSProperties = { flex: '2 1 520px', minWidth: 0 }
const sideColStyle: React.CSSProperties = { flex: '1 1 300px', minWidth: 0 }
// When the list beside the chart is hidden, keep the chart at its 1/3 width.
const soloSideColStyle: React.CSSProperties = { flex: '0 1 calc((100% - 14px) / 3)', minWidth: 'min(300px, 100%)' }

export default function DashboardPage() {
  const [field, setField] = useState<'tech' | 'engineering' | 'business' | 'health' | 'science'>('tech')
  const [location, setLocation] = useState('')
  const [timeframe, setTimeframe] = useState('1year')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [cities, setCities] = useState<CityOption[]>([{ value: '', label: 'All Cities' }])
  const [trend, setTrend] = useState<SubcategoryTrendData | null>(null)
  const [trendLoading, setTrendLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cities')
      .then((r) => r.json())
      .then((d) => {
        const fetched = (d.cities ?? []).map((c: string) => ({ value: c, label: c }))
        setCities([{ value: '', label: 'All Cities' }, ...fetched])
      })
      .catch(() => {})
  }, [])

  const requestRef = useRef(0)

  const fetchAnalytics = useCallback(async () => {
    const requestId = ++requestRef.current
    setLoading(true)
    setTrendLoading(true)
    try {
      const [dataResult, trendResult] = await Promise.all([
        getAnalytics(field, location, timeframe),
        getSubcategoryTrends(field.charAt(0).toUpperCase() + field.slice(1), location, timeframe),
      ])
      if (requestId !== requestRef.current) return
      setData(dataResult)
      setTrend(trendResult)
    } catch (error) {
      if (requestId !== requestRef.current) return
      console.error('Error fetching analytics:', error)
    } finally {
      if (requestId === requestRef.current) {
        setLoading(false)
        setTrendLoading(false)
      }
    }
  }, [field, location, timeframe])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const isAllCities = !location

  return (
    <AppShell>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <FieldSelector value={field} onChange={setField} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <LocationFilter value={location} onChange={setLocation} cities={cities} />
          <TimeframeFilter value={timeframe} onChange={setTimeframe} options={TIMEFRAMES} />
        </div>

        {loading ? (
          <div style={{ color: 'var(--text-muted)', paddingTop: 80, textAlign: 'center', fontSize: 13 }}>Loading...</div>
        ) : !data ? (
          <div style={{ color: 'var(--text-danger)', paddingTop: 80, textAlign: 'center', fontSize: 13 }}>Failed to load data</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div style={rowStyle}>
              <div style={mainColStyle}>
                <TopHiringCompaniesList
                  data={data.allCompanies}
                  title="Top Hiring Companies"
                />
              </div>
              <div style={sideColStyle}>
                <ExperienceLevelChart
                  experienceLevels={data.experienceLevels}
                  title="Moderate vs Advanced"
                />
              </div>
            </div>

            <div style={rowStyle}>
              {isAllCities && (
                <div style={mainColStyle}>
                  <TopCitiesChart
                    data={data.allCities}
                    title="Top Hiring Cities"
                  />
                </div>
              )}
              <div style={isAllCities ? sideColStyle : soloSideColStyle}>
                <JobTypePieChart
                  jobTypes={data.jobTypes}
                  title="Job Types"
                />
              </div>
            </div>

            <div style={{ background: 'var(--surface-raised)', borderRadius: 4, padding: 14, border: '1px solid rgb(var(--ink-rgb) / 0.06)' }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
                Job Posting Trends by Category
              </p>
              <div style={{ height: 360 }}>
                <SubcategoryTrendChart
                  title=""
                  trendData={trend?.trendData ?? []}
                  topSubcategories={trend?.topSubcategories ?? []}
                  loading={trendLoading}
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </AppShell>
  )
}
