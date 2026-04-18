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
        background: "#1a1a1a",
        borderRadius: 16,
        padding: 24,
        color: "white",
        height: "100%",
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
        Employment Type
      </h3>

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
                  background: '#d6ba04', 
                  border: '1px solid #333',
                  borderRadius: 8,
                  color: 'white',
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
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {chartData[0]?.percentage || 0}%
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
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
                borderBottom: "1px solid #2a2a2a",
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
                <span style={{ fontSize: 14 }}>
                  {item.name}
                </span>
              </div>

              <div style={{ 
                fontSize: 14,
                fontWeight: 600,
              }}>
                {item.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}