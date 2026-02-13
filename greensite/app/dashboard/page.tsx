"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [field, setField] = useState("tech");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50" style={{ padding: 24 }}>
      <div className="mb-6">
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          Greenify Dashboard
        </h1>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        You are successfully authenticated and can access all dashboard features.
      </div>

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
            Analytics 1 - {field}
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
            Analytics 2 - User Data
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
            Protected Content for {user.email}
          </div>
        </div>
      </div>
    </div>
  );
}

