"use client";

interface TopSkillsInDemandProps {
  data: { [key: string]: number };
  title: string;
}

const COLORS = [
  "#3b82f6",  // Blue
  "#10b981",  // Green  
  "#f59e0b",  // Orange
  "#8b5cf6",  // Purple
  "#ec4899",  // Pink
];

export default function TopSkillsInDemand({ data, title }: TopSkillsInDemandProps) {
  const skills = Object.entries(data)
    .map(([subcategory, count]) => ({
      subcategory,
      totalCount: count as number,
    }))
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 5);

  const maxCount = Math.max(...skills.map(s => s.totalCount), 1);

  return (
    <div
      style={{
        background: "#1e1e1e",
        borderRadius: 4, border: "1px solid rgba(255,255,255,0.06)",
        padding: 16,
        color: "#e4e4e7",
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
        <div style={{ fontSize: 11, color: "#3f3f46" }}>
          Last 30 Days
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {skills.map((skill, index) => {
          const percentage = Math.round((skill.totalCount / maxCount) * 100);
          const color = COLORS[index % COLORS.length];

          return (
            <div
              key={skill.subcategory}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center",
                gap: 12,
                flex: 1,
              }}>
                <div
                  style={{
                    width: 8,
                    height: "auto",
                    borderRadius: "50%",
                    background: color,
                  }}
                />
                <span style={{ fontSize: 12 }}>
                  {skill.subcategory}
                </span>
              </div>

              <div style={{
                fontSize: 13,
                fontWeight: 700,
                minWidth: 40,
                textAlign: "right",
              }}>
                {skill.totalCount}
              </div>

              <div style={{ fontSize: 11, color: "#52525b", minWidth: 40, textAlign: "right" }}>
                {percentage}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}