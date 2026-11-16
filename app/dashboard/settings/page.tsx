
"use client";

import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";

export default function AdminSettings() {
  const [currentKey, setCurrentKey] = useState("");
  const [newKey, setNewKey] = useState("");
  const [confirmKey, setConfirmKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function changeKey() {
    setMessage("");

    if (newKey !== confirmKey) {
      setMessage("New keys do not match.");
      return;
    }

    if (newKey.length < 16) {
      setMessage("Use at least 16 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/change-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentKey,
          newKey
        })
      });

      const result = await response.json();

      setMessage(result.message || result.error);

      if (response.ok) {
        setCurrentKey("");
        setNewKey("");
        setConfirmKey("");
      }
    } catch {
      setMessage("Unable to update admin key.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080d1b] p-6 text-white">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-8">

        <ShieldCheck size={36} className="mb-5 text-cyan-400" />

        <h1 className="text-2xl font-bold">
          Admin Security Settings
        </h1>

        <p className="my-3 text-sm text-slate-400">
          Change your Pathfinder AI administrator secret key.
        </p>

        <div className="space-y-4">

          <input
            type="password"
            placeholder="Current admin key"
            value={currentKey}
            onChange={(e) => setCurrentKey(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
          />

          <input
            type="password"
            placeholder="New admin key (minimum 16 characters)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
          />

          <input
            type="password"
            placeholder="Confirm new admin key"
            value={confirmKey}
            onChange={(e) => setConfirmKey(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4"
          />

          {message && (
            <p className="text-sm text-cyan-400">
              {message}
            </p>
          )}

          <button
            onClick={changeKey}
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 p-4 font-bold text-slate-950 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Admin Key"}
          </button>

        </div>
      </div>
    </main>
  );
}
