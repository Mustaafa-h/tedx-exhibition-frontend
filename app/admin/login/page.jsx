"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  saveAdminCreds,
  getAdminCreds,
  clearAdminCreds,
} from "../../../lib/apiClient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already have creds, you can auto-fill or auto-redirect
  useEffect(() => {
    const creds = getAdminCreds();
    if (creds.username && creds.password) {
      setUsername(creds.username);
      // we don't prefill password for safety, but you could if you want:
      // setPassword(creds.password);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      // Build Basic Auth header
      const basicToken = window.btoa(`${username}:${password}`);

      // Call a protected endpoint to verify creds (admin/booths)
      const res = await fetch(`${API_BASE_URL}/admin/booths`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicToken}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Invalid username or password.");
        } else {
          setError("Failed to verify credentials.");
        }
        return;
      }

      // If ok, save creds and go to admin booths
      saveAdminCreds(username, password);
      router.push("/admin/booths");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearAdminCreds();
    setUsername("");
    setPassword("");
    setError("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-1">Admin Login</h1>
        <p className="text-sm text-slate-400 mb-6">
          Enter the credentials configured in the backend <code>.env</code>.
        </p>

        {error && (
          <div className="mb-4 rounded border border-red-500/70 bg-red-900/40 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:text-emerald-300 text-sm font-medium py-2.5 transition-colors"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 w-full text-xs text-slate-400 hover:text-slate-200 underline"
        >
          Clear saved credentials
        </button>
      </div>
    </div>
  );
}
