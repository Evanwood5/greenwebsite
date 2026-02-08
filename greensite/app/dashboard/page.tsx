"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [field, setField] = useState("tech");

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Greenify Dashboard
      </h1>

      {/* Field Selector */}
      <select
        value={field}
        onChange={(e) => setField(e.target.value)}
        style={{ padding: 8, marginBottom: 24 }}
      >
        <option value="tech">Tech</option>
        <option value="engineering">Engineering</option>
        <option value="business">Business</option>
        <option value="health">Health</option>
      </select>

      {/* Blue Container */}
      <div
        style={{
          background: "#0b4fb3",
          padding: 24,
          borderRadius: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <div
            style={{
              height: 260,
              background: "#0a0a0a",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            analytics 1
          </div>

          <div
            style={{
              height: 260,
              background: "#0a0a0a",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            analytics 2
          </div>

          <div
            style={{
              height: 220,
              background: "#0a0a0a",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 20,
              fontWeight: 600,
              gridColumn: "span 2",
            }}
          >
            analytics 3 123456
          </div>
        </div>
      </div>
    </div>
  );
}

