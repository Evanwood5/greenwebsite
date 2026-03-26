"use client";
import TopSkillsInDemand from "./components/TopSkillsInDemand";
import TopHiringCompaniesList from "./components/TopHiringCompaniesList";
import { useState, useEffect } from "react";
import FieldSelector from "./components/FieldSelector";
import JobTypeSummary from "./components/JobTypeSummary";
import MichiganCountyMap from "./components/MichiganCountyMap";
import SubcategoryTrendChart from "./components/SubcategoryTrendChart";
import LargeStatCard from "./components/LargeStatCard";
import TopCitiesChart from "./components/TopCitiesChart";

type Field = "tech" | "engineering" | "business" | "health";

export default function DashboardPage() {
  const [field, setField] = useState<Field>("tech");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics/${field}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [field]);

  return (
    <div 
      className="min-h-screen" 
      style={{ 
        padding: 24,
        background: "#0a0a0a",
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ 
          fontSize: 28, 
          fontWeight: 700, 
          marginBottom: 16,
          color: "white",
        }}>
          Greenify Dashboard
        </h1>
      </div>

      {/* Field Selector */}
      <FieldSelector value={field} onChange={setField} />

      {loading ? (
        <div className="text-center py-20" style={{ color: "#888" }}>
          Loading...
        </div>
      ) : !data ? (
        <div className="text-center py-20" style={{ color: "#ef4444" }}>
          Failed to load data
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* ROW 1: Three Large Stat Cards */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}>
            <LargeStatCard
              title="Total Active Jobs"
              value={data.totalJobs}
              changePercent={data.monthlyStats?.percentChange}
              changeLabel="in last 30 Days"
            />

            <LargeStatCard
              title="Companies Hiring (Past 30 Days)"
              value={data.totalCompanies || 0}
              subtitle={`${data.monthlyStats?.totalJobs || 0} jobs posted`}
            />

            <LargeStatCard
  title={data.topCities?.[0]?.name 
    ? data.topCities[0].name
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    : "Top City"
  }
  value={data.topCities?.[0]?.jobCount || 0}
  subtitle="Top City Hiring (Past 30 Days)"
/>
          </div>

          {/* ROW 2: Three Column Layout */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "280px 320px 1fr",
            gap: 24,
          }}>
            {/* Column 1: Top Hiring Companies (left, narrow) */}
            <div style={{ height: "600px" }}>
              <TopHiringCompaniesList
                data={data.topCompanies}
                title="Top Hiring Companies"
              />
            </div>

            {/* Column 2: Top Skills + Top Cities (middle, stacked) */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 24,
              height: "600px",
            }}>
              <div style={{ flex: "0 0 280px" }}>
                <TopSkillsInDemand
                  data={data.subcategoryCounts || {}}
                  title="Top Skills in Demand"
                />
              </div>
              <div style={{ flex: "1" }}>
                <TopCitiesChart
                  data={data.topCities}
                  title="Top Hiring Cities"
                />
              </div>
            </div>

            {/* Column 3: Job Posting Trends (right, wide, full height) */}
            <div style={{ height: "600px" }}>
              <div style={{ height: "100%", background: "#1a1a1a", borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "white" }}>
                  Job Posting Trends by Category
                </h3>
                <div style={{ height: "calc(100% - 40px)" }}>
                  <SubcategoryTrendChart
                    title=""
                    category={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3: Employment Type + Michigan County Map */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}>
            <JobTypeSummary
              jobTypes={data.jobTypes}
              totalJobs={data.totalJobs}
            />

            <MichiganCountyMap
              title="Jobs by Michigan County"
            />
          </div>
        </div>
      )}
    </div>
  );
}