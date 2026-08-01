"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface JobTypeSummaryProps {
  jobTypes: { [key: string]: number };
  totalJobs: number;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function JobTypeSummary({ jobTypes, totalJobs }: JobTypeSummaryProps) {
  // Prepare data for pie chart
  const chartData = Object.entries(jobTypes || {})
    .map(([type, count]) => ({
      name: type,
      value: count,
      percentage: Math.round((count / totalJobs) * 100),
    }))
    .filter(item => item.value > 0);

  return (
    <div
      style={{
        background: "#1e1e1e",
        borderRadius: 4, border: "1px solid rgba(255,255,255,0.06)",
        padding: 16,
        color: "#e4e4e7",
        height: "100%",
      }}
    >
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b", marginBottom: 14 }}>
        Employment Type
      </p>

      <div style={{ 
        display: "flex", 
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
      }}>
        {/* Pie Chart */}
        <div style={{ flex: "0 0 200px", position: "relative" }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1e1e1e',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 4,
                  color: '#e4e4e7',
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#e4e4e7" }}>
              {chartData[0]?.percentage || 0}%
            </div>
            <div style={{ fontSize: 11, color: "#52525b" }}>
              {chartData[0]?.name || "N/A"}
            </div>
          </div>
        </div>

        {/* Legend List */}
        <div style={{ 
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
          {chartData.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: COLORS[chartData.indexOf(item) % COLORS.length],
                  }}
                />
                <span style={{ fontSize: 12, color: "#a1a1aa" }}>
                  {item.name}
                </span>
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: "#e4e4e7" }}>
                {item.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}