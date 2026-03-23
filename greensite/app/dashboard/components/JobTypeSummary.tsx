"use client";

interface JobTypeSummaryProps {
  jobTypes: { [key: string]: number };
  totalJobs: number;
}

export default function JobTypeSummary({ jobTypes, totalJobs }: JobTypeSummaryProps) {
  // Calculate percentages
  const fullTime = jobTypes['Full Time'] || 0;
  const partTime = jobTypes['Part Time'] || 0;
  const internship = jobTypes['Internship'] || 0;
  const contract = jobTypes['Contract'] || 0;

  const fullTimePct = Math.round((fullTime / totalJobs) * 100);
  const partTimePct = Math.round((partTime / totalJobs) * 100);
  const internshipPct = Math.round((internship / totalJobs) * 100);

  // For now, we don't have remote data - will add later
  // This is a placeholder
  const remote = Math.round(totalJobs * 0.22); // Estimate
  const onsite = totalJobs - remote;
  const remotePct = Math.round((remote / totalJobs) * 100);
  const onsitePct = 100 - remotePct;

  return (
    <div
      style={{
        height: 260,
        background: "#1e1e2f",
        borderRadius: 16,
        padding: 20,
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
        Job Type Breakdown
      </h3>

      {/* Job Types */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
          <span>🏢 Full-Time</span>
          <span style={{ fontWeight: 700 }}>{fullTime} ({fullTimePct}%)</span>
        </div>
        <div style={{ fontSize: 14, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
          <span>⏰ Part-Time</span>
          <span style={{ fontWeight: 700 }}>{partTime} ({partTimePct}%)</span>
        </div>
        <div style={{ fontSize: 14, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
          <span>🎓 Internship</span>
          <span style={{ fontWeight: 700 }}>{internship} ({internshipPct}%)</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#333", margin: "12px 0" }} />

      {/* Remote vs On-Site */}
      <div>
        <div style={{ fontSize: 14, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
          <span>📍 Remote</span>
          <span style={{ fontWeight: 700, color: "#22c55e" }}>{remote} ({remotePct}%)</span>
        </div>
        <div style={{ fontSize: 14, display: "flex", justifyContent: "space-between" }}>
          <span>🏙️ On-Site</span>
          <span style={{ fontWeight: 700 }}>{onsite} ({onsitePct}%)</span>
        </div>
      </div>
    </div>
  );
}
