"use client";

type Field = "tech" | "engineering" | "business" | "health";

interface FieldSelectorProps {
  value: Field;
  onChange: (field: Field) => void;
}

export default function FieldSelector({ value, onChange }: FieldSelectorProps) {
  const fields: Field[] = ["business", "engineering", "health", "tech"];

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      {fields.map((field) => {
        const isSelected = value === field;

        return (
          <button
            key={field}
            onClick={() => onChange(field)}
            style={{
              padding: "8px 20px",
              borderRadius: 20,
              border: isSelected ? "none" : "1px solid #333",
              background: isSelected ? "#29C115" : "transparent",
              color: "white",
              fontSize: 14,
              fontWeight: isSelected ? 600 : 400,
              cursor: "pointer",
              transition: "all 150ms",
              textTransform: "capitalize",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.borderColor = "#555";
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.borderColor = "#333";
            }}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </button>
        );
      })}
    </div>
  );
}
