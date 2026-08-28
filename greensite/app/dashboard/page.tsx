"use client";
import TopHiringCompaniesList from "./components/TopHiringCompaniesList";
import { useState, useEffect } from "react";
import FieldSelector from "./components/FieldSelector";
import LocationFilter from "./components/LocationFilter";
import TimeframeFilter from "./components/TimeframeFilter";
import SubcategoryTrendChart from "./components/SubcategoryTrendChart";
import TopCitiesChart from "./components/TopCitiesChart";
import AppShell from "@/components/layout/AppShell";

type Field = "tech" | "engineering" | "business" | "health";

export default function DashboardPage() {
  const [field, setField] = useState<Field>("tech");
  const [location, setLocation] = useState("");
  const [timeframe, setTimeframe] = useState("1year");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics/${field}?location=${location}&timeframe=${timeframe}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [field, location, timeframe]);

  const isAllCities = !location;

  return (
    <AppShell>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <FieldSelector value={field} onChange={setField} />

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <LocationFilter value={location} onChange={setLocation} />
          <TimeframeFilter value={timeframe} onChange={setTimeframe} />
        </div>

        {loading ? (
          <div style={{ color: "#52525b", paddingTop: 80, textAlign: "center", fontSize: 13 }}>Loading...</div>
        ) : !data ? (
          <div style={{ color: "#f87171", paddingTop: 80, textAlign: "center", fontSize: 13 }}>Failed to load data</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <TopHiringCompaniesList
              data={data.allCompanies}
              title="Top Hiring Companies"
            />

            {isAllCities && (
              <TopCitiesChart
                data={data.allCities}
                title="Top Hiring Cities"
              />
            )}

            <div style={{ background: "#1e1e1e", borderRadius: 4, padding: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b", marginBottom: 12 }}>
                Job Posting Trends by Category
              </p>
              <div style={{ height: 360 }}>
                <SubcategoryTrendChart
                  title=""
                  category={field.charAt(0).toUpperCase() + field.slice(1)}
                  location={location}
                  timeframe={timeframe}
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </AppShell>
  );
}
