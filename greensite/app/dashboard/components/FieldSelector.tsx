"use client";

type Field = "tech" | "engineering" | "business" | "health";

interface FieldSelectorProps {
  value: Field;
  onChange: (field: Field) => void;
}

const FIELD_COLORS = {
  tech: "#3b82f6",      // Blue
  engineering: "#f59e0b", // Orange
  business: "#10b981",  // Green
  health: "#ec4899",    // Pink
};

export default function FieldSelector({ value, onChange }: FieldSelectorProps) {
  const fields: Field[] = ["tech", "engineering", "business", "health"];

  return (
    <div style={{ 
      display: "flex", 
      gap: 12, 
      marginBottom: 24,
      background: "#1a1a1a",
      padding: "8px",
      borderRadius: 12,
      width: "fit-content",
    }}>
      {fields.map((field) => {
        const isSelected = value === field;
        const color = FIELD_COLORS[field];

        return (
          <button
            key={field}
            onClick={() => onChange(field)}
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              background: isSelected ? color : "transparent",
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "capitalize",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = "#2a2a2a";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {field}
          </button>
        );
      })}
    </div>
  );
}