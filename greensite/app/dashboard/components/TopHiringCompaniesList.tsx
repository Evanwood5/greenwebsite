"use client";

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
  // Calculate total for percentage
  const totalJobs = data.reduce((sum, company) => sum + company.jobCount, 0);

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
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "#52525b",
            fontSize: 11,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          View All
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {data.slice(0, 5).map((company, index) => {
          const percentage = ((company.jobCount / totalJobs) * 100).toFixed(0);
          const displayName = formatCompanyName(company.company);
          
          return (
            <div
              key={company.company}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "7px 0",
                borderBottom: index < 4 ? "1px solid rgba(255,255,255,0.05)" : "none",
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
    </div>
  );
}