"use client";

type Field = "tech" | "engineering" | "business" | "health";

interface FieldSelectorProps {
  value: Field;
  onChange: (field: Field) => void;
}

export default function FieldSelector({ value, onChange }: FieldSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Field)}
      style={{
        padding: 8,
        marginBottom: 24,
        fontSize: 16,
        borderRadius: 8,
        border: "1px solid #ccc",
      }}
    >
      <option value="tech">Tech</option>
      <option value="engineering">Engineering</option>
      <option value="business">Business</option>
      <option value="health">Health</option>
    </select>
  );
}