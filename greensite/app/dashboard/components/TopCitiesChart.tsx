"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CityData {
  name: string;
  jobCount: number;
}

interface TopCitiesChartProps {
  data: CityData[];
  title: string;
}

export default function TopCitiesChart({ data, title }: TopCitiesChartProps) {
  // Take top 5 cities
  const chartData = data
    .sort((a, b) => b.jobCount - a.jobCount)
    .slice(0, 5);

  return (
    <div
      style={{
        height: 260,
        background: "#1e1e2f",
        borderRadius: 16,
        padding: 16,
        color: "white",
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
        {title}
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
<XAxis 
  dataKey="name" 
  stroke="#888"
  tick={{ fill: '#888', fontSize: 12 }}
  height={50}
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
          <Bar
            dataKey="jobCount"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
