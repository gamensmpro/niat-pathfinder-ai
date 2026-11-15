// app/page.tsx


"use client";

import { useState } from "react";
import {
  Users,
  Target,
  TrendingUp,
  MapPin,
  RefreshCw,
  Lock
} from "lucide-react";

export default function Dashboard() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key
        },
        body: JSON.stringify({})
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      setData(result);
    } catch (e: any) {
      setError(e.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d1b] p-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8">
          <Lock className="mb-5 text-cyan-400" size={32} />
          <h1 className="text-2xl font-bold">Growth Dashboard</h1>
          <p className="my-4 text-sm text-slate-400">
            Enter your administrator access key.
          </p>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="Admin key"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
          />
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          <button
            onClick={loadDashboard}
            disabled={!key || loading}
            className="mt-4 w-full rounded-xl bg-cyan-500 p-4 font-bold text-slate-950 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Access dashboard"}
          </button>
        </div>
      </main>
    );
  }

  const metrics = data.metrics;

  return (
    <main className="min-h-screen bg-[#080d1b] p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-400">PATHFINDER AI</p>
            <h1 className="mt-2 text-3xl font-bold">
              Growth Intelligence
            </h1>
            <p className="mt-2 text-slate-400">
              Student acquisition and lead qualification
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 rounded-xl border border-slate-700 p-3"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total leads",
              value: metrics.total,
              icon: Users
            },
            {
              title: "High-intent leads",
              value: metrics.highIntent,
              icon: Target
            },
            {
              title: "High-intent rate",
              value: `${metrics.highIntentRate}%`,
              icon: TrendingUp
            },
            {
              title: "Medium-intent leads",
              value: metrics.mediumIntent,
              icon: MapPin
            }
          ].map(item => (
            <div key={item.title}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <item.icon className="mb-5 text-cyan-400" />
              <p className="text-sm text-slate-400">{item.title}</p>
              <p className="mt-2 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-bold">Popular interests</h2>
            {Object.entries(metrics.interests).map(([name, count]: any) => (
              <div key={name} className="mb-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="text-cyan-400">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-cyan-400"
                    style={{
                      width: `${Math.min(100, count / Math.max(1, metrics.total) * 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-bold">Leads by city</h2>
            {Object.entries(metrics.cities).map(([name, count]: any) => (
              <div key={name}
                className="mb-4 flex justify-between border-b border-slate-800 pb-3">
                <span>{name}</span>
                <span className="text-cyan-400">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-5 text-xl font-bold">Recent leads</h2>

          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">City</th>
                <th className="p-3">Interests</th>
                <th className="p-3">Score</th>
                <th className="p-3">Category</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead: any) => (
                <tr key={lead.id} className="border-t border-slate-800">
                  <td className="p-3">{lead.student_name}</td>
                  <td className="p-3">{lead.city}</td>
                  <td className="p-3">{lead.interests.join(", ")}</td>
                  <td className="p-3">{lead.lead_score}</td>
                  <td className="p-3">{lead.lead_category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
