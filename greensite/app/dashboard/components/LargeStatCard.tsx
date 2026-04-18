"use client";

interface LargeStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  changePercent?: number;
  changeLabel?: string;
  icon?: string;
}

export default function LargeStatCard({ 
  title, 
  value, 
  subtitle, 
  changePercent, 
  changeLabel 
}: LargeStatCardProps) {
  const isPositive = changePercent && changePercent > 0;
  const isNegative = changePercent && changePercent < 0;

  return (
    <div
      style={{
        background: "#1a1a1a",
        borderRadius: 16,
        padding: "24px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Title */}
      <div style={{ 
        fontSize: 14, 
        color: "#888",
        fontWeight: 500,
      }}>
        {title}
      </div>

      {/* Main Value */}
      <div style={{ 
        fontSize: 48, 
        fontWeight: 700,
        lineHeight: 1,
      }}>
        {value.toLocaleString()}
      </div>

      {/* Subtitle and Change Indicator */}
      <div style={{ 
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
      }}>
        {subtitle && (
          <span style={{ color: "#888" }}>
            {subtitle}
          </span>
        )}
        
        {changePercent !== undefined && (
          <span style={{ 
            color: isPositive ? "#22c55e" : isNegative ? "#ef4444" : "#888",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}>
            {isPositive && "▲"}
            {isNegative && "▼"}
            {Math.abs(changePercent)}%
            {changeLabel && (
              <span style={{ color: "#666", fontWeight: 400 }}>
                {changeLabel}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
