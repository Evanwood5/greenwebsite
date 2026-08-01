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
        background: "rgba(255,255,255,0.03)",
        borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)",
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      <div style={{ fontSize: 9, color: "#52525b", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {title}
      </div>

      <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, color: "#e4e4e7" }}>
        {value.toLocaleString()}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
        {subtitle && (
          <span style={{ color: "#52525b" }}>
            {subtitle}
          </span>
        )}
        {changePercent !== undefined && (
          <span style={{
            color: isPositive ? "#4ade80" : isNegative ? "#f87171" : "#52525b",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}>
            {isPositive && "▲"}
            {isNegative && "▼"}
            {Math.abs(changePercent)}%
            {changeLabel && (
              <span style={{ color: "#52525b", fontWeight: 400 }}>
                {changeLabel}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
