'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import AppShell from '@/components/layout/AppShell'
import { getAnalytics, getSubcategoryTrends } from '@/lib/services/analytics'
import { fetchAnalyticsCities } from '@/lib/services/cities'
import { TIMEFRAMES, AnalyticsData, SubcategoryTrendData, CityOption, Field } from '@/lib/types/analytics'
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
// With a city selected (no cities list), everything fits in one row:
// companies ~1/2, level bars ~1/4, job type pie ~1/4.
const compactMainColStyle: React.CSSProperties = { flex: '2 1 440px', minWidth: 0 }
const compactSideColStyle: React.CSSProperties = { flex: '1 1 280px', minWidth: 0 }

// Remembers the last field the user viewed, so leaving and coming back to
// analytics doesn't reset to Tech.
const FIELD_STORAGE_KEY = 'analyticsField'
const FIELDS: readonly Field[] = ['tech', 'engineering', 'business', 'health', 'science']
const isField = (v: string | null): v is Field => v !== null && (FIELDS as readonly string[]).includes(v)

export default function DashboardPage() {
  const [field, setField] = useState<Field>('tech')
  // False until the saved field is read, so we don't fetch Tech and then refetch.
  const [fieldRestored, setFieldRestored] = useState(false)
  const [location, setLocation] = useState('')
  const [timeframe, setTimeframe] = useState('1year')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [cities, setCities] = useState<CityOption[]>([{ value: '', label: 'All Cities' }])
  const [trend, setTrend] = useState<SubcategoryTrendData | null>(null)
  const [trendLoading, setTrendLoading] = useState(true)

  // Only offer cities with postings in the selected field + timeframe. If the
  // current city has none there, fall back to All Cities instead of showing empty charts.
  // Read after mount (not during render) so server and client HTML match.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FIELD_STORAGE_KEY)
      if (isField(saved)) setField(saved)
    } catch { /* storage unavailable: keep default */ }
    setFieldRestored(true)
  }, [])

  useEffect(() => {
    if (!fieldRestored) return
    try { localStorage.setItem(FIELD_STORAGE_KEY, field) } catch { /* ignore */ }
  }, [field, fieldRestored])

  useEffect(() => {
    if (!fieldRestored) return
    let cancelled = false
    fetchAnalyticsCities(field, timeframe)
      .then((list) => {
        if (cancelled) return
        setCities([{ value: '', label: 'All Cities' }, ...list.map((c) => ({ value: c, label: c }))])
        setLocation((current) => (current && !list.includes(current) ? '' : current))
      })
      .catch((err) => console.error('Failed to load cities:', err))
    return () => { cancelled = true }
  }, [field, timeframe, fieldRestored])

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
    if (!fieldRestored) return
    fetchAnalytics()
  }, [fetchAnalytics, fieldRestored])

  const isAllCities = !location

  return (
    <AppShell>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        {/* Hidden (but still taking up space) until the saved field is restored,
            so the default Tech tab never flashes before switching. The key change
            remounts the tabs once restored; otherwise their 180ms CSS transition
            would visibly animate the highlight from Tech to the saved field. */}
        <div style={{ visibility: fieldRestored ? 'visible' : 'hidden' }}>
          <FieldSelector key={fieldRestored ? 'restored' : 'pending'} value={field} onChange={setField} />
        </div>

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

            {isAllCities ? (
              <>
                <div style={rowStyle}>
                  <div style={mainColStyle}>
                    <TopHiringCompaniesList data={data.allCompanies} title="Top Hiring Companies" />
                  </div>
                  <div style={sideColStyle}>
                    <ExperienceLevelChart experienceLevels={data.experienceLevels} title="Moderate vs Advanced" />
                  </div>
                </div>

                <div style={rowStyle}>
                  <div style={mainColStyle}>
                    <TopCitiesChart data={data.allCities} title="Top Hiring Cities" />
                  </div>
                  <div style={sideColStyle}>
                    <JobTypePieChart jobTypes={data.jobTypes} title="Job Types" />
                  </div>
                </div>
              </>
            ) : (
              <div style={rowStyle}>
                <div style={compactMainColStyle}>
                  <TopHiringCompaniesList data={data.allCompanies} title="Top Hiring Companies" />
                </div>
                <div style={compactSideColStyle}>
                  <ExperienceLevelChart experienceLevels={data.experienceLevels} title="Moderate vs Advanced" />
                </div>
                <div style={compactSideColStyle}>
                  <JobTypePieChart jobTypes={data.jobTypes} title="Job Types" />
                </div>
              </div>
            )}

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
