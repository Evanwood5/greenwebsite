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
import AppShell from "@/components/AppShell";

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
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [field]);

  const topCityName = data?.topCities?.[0]?.name
    ? data.topCities[0].name
        .split(" ")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : "Top City";

  return (
    <AppShell>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <FieldSelector value={field} onChange={setField} />

        {loading ? (
          <div style={{ color: "#52525b", paddingTop: 80, textAlign: "center", fontSize: 13 }}>Loading...</div>
        ) : !data ? (
          <div style={{ color: "#f87171", paddingTop: 80, textAlign: "center", fontSize: 13 }}>Failed to load data</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Row 1: Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
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
                title={topCityName}
                value={data.topCities?.[0]?.jobCount || 0}
                subtitle="Top City Hiring (Past 30 Days)"
              />
            </div>

            {/* Row 2: Two-column layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 14, alignItems: "stretch" }}>

              {/* Left: Companies + Cities stacked */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <TopHiringCompaniesList
                  data={data.topCompanies}
                  title="Top Hiring Companies"
                />
                <TopCitiesChart
                  data={data.topCities}
                  title="Top Hiring Cities"
                />
              </div>

              {/* Right: Skills + Trend chart stacked */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <TopSkillsInDemand
                  data={data.subcategoryCounts || {}}
                  title="Top Skills in Demand"
                />
                <div style={{ background: "#1e1e1e", borderRadius: 4, padding: 14, flex: 1, display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b", marginBottom: 12, flexShrink: 0 }}>
                    Job Posting Trends by Category
                  </p>
                  <div style={{ flex: 1, minHeight: 240 }}>
                    <SubcategoryTrendChart
                      title=""
                      category={field.charAt(0).toUpperCase() + field.slice(1)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Employment type + county map */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <JobTypeSummary
                jobTypes={data.jobTypes}
                totalJobs={data.totalJobs}
              />
              <MichiganCountyMap title="Jobs by Michigan County" />
            </div>

          </div>
        )}
      </div>
    </AppShell>
  );
}
