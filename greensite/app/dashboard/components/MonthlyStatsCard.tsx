"use client";

import { MonthlyStats } from "../data/dummyData";

interface MonthlyStatsCardProps {
  stats: MonthlyStats;
}

export default function MonthlyStatsCard({ stats }: MonthlyStatsCardProps) {
  const isPositive = stats.percentChange > 0;
  const isZero = stats.percentChange === 0;

  return (
    <div
      style={{
        height: 260,
        background: "#1e1e2f",
        borderRadius: 16,
        padding: 24,
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      {/* Total Jobs */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
          Total Jobs This Month
        </div>
        <div style={{ fontSize: 42, fontWeight: 700 }}>
          {stats.totalJobs.toLocaleString()}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "80%",
          height: 1,
          background: "#333",
        }}
      />

      {/* Month-over-Month Change */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>
          Month-over-Month Change
        </div>
        {isZero && stats.previousMonth === 0 ? (
          <>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#888" }}>
              New Data
            </div>
            <div style={{ fontSize: 14, color: "#888", marginTop: 8 }}>
              First month of tracking
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: isPositive ? "#22c55e" : isZero ? "#888" : "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {!isZero && <span>{isPositive ? "↑" : "↓"}</span>}
              <span>{Math.abs(stats.percentChange)}%</span>
            </div>
            <div style={{ fontSize: 14, color: "#888", marginTop: 8 }}>
              {isPositive ? "+" : isZero ? "" : ""}
              {(stats.totalJobs - stats.previousMonth).toLocaleString()} jobs from last month
            </div>
          </>
        )}
      </div>
    </div>
  );
}