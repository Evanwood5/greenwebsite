"use client";

import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";

interface TopHiringPieChartProps {
  data: Array<{ company: string; jobCount: number }>;
  title: string;
}

// Color palette for the pie slices
const COLORS = ["#0b4fb3", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"] as const;

export default function TopHiringPieChart({ data, title }: TopHiringPieChartProps) {
  // Take only top 5 companies
  const chartData = data?.slice(0, 5) || [];

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
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
        {title}
      </h3>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="jobCount"
            nameKey="company"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }: { name?: string; percent?: number }) => {
              const displayPercent = typeof percent === 'number' ? (percent * 100).toFixed(0) : '0';
              const displayName = name?.split(' ')[0] || name || 'Unknown';
              return `${displayName} ${displayPercent}%`;
            }}
            labelLine={false}
          >
            {chartData.map((_, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 8,
              color: 'white'
            }}
            formatter={(value: any) => [`${value} jobs`, 'Jobs']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}