
"use client";

import { useState } from "react";

interface Lead {
  id: string;
  student_name: string;
  email?: string;
  phone?: string;
  city?: string;
  interests?: string[];
  lead_score?: number;
  lead_category?: string;
  [key: string]: unknown;
}

interface DashboardData {
  leads: Lead[];
  metrics?: {
    total: number;
    highIntent: number;
    mediumIntent: number;
    earlyInterest: number;
    highIntentRate: number;
    cities: Record<string, number>;
    interests: Record<string, number>;
  };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadDashboard() {
    if (!key.trim()) {
      setError("Please enter your administrator key.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
        body: JSON.stringify({}),
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load dashboard");
      }

      setData(result);
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
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

      await loadDashboard();
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

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8">
          <h1 className="text-2xl font-bold mb-5">
            NIAT Growth Dashboard
          </h1>

          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter admin access key"
            className="w-full rounded-xl bg-slate-800 p-4 mb-4"
          />

          {error && (
            <p className="text-red-400 mb-4">{error}</p>
          )}

          <button
            onClick={loadDashboard}
            disabled={loading || !key.trim()}
            className="w-full rounded-xl bg-cyan-500 p-4 font-bold text-slate-950 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Access Dashboard"}
          </button>
        </div>
      </main>
    );
  }

  const metrics = data.metrics;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              NIAT Growth Intelligence
            </h1>
            <p className="text-slate-400 mt-2">
              Student acquisition and lead management
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            className="rounded-xl border border-slate-700 px-5 py-3"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <p className="mb-5 rounded-xl bg-red-950 p-4 text-red-400">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            ["Total Leads", metrics?.total ?? 0],
            ["High Intent", metrics?.highIntent ?? 0],
            ["High Intent Rate", `${metrics?.highIntentRate ?? 0}%`],
            ["Medium Intent", metrics?.mediumIntent ?? 0],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="text-slate-400">{label}</p>
              <p className="mt-3 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold mb-5">
            Recent Student Leads
          </h2>

          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Email</th>
                <th className="p-3">City</th>
                <th className="p-3">Interests</th>
                <th className="p-3">Score</th>
                <th className="p-3">Category</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-t border-slate-800"
                >
                  <td className="p-3">
                    {lead.student_name}
                  </td>

                  <td className="p-3">
                    {lead.email || "—"}
                  </td>

                  <td className="p-3">
                    {lead.city || "—"}
                  </td>

                  <td className="p-3">
                    {Array.isArray(lead.interests)
                      ? lead.interests.join(", ")
                      : "—"}
                  </td>

                  <td className="p-3">
                    {lead.lead_score ?? "—"}
                  </td>

                  <td className="p-3">
                    {lead.lead_category || "—"}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => deleteStudent(lead.id)}
                      disabled={deletingId === lead.id}
                      className="rounded-lg border border-red-500/40 px-3 py-2 text-red-400 disabled:opacity-50"
                    >
                      {deletingId === lead.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}

              {data.leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center">
                    No student leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
