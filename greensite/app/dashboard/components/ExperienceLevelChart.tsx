"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ExperienceLevelData {
  [key: string]: number;
}

interface ExperienceLevelChartProps {
  data: ExperienceLevelData;
  title: string;
}

export default function ExperienceLevelChart({ data, title }: ExperienceLevelChartProps) {
  // Map database values to display labels
  const levelLabels: { [key: string]: string } = {
    'moderate': 'Moderate',
    'advanced': 'Advanced',
  };

  // Only show levels that actually exist in your database
  const levelOrder = ['moderate', 'advanced'];

  // Create chart data - only show levels with data
  const chartData = levelOrder
    .map(level => ({
      level: levelLabels[level],
      jobCount: data[level] || 0,
    }))
    .filter(item => item.jobCount > 0); // Remove zeros

  return (
    <div
      style={{
        height: 260,
        background: "#0a0a0a",
        borderRadius: 16,
        padding: 16,
        color: "white",
      }}
    >
      {/* Title */}
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
        {title}
      </h3>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="level"
            stroke="#888"
            tick={{ fill: '#888', fontSize: 14 }}
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
            fill="#22c55e"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}