"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TrendData {
  date: string;
  count: number;
}

interface MultiFieldTrendChartProps {
  title: string;
}

export default function MultiFieldTrendChart({ title }: MultiFieldTrendChartProps) {
  const [allFieldsData, setAllFieldsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data for all 4 fields
  useEffect(() => {
    async function fetchAllFields() {
      try {
        const [techRes, engRes, bizRes, healthRes] = await Promise.all([
          fetch('/api/analytics/tech'),
          fetch('/api/analytics/engineering'),
          fetch('/api/analytics/business'),
          fetch('/api/analytics/health'),
        ]);

        const [tech, engineering, business, health] = await Promise.all([
          techRes.json(),
          engRes.json(),
          bizRes.json(),
          healthRes.json(),
        ]);

        // Combine all trend data
        const combinedData: any[] = [];

        // Assuming all have same dates (last 30 days)
        // Make sure all trendData exists
        if (!tech.trendData || !engineering.trendData || !business.trendData || !health.trendData) {
          console.error('Missing trendData from one or more APIs');
          setLoading(false);
          return;
        }

        tech.trendData.forEach((item: any, index: number) => {
          combinedData.push({
            date: item.date,
            Tech: item.count,
            Engineering: engineering.trendData[index]?.count || 0,
            Business: business.trendData[index]?.count || 0,
            Health: health.trendData[index]?.count || 0,
          });
        });


        setAllFieldsData(combinedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching multi-field data:', error);
        setLoading(false);
      }
    }

    fetchAllFields();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: 280,
          background: "#1e1e2f",
          borderRadius: 16,
          padding: 16,
          color: "white",
          gridColumn: "span 2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading trends...
      </div>
    );
  }

  if (!allFieldsData) {
    return null;
  }

  return (
    <div
      style={{
        height: 280,
        background: "#1e1e2f",
        borderRadius: 16,
        padding: 16,
        color: "white",
        gridColumn: "span 2",
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
        {title}
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={allFieldsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="date"
            stroke="#888"
            tick={{ fill: '#888', fontSize: 11 }}
            interval={4}
          />
          <YAxis
            stroke="#888"
            tick={{ fill: '#888' }}
          />
          <Tooltip
            contentStyle={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 8,
              color: 'white'
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="line"
          />

          {/* 4 Lines - One per field */}
          <Line
            type="monotone"
            dataKey="Tech"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Engineering"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Business"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Health"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>


      </div>
  );
}