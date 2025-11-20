"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminGet,
  adminPost,
  adminPatch,
  adminDelete,
  adminUploadLogo,
  getAdminCreds,
  clearAdminCreds,
} from "../../../lib/apiClient";

const CATEGORY_OPTIONS = ["diamond", "gold", "silver", "other"];
const STATUS_OPTIONS = ["empty", "occupied"];

export default function AdminBoothsPage() {
  const router = useRouter();
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBoothId, setEditingBoothId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [form, setForm] = useState({
    number: "",
    category: "other",
    status: "empty",
    companyName: "",
    companyWebsite: "",
    companyShortText: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    companyLogoUrl: "",
  });

  const [logoUploading, setLogoUploading] = useState(false);


  function getCredsOrRedirect() {
    const creds = getAdminCreds();
    if (!creds.username || !creds.password) {
      router.push("/admin/login");
      return null;
    }
    return creds;
  }

  async function loadBooths() {
    try {
      setError("");
      setLoading(true);

      const creds = getCredsOrRedirect();
      if (!creds) return;

      const data = await adminGet("/admin/booths", {
        username: creds.username,
        password: creds.password,
      });

      if (Array.isArray(data)) {
        setBooths(data);
      } else if (data && data.error) {
        setError(data.error || "Failed to load booths.");
      } else {
        setError("Failed to load booths.");
      }
    } catch (err) {
      console.error("Error loading admin booths:", err);
      setError("Failed to load booths.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooths();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    clearAdminCreds();
    router.push("/admin/login");
  }

  function openCreateModal() {
    setIsEditing(false);
    setEditingBoothId(null);
    setForm({
      number: "",
      category: "other",
      status: "empty",
      companyName: "",
      companyWebsite: "",
      companyShortText: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      companyLogoUrl: "",
    });

    setIsModalOpen(true);
  }

  function openEditModal(booth) {
    setIsEditing(true);
    setEditingBoothId(booth._id);
    setForm({
      number: booth.number ?? "",
      category: booth.category || "other",
      status: booth.status || "empty",
      companyName: booth.companyName || "",
      companyWebsite: booth.companyWebsite || "",
      companyShortText: booth.companyShortText || "",
      contactName: booth.contactName || "",
      contactPhone: booth.contactPhone || "",
      contactEmail: booth.contactEmail || "",
      companyLogoUrl: booth.companyLogoUrl || "",
    });

    setIsModalOpen(true);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLogoFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setError("");
    setLogoUploading(true);

    try {
      const creds = getCredsOrRedirect();
      if (!creds) return;

      const res = await adminUploadLogo({
        username: creds.username,
        password: creds.password,
        file,
      });

      if (res && res.success && res.url) {
        setForm((prev) => ({
          ...prev,
          companyLogoUrl: res.url,
        }));
      } else {
        setError(res?.error || "Failed to upload logo.");
      }
    } catch (err) {
      console.error("Logo upload error:", err);
      setError("Failed to upload logo.");
    } finally {
      setLogoUploading(false);
      // reset file input so same file can be reselected if needed
      e.target.value = "";
    }
  }


  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const creds = getCredsOrRedirect();
      if (!creds) return;

      const payload = {
        number: form.number ? Number(form.number) : undefined,
        category: form.category,
        status: form.status,
        companyName: form.companyName || undefined,
        companyWebsite: form.companyWebsite || undefined,
        companyShortText: form.companyShortText || undefined,
        contactName: form.contactName || undefined,
        contactPhone: form.contactPhone || undefined,
        contactEmail: form.contactEmail || undefined,
        companyLogoUrl: form.companyLogoUrl || undefined,
      };


      let res;
      if (isEditing && editingBoothId) {
        res = await adminPatch(`/admin/booths/${editingBoothId}`, {
          username: creds.username,
          password: creds.password,
          body: payload,
        });
      } else {
        if (!form.number) {
          setError("Booth number is required.");
          setSaving(false);
          return;
        }

        res = await adminPost("/admin/booths", {
          username: creds.username,
          password: creds.password,
          body: payload,
        });
      }

      if (res && res.error) {
        setError(res.error || "Failed to save booth.");
      } else {
        setIsModalOpen(false);
        await loadBooths();
      }
    } catch (err) {
      console.error("Error saving booth:", err);
      setError("Failed to save booth.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(booth) {
    const confirmDelete = window.confirm(
      `Delete booth #${booth.number}? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      setDeleteLoadingId(booth._id);
      const creds = getCredsOrRedirect();
      if (!creds) return;

      const res = await adminDelete(`/admin/booths/${booth._id}`, {
        username: creds.username,
        password: creds.password,
      });

      if (res && res.success) {
        await loadBooths();
      } else {
        setError(res.error || "Failed to delete booth.");
      }
    } catch (err) {
      console.error("Error deleting booth:", err);
      setError("Failed to delete booth.");
    } finally {
      setDeleteLoadingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-lg">Loading admin booths...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin – Booths</h1>
            <p className="text-sm text-slate-400">
              Create, edit, or delete booths. These changes update the public
              website in near realtime.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openCreateModal}
              className="text-xs px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              + New Booth
            </button>

            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-md border border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-500/70 bg-red-900/40 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/90">
              <tr>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  #
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  Category
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  Status
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  Company
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  Website
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  Logo URL
                </th>
                <th className="px-4 py-2 text-right border-b border-slate-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {booths.map((booth) => (
                <tr key={booth._id} className="hover:bg-slate-800/60">
                  <td className="px-4 py-2 border-b border-slate-800">
                    {booth.number}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-800 uppercase text-xs text-slate-300">
                    {booth.category || "—"}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-800">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ${booth.status === "occupied"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/50"
                        : "bg-slate-700/40 text-slate-100 border-slate-500/70"
                        }`}
                    >
                      {booth.status || "empty"}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b border-slate-800">
                    {booth.companyName || (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-800">
                    {booth.companyWebsite ? (
                      <a
                        href={booth.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-sky-300 hover:text-sky-200 underline"
                      >
                        {booth.companyWebsite}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-800">
                    {booth.companyLogoUrl ? (
                      <span className="text-[11px] text-slate-300">
                        {booth.companyLogoUrl}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-800 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(booth)}
                        className="text-xs px-2 py-1 rounded border border-slate-600 hover:bg-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(booth)}
                        disabled={deleteLoadingId === booth._id}
                        className="text-xs px-2 py-1 rounded border border-red-600 text-red-300 hover:bg-red-900/30 disabled:opacity-60"
                      >
                        {deleteLoadingId === booth._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {booths.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-4 text-center text-sm text-slate-400"
                  >
                    No booths found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {isEditing
                  ? `Edit Booth #${form.number || ""}`
                  : "Create New Booth"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-3 rounded border border-red-500/70 bg-red-900/40 px-3 py-2 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1">Booth number *</label>
                  <input
                    type="number"
                    name="number"
                    min="1"
                    value={form.number}
                    onChange={handleFormChange}
                    disabled={isEditing}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs mb-1">Company name</label>
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Company website</label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={form.companyWebsite}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Short text</label>
                <textarea
                  name="companyShortText"
                  value={form.companyShortText}
                  onChange={handleFormChange}
                  rows={2}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Logo URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="companyLogoUrl"
                    value={form.companyLogoUrl}
                    onChange={handleFormChange}
                    className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                    placeholder="/uploads/logo-123.png or https://..."
                  />
                  <label className="text-[11px] px-2 py-1.5 rounded-md border border-slate-600 text-slate-200 hover:bg-slate-800 cursor-pointer">
                    {logoUploading ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoFileChange}
                      disabled={logoUploading}
                    />
                  </label>
                </div>
                {form.companyLogoUrl && (
                  <p className="mt-1 text-[10px] text-slate-500 break-all">
                    Using: {form.companyLogoUrl}
                  </p>
                )}
              </div>


              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs mb-1">Contact name</label>
                  <input
                    type="text"
                    name="contactName"
                    value={form.contactName}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Phone</label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-slate-600 text-xs text-slate-200 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-xs font-medium disabled:bg-emerald-900 disabled:text-emerald-300"
                >
                  {saving
                    ? isEditing
                      ? "Saving..."
                      : "Creating..."
                    : isEditing
                      ? "Save changes"
                      : "Create booth"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
