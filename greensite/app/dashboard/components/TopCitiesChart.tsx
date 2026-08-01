"use client";

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
  // Get max value for scaling bars
  const maxJobs = Math.max(...data.map(city => city.jobCount), 1);

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
        {title}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.slice(0, 4).map((city, index) => {
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
    </div>
  );
}