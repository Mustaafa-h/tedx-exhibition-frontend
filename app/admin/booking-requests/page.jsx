"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminGet,
  getAdminCreds,
  clearAdminCreds,
} from "../../../lib/apiClient";

export default function AdminBookingRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [boothFilter, setBoothFilter] = useState("");
  const [filtering, setFiltering] = useState(false);

  function getCredsOrRedirect() {
    const creds = getAdminCreds();
    if (!creds.username || !creds.password) {
      router.push("/admin/login");
      return null;
    }
    return creds;
  }

  async function loadRequests(options = {}) {
    try {
      setError("");
      if (!options.keepLoadingState) setLoading(true);

      const creds = getCredsOrRedirect();
      if (!creds) return;

      const params = new URLSearchParams();
      if (options.boothNumber) {
        params.set("boothNumber", options.boothNumber);
      }

      const path =
        params.toString().length > 0
          ? `/admin/booking-requests?${params.toString()}`
          : "/admin/booking-requests";

      const data = await adminGet(path, {
        username: creds.username,
        password: creds.password,
      });

      if (Array.isArray(data)) {
        setRequests(data);
      } else if (data && data.error) {
        setError(data.error || "Failed to load booking requests.");
      } else {
        setError("Failed to load booking requests.");
      }
    } catch (err) {
      console.error("Error loading booking requests:", err);
      setError("Failed to load booking requests.");
    } finally {
      setLoading(false);
      setFiltering(false);
    }
  }

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    clearAdminCreds();
    router.push("/admin/login");
  }

  async function handleApplyFilter(e) {
    e.preventDefault();
    setFiltering(true);

    const boothNumber = boothFilter.trim();
    if (!boothNumber) {
      await loadRequests({ keepLoadingState: false });
    } else {
      await loadRequests({ boothNumber, keepLoadingState: false });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-lg">Loading booking requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin – Booking Requests</h1>
            <p className="text-sm text-slate-400">
              These are records created when someone clicks{" "}
              <span className="font-semibold">“Book this booth”</span> on the
              public site. The actual details are in Google Forms / WhatsApp.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-md border border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-500/70 bg-red-900/40 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {/* Filter */}
        <form
          onSubmit={handleApplyFilter}
          className="mb-4 flex flex-wrap items-center gap-3 text-sm"
        >
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-300">
              Filter by booth number:
            </label>
            <input
              type="number"
              min="1"
              value={boothFilter}
              onChange={(e) => setBoothFilter(e.target.value)}
              className="w-24 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={filtering}
            className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs disabled:bg-slate-900"
          >
            {filtering ? "Filtering..." : "Apply"}
          </button>
          <button
            type="button"
            onClick={() => {
              setBoothFilter("");
              loadRequests();
            }}
            className="px-3 py-1.5 rounded-md border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
          >
            Reset
          </button>
        </form>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/90">
              <tr>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  #
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  Booth
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  Name
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  Created at
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-slate-800/60">
                  <td className="px-4 py-2 border-b border-slate-800 text-xs">
                    {req.boothNumber}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-800 text-xs">
                    Booth #{req.boothNumber}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-800 text-xs">
                    {req.boothName || (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-800 text-xs text-slate-300">
                    {req.createdAt
                      ? new Date(req.createdAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-sm text-slate-400"
                  >
                    No booking requests found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
