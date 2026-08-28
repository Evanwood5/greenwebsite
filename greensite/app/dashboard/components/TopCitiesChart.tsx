"use client";

import { useState } from "react";

interface City {
  name: string;
  jobCount: number;
}

interface TopCitiesChartProps {
  data: City[];
  title: string;
}

// Helper function to format city names
function formatCityName(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function TopCitiesChart({ data, title }: TopCitiesChartProps) {
  const fullList = data;
  const initialCount = 4;
  const canExpand = fullList.length > initialCount;

  const [showCount, setShowCount] = useState(initialCount);

  const atFullList = showCount >= fullList.length;
  const visibleData = fullList.slice(0, showCount);
  // Get max value for scaling bars (use full list so bars stay proportionally scaled)
  const maxJobs = Math.max(...fullList.map(city => city.jobCount), 1);

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
        marginBottom: 14,
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

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {visibleData.map((city) => {
          const barWidth = (city.jobCount / maxJobs) * 100;
          const displayName = formatCityName(city.name);
          
          return (
            <div
              key={city.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* City Name */}
              <div style={{
                width: 100,
                fontSize: 12,
                color: "#52525b",
                textAlign: "right",
              }}>
                {displayName}
              </div>

              {/* Bar Container */}
              <div style={{ 
                flex: 1,
                position: "relative",
                height: 32,
                display: "flex",
                alignItems: "center",
              }}>
                {/* Blue Bar */}
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: "100%",
                    background: "rgba(255,255,255,0.14)",
                    borderRadius: 2,
                    transition: "width 0.3s ease",
                  }}
                />
                
                {/* Job Count Number */}
                <div style={{
                  position: "absolute",
                  right: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "white",
                }}>
                  {city.jobCount}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {canExpand && !atFullList && (
        <button
          onClick={() => setShowCount(prev => Math.min(prev + 5, fullList.length))}
          style={{
            width: "100%",
            marginTop: 12,
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
      )}
    </div>
  );
}