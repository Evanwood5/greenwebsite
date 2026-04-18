"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SubcategoryTrendChartProps {
  title: string;
  category: string;
}

// Color palette matching the reference image
const COLORS = [
  "#22c55e",  // Green - Software Engineering
  "#f59e0b",  // Orange - Data Science
  "#3b82f6",  // Blue - Cloud/DevOps
  "#ef4444",  // Red - Cybersecurity
  "#8b5cf6",  // Purple - IT/Sysadmin
  "#ec4899",  // Pink - QA/Testing
  "#06b6d4",  // Cyan - UI/UX
  "#f97316",  // Orange alt
  "#14b8a6",  // Teal
  "#a855f7",  // Purple alt
];

export default function SubcategoryTrendChart({ title, category }: SubcategoryTrendChartProps) {
  const [trendData, setTrendData] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchTrends() {
    console.log('🎨 SubcategoryTrendChart - category prop:', category);
    console.log('🌐 Fetching URL:', `/api/analytics/subcategory-trends?category=${category}`);
    
    try {
      const response = await fetch(`/api/analytics/subcategory-trends?category=${category}`);
          const result = await response.json();
          
          if (result.trendData && result.topSubcategories) {
            setTrendData(result.trendData);
            setSubcategories(result.topSubcategories.slice(0, 8).map((s: any) => s.subcategory));
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching subcategory trends:', error);
          setLoading(false);
        }
      }

      fetchTrends();
    }, [category]); // Add category as dependency!

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          background: "#1a1a1a",
          borderRadius: 16,
          padding: 16,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading trends...
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        background: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        color: "white",
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
        {title}
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="date" 
            stroke="#888"
            tick={{ fill: '#888', fontSize: 11 }}
            interval={4}
          />
          <YAxis 
            stroke="#888"
            tick={{ fill: '#888' }}
          />
          <Tooltip 
            contentStyle={{ 
              background: '#1a1a1a', 
              border: '1px solid #333',
              borderRadius: 8,
              color: 'white'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="line"
          />
          
          {/* Dynamic lines for each subcategory */}
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
