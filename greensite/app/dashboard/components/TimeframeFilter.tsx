"use client";

import { useState, useEffect, useRef } from "react";

interface TimeframeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const TIMEFRAMES = [
  { value: "1month", label: "Past 1 Month" },
  { value: "6months", label: "Past 6 Months" },
  { value: "1year", label: "Past 1 Year" },
];

export default function TimeframeFilter({ value, onChange }: TimeframeFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = TIMEFRAMES.find((t) => t.value === value) ?? TIMEFRAMES[2];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#71717a",
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        Timeframe
      </label>
      <div ref={ref} style={{ position: "relative", width: 160 }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "7px 10px",
            borderRadius: "4px",
            border: `1px solid ${open ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
            background: open
              ? "rgba(255,255,255,0.06)"
              : "rgba(255,255,255,0.03)",
            color: "#e4e4e7",
            fontSize: "12px",
            cursor: "pointer",
            textAlign: "left",
            transition: "border-color 150ms, background 150ms",
            gap: "6px",
          }}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selected.label}
          </span>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              flexShrink: 0,
              color: "#a1a1aa",
              transition: "transform 150ms",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#1e1e1e",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "4px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            zIndex: 100,
            overflow: "hidden",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {TIMEFRAMES.map((tf) => {
            const isActive = tf.value === value;
            return (
              <button
                key={tf.value}
                onClick={() => {
                  onChange(tf.value);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textAlign: "left",
                  padding: "8px 10px",
                  fontSize: "12px",
                  background: isActive
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
                  color: isActive ? "#ffffff" : "#a1a1aa",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 100ms",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                {tf.label}
              </button>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
