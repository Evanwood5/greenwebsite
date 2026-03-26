"use client";

import { useEffect, useState } from "react";
import { geoPath, geoAlbersUsa } from "d3-geo";
import { scaleQuantize } from "d3-scale";
import { feature } from "topojson-client";
import { aggregateByCounty } from "../data/michiganCounties";

interface CountyData {
  county: string;
  jobCount: number;
}

interface MichiganCountyMapProps {
  title: string;
}

export default function MichiganCountyMap({title }: MichiganCountyMapProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


const [countyData, setCountyData] = useState<CountyData[]>([]);
const [countyJobMap, setCountyJobMap] = useState<{ [county: string]: number }>({});
const [maxJobs, setMaxJobs] = useState(1);

// Fetch county data from API
useEffect(() => {
  async function fetchCountyData() {
    try {
      const response = await fetch('/api/analytics/counties');
      const result = await response.json();
      
      if (result.counties) {
        setCountyData(result.counties);
        setMaxJobs(result.maxJobs);
        
        // Create county job map
        const jobMap: { [county: string]: number } = {};
        result.counties.forEach((c: CountyData) => {
          jobMap[c.county] = c.jobCount;
        });
        setCountyJobMap(jobMap);
      }
    } catch (err) {
      console.error('Error fetching county data:', err);
    }
  }
  
  fetchCountyData();
}, []); // Empty dependency array - fetch once on mount

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json")
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(topology => {
        const michiganCounties: any = feature(
          topology,
          topology.objects.counties
        );

        const michiganOnly = {
          ...michiganCounties,
          features: michiganCounties.features.filter(
            (f: any) => f.id.toString().startsWith("26")
          ),
        };

        setGeoData(michiganOnly);
        setLoading(false);
      })
      .catch(err => {
        console.error("Map load error:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const colorScale = scaleQuantize<string>()
    .domain([0, maxJobs])
    .range([
    "#3b82f6",  // Medium blue (easier to see)
    "#60a5fa",  // Light blue
    "#93c5fd",  // Lighter blue
    "#bfdbfe",  // Very light blue
    "#dbeafe",  // Almost white blue
    ]);

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          minHeight: 420,
          background: "#1e1e2f",
          borderRadius: 16,
          padding: 16,
          color: "white",
          gridColumn: "span 2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading Michigan map...
      </div>
    );
  }

  if (error || !geoData) {
    return (
      <div
        style={{
          height: 420,
          background: "#1e1e2f",
          borderRadius: 16,
          padding: 16,
          color: "white",
          gridColumn: "span 2",
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          {title}
        </h3>
        <div style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
          Failed to load map
        </div>
      </div>
    );
  }

  const projection = geoAlbersUsa()
    .scale(8500)
    .translate([1125, 1500]);

  const pathGenerator = geoPath().projection(projection);

  return (
    <div
      style={{
      height: "100%",
      minHeight: 400,
      background: "#1a1a1a",
      borderRadius: 16,
      padding: 16,
      color: "white",
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
        {title}
      </h3>

      <div style={{ display: "flex", gap: 24, height: "calc(100% - 40px)" }}>
        {/* LEFT SIDE - Michigan Map (40%) */}
        <div style={{ flex: "0 0 40%" }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 700 500"
            preserveAspectRatio="xMidYMid meet"
            style={{ background: "transparent" }}
          >
            <g transform="translate(-1300, -150) scale(0.75)">
              {geoData.features.map((feat: any, i: number) => {
                const countyName = feat.properties?.name || "Unknown";
                const jobCount = countyJobMap[countyName] || 0;
                const isHovered = hoveredCounty === countyName;

                return (
                  <path
                    key={i}
                    d={pathGenerator(feat) || ""}
                    fill={jobCount > 0 ? (jobCount < 5 ? "#3b82f6" : colorScale(jobCount)) : "#1a1a1a"}
                    stroke={isHovered ? "#f59e0b" : "#555"}
                    strokeWidth={isHovered ? 2.5 : 1}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={() => setHoveredCounty(countyName)}
                    onMouseLeave={() => setHoveredCounty(null)}
                  >
                    <title>{countyName} County: {jobCount} jobs</title>
                  </path>
                );
              })}
            </g>
          </svg>
        </div>

        {/* RIGHT SIDE - Legend & Info (60%) */}
        <div style={{ flex: "0 0 60%", display: "flex", flexDirection: "column", justifyContent: "center" }}>

          {/* Hover Info */}
          {hoveredCounty && (
            <div style={{
              textAlign: "center",
              fontSize: 18,
              color: "#60a5fa",
              marginBottom: 20,
              fontWeight: 600,
            }}>
              {hoveredCounty} County: {countyJobMap[hoveredCounty] || 0} jobs
            </div>
          )}

          {/* Color Legend */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}>
            <div style={{ fontSize: 14, color: "#888", fontWeight: 600 }}>
              Job Density by County
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "#888"
            }}>
              <span>Fewer Jobs</span>
              <div style={{ display: "flex", gap: 3 }}>
                {["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"].map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: 40,
                      height: 20,
                      background: color,
                      border: "1px solid #333",
                      borderRadius: 4,
                    }}
                  />
                ))}
              </div>
              <span>More Jobs</span>
            </div>

            {/* Top Counties List */}
            <div style={{ marginTop: 20, width: "80%" }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 12, fontWeight: 600 }}>
                Top Counties
              </div>
              {countyData.slice(0, 5).map(({ county, jobCount }, index) => (
                <div
                  key={county}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    marginBottom: 8,
                    background: hoveredCounty === county ? "#1a1a1a" : "transparent",
                    borderRadius: 6,
                    fontSize: 13,
                    cursor: "pointer",
                    border: hoveredCounty === county ? "1px solid #60a5fa" : "1px solid transparent",
                  }}
                  onMouseEnter={() => setHoveredCounty(county)}
                  onMouseLeave={() => setHoveredCounty(null)}
                >
                  <span style={{ color: "#888" }}>#{index + 1} {county}</span>
                  <span style={{ fontWeight: 600, color: colorScale(jobCount) }}>{jobCount} jobs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}