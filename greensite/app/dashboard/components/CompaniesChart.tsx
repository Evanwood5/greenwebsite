"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CompanyData } from "../data/dummyData";

interface CompaniesChartProps {
  data: CompanyData[];
  title: string;
}

export default function CompaniesChart({ data, title }: CompaniesChartProps) {
  // Take only top 5 companies for cleaner visualization
  const chartData = data.slice(0, 5);

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
            dataKey="company" 
            stroke="#888"
            tick={{ fill: '#888', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#888"
            tick={{ fill: '#888' }}
          />
          <Tooltip 
            contentStyle={{ 
              background: '#1a1a1a', 
              border: '1px solid #333',
              borderRadius: 8 
            }}
          />
          <Bar 
            dataKey="jobCount" 
            fill="#0b4fb3" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
