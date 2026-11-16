"use client";

import AIChat from "@/components/AIChat";
import LiveChat from "@/components/LiveChat";

import { useState } from "react";
import {
  Users,
  Target,
  TrendingUp,
  MapPin,
  RefreshCw,
  Lock,
  UserPlus,
  Pencil,
  Trash2,
  Save,
  X
} from "lucide-react";

type Student = {
  id?: string;
  studentName: string;
  email: string;
  phone: string;
  city: string;
  stream: string;
  interests: string;
  experience: string;
  favoriteSubject: string;
  careerGoal: string;
  language: string;
  guardianConsent: boolean;
  consent: boolean;
};

const initialStudent: Student = {
  studentName: "",
  email: "",
  phone: "",
  city: "",
  stream: "Science",
  interests: "",
  experience: "Beginner",
  favoriteSubject: "",
  careerGoal: "",
  language: "English",
  guardianConsent: false,
  consent: false
};

type DashboardData = {
  metrics: {
    total: number;
    highIntent: number;
    highIntentRate: number;
    mediumIntent: number;
    interests: Record<string, number>;
    cities: Record<string, number>;
  };
  leads: Array<{
    id: string;
    student_name: string;
    email?: string;
    phone?: string;
    city?: string;
    interests?: string[];
    lead_score?: number;
    lead_category?: string;
  }>;
};

export default function Dashboard() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [student, setStudent] = useState<Student>(initialStudent);
  const [saving, setSaving] = useState(false);
  const [studentMessage, setStudentMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const headers = {
    "Content-Type": "application/json",
    "x-admin-key": key
  };

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers,
        body: JSON.stringify({})
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load dashboard");
      }

      setData(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingId(null);
    setStudent(initialStudent);
    setStudentMessage("");
    setShowForm(true);
  }

  function openEditForm(lead: DashboardData["leads"][number]) {
    setEditingId(lead.id);
    setStudent({
      ...initialStudent,
      studentName: lead.student_name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      city: lead.city || "",
      interests: (lead.interests || []).join(", ")
    });
    setStudentMessage("");
    setShowForm(true);
  }

  async function saveStudent() {
    setSaving(true);
    setStudentMessage("");

    try {
      if (!student.consent) {
        throw new Error("Student consent is required.");
      }

      const payload = {
        ...student,
        interests: student.interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      };

      const url = editingId
        ? `/api/admin/students/${editingId}`
        : "/api/admin/add-student";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save student");
      }

      setStudentMessage(
        editingId ? "Student updated successfully!" : "Student added successfully!"
      );

      setShowForm(false);
      setEditingId(null);
      setStudent(initialStudent);

      await loadDashboard();
    } catch (e: unknown) {
      setStudentMessage(e instanceof Error ? e.message : "Unable to save student.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student lead?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/admin/students/${id}`, {
        method: "DELETE",
        headers
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete student");
      }

      await loadDashboard();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unable to delete student.");
    } finally {
      setDeletingId(null);
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
            onChange={(event) => setKey(event.target.value)}
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
        <LiveChat />
      </main>
    );
  }

  const metrics = data.metrics;

  const textFields: Array<[keyof Student, string]> = [
    ["studentName", "Student Name"],
    ["email", "Email Address"],
    ["phone", "Phone Number"],
    ["city", "City"],
    ["favoriteSubject", "Favorite Subject"],
    ["careerGoal", "Career Goal"]
  ];

  return (
    <main className="min-h-screen bg-[#080d1b] p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-400">PATHFINDER AI</p>

            <h1 className="mt-2 text-3xl font-bold">Growth Intelligence</h1>

            <p className="mt-2 text-slate-400">
              Student acquisition, lead qualification and management
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-700 p-3 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950"
          >
            <UserPlus size={18} />
            Add Student
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Student" : "Add New Student"}
              </h2>

              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setStudent(initialStudent);
                  setStudentMessage("");
                }}
                disabled={saving}
                className="rounded-lg border border-slate-700 p-2"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {textFields.map(([field, label]) => (
                <input
                  key={field}
                  placeholder={label}
                  value={student[field] as string}
                  onChange={(event) =>
                    setStudent({
                      ...student,
                      [field]: event.target.value
                    })
                  }
                  className="rounded-xl border border-slate-700 bg-slate-950 p-4"
                />
              ))}

              <select
                value={student.stream}
                onChange={(event) =>
                  setStudent({
                    ...student,
                    stream: event.target.value
                  })
                }
                className="rounded-xl border border-slate-700 bg-slate-950 p-4"
              >
                <option>Science</option>
                <option>Commerce</option>
                <option>Arts</option>
                <option>Other</option>
              </select>

              <select
                value={student.experience}
                onChange={(event) =>
                  setStudent({
                    ...student,
                    experience: event.target.value
                  })
                }
                className="rounded-xl border border-slate-700 bg-slate-950 p-4"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              <input
                placeholder="Interests (comma separated)"
                value={student.interests}
                onChange={(event) =>
                  setStudent({
                    ...student,
                    interests: event.target.value
                  })
                }
                className="rounded-xl border border-slate-700 bg-slate-950 p-4"
              />

              <select
                value={student.language}
                onChange={(event) =>
                  setStudent({
                    ...student,
                    language: event.target.value
                  })
                }
                className="rounded-xl border border-slate-700 bg-slate-950 p-4"
              >
                {[
                  "English",
                  "Telugu",
                  "Hindi",
                  "Tamil",
                  "Kannada",
                  "Malayalam"
                ].map((language) => (
                  <option key={language}>{language}</option>
                ))}
              </select>
            </div>

            <label className="mt-5 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={student.guardianConsent}
                onChange={(event) =>
                  setStudent({
                    ...student,
                    guardianConsent: event.target.checked
                  })
                }
              />
              Guardian consent obtained (where applicable)
            </label>

            <label className="mt-4 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={student.consent}
                onChange={(event) =>
                  setStudent({
                    ...student,
                    consent: event.target.checked
                  })
                }
              />
              Student has provided consent for data collection.
            </label>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveStudent}
                disabled={saving || !student.consent}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : editingId ? "Update Student" : "Save Student"}
              </button>

              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setStudent(initialStudent);
                  setStudentMessage("");
                }}
                disabled={saving}
                className="rounded-xl border border-slate-700 px-6 py-3"
              >
                Cancel
              </button>
            </div>

            {studentMessage && (
              <p className="mt-4 text-sm text-cyan-400">{studentMessage}</p>
            )}
          </div>
        )}

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
          ].map((item) => (
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

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-bold">Popular interests</h2>

            {Object.entries(metrics.interests || {}).map(([name, count]) => (
              <div key={name} className="mb-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="text-cyan-400">{count}</span>
                </div>

                <div className="h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-cyan-400"
                    style={{
                      width: `${
                        Math.min(
                          100,
                          (Number(count) / Math.max(1, metrics.total)) * 100
                        )
                      }%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-bold">Leads by city</h2>

            {Object.entries(metrics.cities || {}).map(([name, count]) => (
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
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {(data.leads || []).map((lead) => (
                <tr key={lead.id} className="border-t border-slate-800">
                  <td className="p-3">{lead.student_name}</td>

                  <td className="p-3">{lead.city || "—"}</td>

                  <td className="p-3">
                    {(lead.interests || []).join(", ") || "—"}
                  </td>

                  <td className="p-3">{lead.lead_score ?? "—"}</td>

                  <td className="p-3">{lead.lead_category || "—"}</td>

                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(lead)}
                        className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 hover:border-cyan-400"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => deleteStudent(lead.id)}
                        disabled={deletingId === lead.id}
                        className="flex items-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 text-red-400 hover:border-red-400 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        {deletingId === lead.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {data.leads?.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No student leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <LiveChat />
    </main>
  );
}