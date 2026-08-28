"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SubcategoryTrendChartProps {
  title: string;
  category: string;
  location: string;
  timeframe: string;
}

const COLORS = [
  "#29C115",
  "#f59e0b",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#14b8a6",
  "#a855f7",
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const filtered = payload.filter((entry: any) => entry.value > 0)
  if (!filtered.length) return null
  return (
    <div style={{
      background: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: 8,
      padding: '10px 14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.95)',
      pointerEvents: 'none',
      minWidth: 180,
    }}>
      <p style={{ color: '#888', fontSize: 11, marginBottom: 8, fontWeight: 600 }}>{label}</p>
      {filtered.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color, fontSize: 12, margin: '3px 0' }}>
          {entry.name}: <span style={{ color: 'white', fontWeight: 600 }}>{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function SubcategoryTrendChart({ title, category, location, timeframe }: SubcategoryTrendChartProps) {
  const [trendData, setTrendData] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      try {
        const response = await fetch(`/api/analytics/subcategory-trends?category=${category}&location=${location}&timeframe=${timeframe}`);
        const result = await response.json();

        if (result.trendData && result.topSubcategories) {
          setTrendData(result.trendData);
          setSubcategories(result.topSubcategories.slice(0, 8).map((s: any) => s.subcategory));
        }
      } catch (error) {
        console.error('Error fetching subcategory trends:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
  }, [category, location, timeframe]);

  if (loading) {
    return (
      <div style={{
        height: "100%",
        background: "#1e1e1e",
        borderRadius: 16,
        padding: 16,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset",
      }}>
        Loading trends...
      </div>
    );
  }

  return (
    <div style={{ height: "100%", background: "#1e1e1e", borderRadius: 16, padding: 16, color: "white" }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{title}</h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#888" tick={{ fill: '#888', fontSize: 11 }} interval={4} />
          <YAxis stroke="#888" tick={{ fill: '#888' }} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="line" />
          {subcategories.map((subcategory, index) => (
            <Line
              key={subcategory}
              type="monotone"
              dataKey={subcategory}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
              name={subcategory}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
