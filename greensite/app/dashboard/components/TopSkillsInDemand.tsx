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
        background: "#1c1c1c",
        borderRadius: 12, border: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset",
        padding: 16,
        color: "white",
      }}
    >
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 12,
      }}>
        <h3 style={{ fontSize: 13, fontWeight: 600 }}>
          {title}
        </h3>
        <div style={{ fontSize: 12, color: "#888" }}>
          •• Last 30 Days
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

              <div style={{ 
                fontSize: 12,
                color: "#29C115",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
                minWidth: 50,
              }}>
                ▲ {percentage}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}