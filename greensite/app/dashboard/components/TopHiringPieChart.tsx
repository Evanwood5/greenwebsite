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
        background: "#1e1e2f",
        borderRadius: 15,
        padding: 15,
        color: "white",
      }}
    >
      {/* Title */}
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
        {title}
      </h3>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height="85%">
      <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
          <Pie
            data={chartData}
            dataKey="jobCount"
            nameKey="company"
            cx="50%"
            cy="45%"
            outerRadius={75}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              percent,
            }: any) => {
              const RADIAN = Math.PI / 180;
              // Calculate position for label (slightly outside the slice)
              const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              // Only show percentages > 5% to avoid cluttering small slices
              if (percent < 0.05) return null;

              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={500}
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
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
        layout="vertical"
        verticalAlign="middle"
        align="right"
        iconType="circle"
        wrapperStyle={{ 
          fontSize: '22px',
          paddingLeft: '20px'
        }}
      />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}