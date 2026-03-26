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
        background: "#1a1a1a",
        borderRadius: 16,
        padding: 24,
        color: "white",
        height: "100%",
      }}
    >
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 20,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>
          {title}
        </h3>
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "#3b82f6",
            fontSize: 13,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          View All
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
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
                padding: "12px 0",
                borderBottom: index < 4 ? "1px solid #2a2a2a" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Company logo placeholder */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: "#2563eb",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {displayName.substring(0, 2).toUpperCase()}
                </div>

                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
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
                  fontSize: 16, 
                  fontWeight: 700,
                }}>
                  {company.jobCount}
                </div>
                <div style={{ 
                  fontSize: 12, 
                  color: "#22c55e",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}>
                  ▲ {percentage}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}