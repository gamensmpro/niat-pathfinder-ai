
"use client";

import { useState } from "react";

interface Lead {
  id: string;
  [key: string]: unknown;
}

interface DashboardData {
  leads: Lead[];
  [key: string]: unknown;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Replace this with your existing admin-key source.
  const key = "";

  async function loadDashboard() {
    // Keep your existing dashboard-fetching implementation here.
  }

  async function deleteStudent(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this student lead?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/students/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": key,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete student");
      }

      setData((previous) => {
        if (!previous) return previous;

        return {
          ...previous,
          leads: previous.leads.filter(
            (lead) => lead.id !== id
          ),
        };
      });

      await loadDashboard();
      setError("");
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to delete student."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      {/* Keep your existing dashboard JSX here. */}
    </div>
  );
}
