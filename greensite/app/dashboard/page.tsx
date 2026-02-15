"use client";

import { useState } from "react";
import FieldSelector from "./components/FieldSelector";
import CompaniesChart from "./components/CompaniesChart";
import TopHiringPieChart from "./components/TopHiringPieChart";
import MonthlyStatsCard from "./components/MonthlyStatsCard";
import { Field, fieldData } from "./data/dummyData";

export default function DashboardPage() {
  const [field, setField] = useState<Field>("tech");

  // Get data for selected field
  const currentData = fieldData[field];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Greenify Dashboard
      </h1>

      <FieldSelector value={field} onChange={setField} />

      {/* Blue Container */}
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
            data={currentData.companiesProducingJobs}
            title="Companies Producing Jobs"
          />

          {/* Analytics 2 - Top Hiring Companies (Pie Chart) */}
          <TopHiringPieChart 
            data={currentData.topHiringCompanies}
            title="Top Hiring Companies"
          />

          {/* Analytics 3 - Monthly Stats */}
          <MonthlyStatsCard stats={currentData.monthlyStats} />
        </div>
      </div>
    </div>
  );
}