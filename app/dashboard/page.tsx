
"use client";

import { useState } from "react";
import {
  Users,
  Target,
  TrendingUp,
  MapPin,
  RefreshCw,
  Lock,
  Plus,
  Pencil,
  Trash2,
  X,
  Save
} from "lucide-react";

type Lead = {
  id: string;
  student_name: string;
  city: string;
  interests: string[];
  lead_score: number;
  lead_category: string;
};

const emptyLead = {
  student_name: "",
  city: "",
  interests: "",
  lead_score: 0,
  lead_category: "Medium"
};

export default function Dashboard() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyLead);
  const [saving, setSaving] = useState(false);

  async function request(url: string, method: string, body?: any) {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": key
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Request failed");
    }

    return result;
  }

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const result = await request("/api/analytics", "POST", {});
      setData(result);
    } catch (e: any) {
      setError(e.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyLead);
    setShowForm(true);
  }

  function openEdit(lead: Lead) {
    setEditingId(lead.id);

    setForm({
      student_name: lead.student_name,
      city: lead.city,
      interests: lead.interests.join(", "),
      lead_score: lead.lead_score,
      lead_category: lead.lead_category
    });

    setShowForm(true);
  }

  async function saveLead(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        student_name: form.student_name,
        city: form.city,
        interests: form.interests
          .split(",")
          .map(x => x.trim())
          .filter(Boolean),
        lead_score: Number(form.lead_score),
        lead_category: form.lead_category
      };

      if (editingId) {
        await request(`/api/leads/${editingId}`, "PUT", payload);
      } else {
        await request("/api/leads", "POST", payload);
      }

      setShowForm(false);
      setForm(emptyLead);

      await loadDashboard();
    } catch (e: any) {
      setError(e.message || "Unable to save lead");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLead(id: string) {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {
      await request(`/api/leads/${id}`, "DELETE");
      await loadDashboard();
    } catch (e: any) {
      setError(e.message || "Unable to delete lead");
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

          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}

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

        {/* HEADER */}

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

          <div className="flex gap-3">
            <button
              onClick={loadDashboard}
              className="flex items-center gap-2 rounded-xl border border-slate-700 p-3"
            >
              <RefreshCw size={16} /> Refresh
            </button>

            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-bold text-slate-950"
            >
              <Plus size={18} /> Add Lead
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* ANALYTICS */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total leads", value: metrics.total, icon: Users },
            { title: "High-intent leads", value: metrics.highIntent, icon: Target },
            { title: "High-intent rate", value: `${metrics.highIntentRate}%`, icon: TrendingUp },
            { title: "Medium-intent leads", value: metrics.mediumIntent, icon: MapPin }
          ].map(item => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
            >
              <item.icon className="mb-5 text-cyan-400" />
              <p className="text-sm text-slate-400">{item.title}</p>
              <p className="mt-2 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* ANALYTICS DETAILS */}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-bold">Popular interests</h2>

            {Object.entries(metrics.interests || {}).map(([name, count]: any) => (
              <div key={name} className="mb-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="text-cyan-400">{count}</span>
                </div>

                <div className="h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-cyan-400"
                    style={{
                      width: `${Math.min(
                        100,
                        count / Math.max(1, metrics.total) * 100
                      )}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-bold">Leads by city</h2>

            {Object.entries(metrics.cities || {}).map(([name, count]: any) => (
              <div
                key={name}
                className="mb-4 flex justify-between border-b border-slate-800 pb-3"
              >
                <span>{name}</span>
                <span className="text-cyan-400">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LEADS TABLE */}

        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent leads</h2>
            <span className="text-sm text-slate-400">
              {data.leads.length} records
            </span>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">City</th>
                <th className="p-3">Interests</th>
                <th className="p-3">Score</th>
                <th className="p-3">Category</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.leads.map((lead: Lead) => (
                <tr key={lead.id} className="border-t border-slate-800">
                  <td className="p-3">{lead.student_name}</td>
                  <td className="p-3">{lead.city}</td>
                  <td className="p-3">{lead.interests.join(", ")}</td>
                  <td className="p-3">{lead.lead_score}</td>
                  <td className="p-3">{lead.lead_category}</td>

                  <td className="p-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(lead)}
                        className="text-cyan-400 hover:text-cyan-300"
                        title="Edit lead"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete lead"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {data.leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No leads found. Add your first lead.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CREATE / EDIT MODAL */}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6">

              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Lead" : "Add New Lead"}
                </h2>

                <button onClick={() => setShowForm(false)}>
                  <X />
                </button>
              </div>

              <form onSubmit={saveLead} className="space-y-4">

                <input
                  required
                  placeholder="Student name"
                  value={form.student_name}
                  onChange={e => setForm({ ...form, student_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
                />

                <input
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
                />

                <input
                  placeholder="Interests (comma separated)"
                  value={form.interests}
                  onChange={e => setForm({ ...form, interests: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
                />

                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Lead score"
                  value={form.lead_score}
                  onChange={e => setForm({
                    ...form,
                    lead_score: Number(e.target.value)
                  })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
                />

                <select
                  value={form.lead_category}
                  onChange={e => setForm({
                    ...form,
                    lead_category: e.target.value
                  })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
                >
                  <option value="High">High intent</option>
                  <option value="Medium">Medium intent</option>
                  <option value="Low">Low intent</option>
                </select>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 p-4 font-bold text-slate-950 disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : editingId ? "Update Lead" : "Create Lead"}
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
