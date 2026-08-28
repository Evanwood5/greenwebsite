"use client";

import { useState } from "react";

interface Company {
  company: string;
  jobCount: number;
}

interface TopHiringCompaniesListProps {
  data: Company[];
  title: string;
}

// Helper function to format company names
function formatCompanyName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function TopHiringCompaniesList({ data, title }: TopHiringCompaniesListProps) {
  const fullList = data;
  const initialCount = 5;
  const canExpand = fullList.length > initialCount;

  const [showCount, setShowCount] = useState(initialCount);

  const atFullList = showCount >= fullList.length;
  const visibleData = fullList.slice(0, showCount);
  // Calculate total for percentage
  const totalJobs = visibleData.reduce((sum, company) => sum + company.jobCount, 0);

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
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 12,
      }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b" }}>
          {title}
        </p>
        {canExpand && (
          <div style={{ display: "flex", gap: 16 }}>
            {showCount > initialCount && (
              <button
                onClick={() => setShowCount(initialCount)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#52525b",
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                Show less
              </button>
            )}
            {!atFullList && (
              <button
                onClick={() => setShowCount(fullList.length)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#52525b",
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                View All
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {visibleData.map((company, index) => {
          const percentage = ((company.jobCount / totalJobs) * 100).toFixed(0);
          const displayName = formatCompanyName(company.company);
          const showDivider = index < showCount - 1 || (index === showCount - 1 && !atFullList);

          return (
            <div
              key={company.company}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "7px 0",
                borderBottom: showDivider ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Company logo placeholder */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {displayName.substring(0, 2).toUpperCase()}
                </div>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>
                    {displayName}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 12,
              }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                }}>
                  {company.jobCount}
                </div>
                <div style={{ fontSize: 11, color: "#52525b", fontWeight: 500 }}>
                  {percentage}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {canExpand && !atFullList && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 12 }}>
          <button
            onClick={() => setShowCount(prev => Math.min(prev + 5, fullList.length))}
            style={{
              width: "100%",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 4,
              color: "#a1a1aa",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              padding: "9px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 11 }}>▾</span>
            View More
          </button>
        </div>
      )}
    </div>
  );
}