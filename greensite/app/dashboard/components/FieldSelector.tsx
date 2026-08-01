"use client";

type Field = "tech" | "engineering" | "business" | "health";

interface FieldSelectorProps {
  value: Field;
  onChange: (field: Field) => void;
}

const FIELDS: { id: Field; label: string; icon: React.ReactNode }[] = [
  {
    id: "business",
    label: "Business",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
  },
  {
    id: "engineering",
    label: "Engineering",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <rect x="9" y="9" width="6" height="6"/>
        <line x1="9" y1="2" x2="9" y2="4"/>
        <line x1="15" y1="2" x2="15" y2="4"/>
        <line x1="9" y1="20" x2="9" y2="22"/>
        <line x1="15" y1="20" x2="15" y2="22"/>
        <line x1="20" y1="9" x2="22" y2="9"/>
        <line x1="20" y1="14" x2="22" y2="14"/>
        <line x1="2" y1="9" x2="4" y2="9"/>
        <line x1="2" y1="14" x2="4" y2="14"/>
      </svg>
    ),
  },
  {
    id: "health",
    label: "Health",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  },
  {
    id: "tech",
    label: "Tech",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
];

export default function FieldSelector({ value, onChange }: FieldSelectorProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4,
          padding: 3,
          gap: 2,
        }}
      >
        {FIELDS.map(({ id, label, icon }) => {
          const isActive = value === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 4,
                border: isActive ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                color: isActive ? "#ffffff" : "#71717a",
                fontSize: 12,
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                letterSpacing: "0.01em",
                transition: "all 180ms ease",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "#a1a1aa";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "#71717a";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6, display: "flex", alignItems: "center" }}>
                {icon}
              </span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
