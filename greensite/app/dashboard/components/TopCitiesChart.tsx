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
        background: "#1a1a1a",
        borderRadius: 16,
        padding: 24,
        color: "white",
        height: "100%",
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
        {title}
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                fontSize: 13,
                color: "#888",
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
                    background: "#3b82f6",
                    borderRadius: 4,
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