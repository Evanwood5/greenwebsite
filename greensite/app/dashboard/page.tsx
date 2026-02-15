"use client";

import { useState, useEffect } from "react";
import FieldSelector from "./components/FieldSelector";
import CompaniesChart from "./components/CompaniesChart";
import TopHiringPieChart from "./components/TopHiringPieChart";

type Field = "tech" | "engineering" | "business" | "health";

export default function DashboardPage() {
  const [field, setField] = useState<Field>("tech");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data when field changes
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
  }, [field]); // Re-fetch when field changes

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
        /* Blue Container */
        <div
          style={{
            background: "#0b4fb3",
            padding: 24,
            borderRadius: 16,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
            }}
          >
            {/* Analytics 1 - Companies Producing Jobs (Bar Chart) */}
            <CompaniesChart
              data={data.topCompanies}
              title="Companies Producing Jobs"
            />

            {/* Analytics 2 - Top Hiring Companies (Pie Chart) */}
            <TopHiringPieChart
              data={data.topCompanies}
              title="Top Hiring Companies"
            />
          </div>
        </div>
      )}
    </div>
  );
}