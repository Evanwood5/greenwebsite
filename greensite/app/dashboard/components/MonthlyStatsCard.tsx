"use client";

import { MonthlyStats } from "../data/dummyData";

interface MonthlyStatsCardProps {
  stats: MonthlyStats;
}

export default function MonthlyStatsCard({ stats }: MonthlyStatsCardProps) {
  const isPositive = stats.percentChange > 0;

  return (
    <div
      style={{
        height: 220,
        background: "#0a0a0a",
        borderRadius: 16,
        padding: 24,
        color: "white",
        gridColumn: "span 2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
      }}
    >
      {/* Total Jobs */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>
          Total Jobs This Month
        </div>
        <div style={{ fontSize: 48, fontWeight: 700 }}>
          {stats.totalJobs.toLocaleString()}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 2,
          height: 120,
          background: "#333",
        }}
      />

      {/* Month-over-Month Change */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>
          Month-over-Month Change
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: isPositive ? "#22c55e" : "#ef4444",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>{isPositive ? "↑" : "↓"}</span>
          <span>{Math.abs(stats.percentChange)}%</span>
        </div>
        <div style={{ fontSize: 14, color: "#888", marginTop: 8 }}>
          {isPositive ? "+" : ""}
          {(stats.totalJobs - stats.previousMonth).toLocaleString()} jobs from last month
        </div>
      </div>
    </div>
  );
}
