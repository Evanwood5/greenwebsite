'use client'

import { useState, useRef, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Field, City, Company, CityOption, SubcategoryCount } from '../../lib/types/dashboard'

const FIELDS: { id: Field; label: string; icon: React.ReactNode }[] = [
  {
    id: 'business',
    label: 'Business',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
  },
  {
    id: 'engineering',
    label: 'Engineering',
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
    id: 'health',
    label: 'Health',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  },
  {
    id: 'tech',
    label: 'Tech',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
]

export function FieldSelector({ value, onChange }: { value: Field; onChange: (field: Field) => void }) {
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

export function LocationFilter({
  value,
  onChange,
  cities,
}: {
  value: string
  onChange: (value: string) => void
  cities: CityOption[]
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = cities.find((c) => c.value === value) ?? cities[0];

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
        Location
      </label>
      <div ref={ref} style={{ position: "relative", width: 180 }}>
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
          {cities.map((city) => {
            const isActive = city.value === value;
            return (
              <button
                key={city.value}
                onClick={() => {
                  onChange(city.value);
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
                {city.label}
              </button>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}

export function TimeframeFilter({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((t) => t.value === value) ?? options[options.length - 1];

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
          {options.map((tf) => {
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

function formatCompanyName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function TopHiringCompaniesList({ data, title }: { data: Company[]; title: string }) {
  const fullList = data;
  const initialCount = 5;
  const canExpand = fullList.length > initialCount;

  const [showCount, setShowCount] = useState(initialCount);

  const atFullList = showCount >= fullList.length;
  const visibleData = fullList.slice(0, showCount);
  const totalJobs = visibleData.reduce((sum, company) => sum + company.jobCount, 0);

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
        {canExpand && (
          <div style={{ display: "flex", gap: 16 }}>
            {showCount > initialCount && (
              <button
                onClick={() => setShowCount(initialCount)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#52525b",
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                Show less
              </button>
            )}
            {!atFullList && (
              <button
                onClick={() => setShowCount(fullList.length)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#52525b",
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                View All
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {visibleData.map((company, index) => {
          const percentage = ((company.jobCount / totalJobs) * 100).toFixed(0);
          const displayName = formatCompanyName(company.company);
          const showDivider = index < showCount - 1 || (index === showCount - 1 && !atFullList);

          return (
            <div
              key={company.company}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "7px 0",
                borderBottom: showDivider ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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

      {canExpand && !atFullList && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 12 }}>
          <button
            onClick={() => setShowCount(prev => Math.min(prev + 5, fullList.length))}
            style={{
              width: "100%",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 4,
              color: "#a1a1aa",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              padding: "9px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 11 }}>▾</span>
            View More
          </button>
        </div>
      )}
    </div>
  );
}

function formatCityName(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function TopCitiesChart({ data, title }: { data: City[]; title: string }) {
  const fullList = data;
  const initialCount = 4;
  const canExpand = fullList.length > initialCount;

  const [showCount, setShowCount] = useState(initialCount);

  const atFullList = showCount >= fullList.length;
  const visibleData = fullList.slice(0, showCount);
  const maxJobs = Math.max(...fullList.map(city => city.jobCount), 1);

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
        marginBottom: 14,
      }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b" }}>
          {title}
        </p>
        {canExpand && (
          <div style={{ display: "flex", gap: 16 }}>
            {showCount > initialCount && (
              <button
                onClick={() => setShowCount(initialCount)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#52525b",
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                Show less
              </button>
            )}
            {!atFullList && (
              <button
                onClick={() => setShowCount(fullList.length)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#52525b",
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                View All
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {visibleData.map((city) => {
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
              <div style={{
                width: 100,
                fontSize: 12,
                color: "#52525b",
                textAlign: "right",
              }}>
                {displayName}
              </div>

              <div style={{ 
                flex: 1,
                position: "relative",
                height: 32,
                display: "flex",
                alignItems: "center",
              }}>
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: "100%",
                    background: "rgba(255,255,255,0.14)",
                    borderRadius: 2,
                    transition: "width 0.3s ease",
                  }}
                />
                
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

      {canExpand && !atFullList && (
        <button
          onClick={() => setShowCount(prev => Math.min(prev + 5, fullList.length))}
          style={{
            width: "100%",
            marginTop: 12,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 4,
            color: "#a1a1aa",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            padding: "9px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 11 }}>▾</span>
          View More
        </button>
      )}
    </div>
  );
}

const COLORS = [
  "#29C115",
  "#f59e0b",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#14b8a6",
  "#a855f7",
];

interface TooltipEntry {
  name?: string | number
  value?: number
  color?: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  const filtered = payload.filter((entry) => (entry.value ?? 0) > 0)
  if (!filtered.length) return null
  return (
    <div style={{
      background: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: 8,
      padding: '10px 14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.95)',
      pointerEvents: 'none',
      minWidth: 180,
    }}>
      <p style={{ color: '#888', fontSize: 11, marginBottom: 8, fontWeight: 600 }}>{label}</p>
      {filtered.map((entry) => (
        <p key={String(entry.name)} style={{ color: entry.color, fontSize: 12, margin: '3px 0' }}>
          {entry.name}: <span style={{ color: 'white', fontWeight: 600 }}>{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

export function SubcategoryTrendChart({
  title,
  trendData,
  topSubcategories,
  loading,
}: {
  title: string
  trendData: Record<string, string | number>[]
  topSubcategories: SubcategoryCount[]
  loading: boolean
}) {
  const subcategories = topSubcategories.slice(0, 8).map((s) => s.subcategory)

  if (loading) {
    return (
      <div style={{
        height: "100%",
        background: "#1e1e1e",
        borderRadius: 16,
        padding: 16,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset",
      }}>
        Loading trends...
      </div>
    );
  }

  return (
    <div style={{ height: "100%", background: "#1e1e1e", borderRadius: 16, padding: 16, color: "white" }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{title}</h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#888" tick={{ fill: '#888', fontSize: 11 }} interval={4} />
          <YAxis stroke="#888" tick={{ fill: '#888' }} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="line" />
          {subcategories.map((subcategory, index) => (
            <Line
              key={subcategory}
              type="monotone"
              dataKey={subcategory}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
              name={subcategory}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
