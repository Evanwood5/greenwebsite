"use client";

import { useState, useEffect } from "react";
import FieldSelector from "./components/FieldSelector";
import TopHiringPieChart from "./components/TopHiringPieChart";
import TopCitiesChart from "./components/TopCitiesChart";
import MonthlyStatsCard from "./components/MonthlyStatsCard";
import JobTypeSummary from "./components/JobTypeSummary";
import MichiganCountyMap from "./components/MichiganCountyMap";
import SubcategoryTrendChart from "./components/SubcategoryTrendChart";

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50" style={{ padding: 24 }}>
      <div className="mb-6">
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          Greenify Dashboard
        </h1>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        You are successfully authenticated and can access all dashboard features.
      </div>

      <FieldSelector value={field} onChange={setField} />

      {loading ? (
        <div className="text-center py-20 text-gray-600">Loading...</div>
      ) : !data ? (
        <div className="text-center py-20 text-red-600">Failed to load data</div>
      ) : (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(10px)",
            padding: 24,
            borderRadius: 16,
            border: "1px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
            }}
          >
            {/* Row 1 */}
            <TopHiringPieChart
              data={data.topCompanies}
              title="Top Hiring Companies"
            />

            <TopCitiesChart
              data={data.topCities}
              title="Top Cities Hiring"
            />

            {/* Row 2 */}
            <MonthlyStatsCard stats={data.monthlyStats} />

            <JobTypeSummary
              jobTypes={data.jobTypes}
              totalJobs={data.totalJobs}
            />

            {/* Row 3 - Job Trend (NEW!) */}
            <SubcategoryTrendChart
              title="Job Posting Trends by Category"
              category={field.charAt(0).toUpperCase() + field.slice(1)}
            />

            {/* Row 4 - Michigan Map */}
            <MichiganCountyMap
              title="Jobs by Michigan County"
            />
          </div>
        </div>
      )}
    </div>
  );
}