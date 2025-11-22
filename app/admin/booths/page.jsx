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
import { useLanguage } from "../../../components/LanguageProvider";

const CATEGORY_OPTIONS = ["diamond", "gold", "silver", "other"];
const STATUS_OPTIONS = ["empty", "occupied"];

function getCategoryMeta(category) {
  const cat = (category || "other").toLowerCase();
  switch (cat) {
    case "diamond":
      return {
        label: "Diamond",
        dotClass: "bg-sky-400",
        badgeClass:
          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border border-sky-500/70 bg-sky-500/10 text-sky-200",
      };
    case "gold":
      return {
        label: "Gold",
        dotClass: "bg-amber-400",
        badgeClass:
          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border border-amber-500/70 bg-amber-500/10 text-amber-200",
      };
    case "silver":
      return {
        label: "Silver",
        dotClass: "bg-slate-200",
        badgeClass:
          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border border-slate-300/70 bg-slate-100/5 text-slate-100",
      };
    default:
      return {
        label: "Standard",
        dotClass: "bg-emerald-400",
        badgeClass:
          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/70 bg-emerald-500/10 text-emerald-200",
      };
  }
}

function getCategoryLabelUi(category, isAr) {
  const cat = (category || "other").toLowerCase();
  if (!isAr) return getCategoryMeta(cat).label;
  switch (cat) {
    case "diamond":
      return "دايموند";
    case "gold":
      return "ذهبية";
    case "silver":
      return "فضية";
    default:
      return "عادية";
  }
}

function getStatusLabelUi(status, isAr) {
  const s = (status || "empty").toLowerCase();
  if (!isAr) return s === "occupied" ? "Occupied" : "Empty";
  return s === "occupied" ? "محجوزة" : "فارغة";
}

export default function AdminBoothsPage() {
  const router = useRouter();
  const { isArabic } = useLanguage();
  const isAr = isArabic;

  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBoothId, setEditingBoothId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);

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

  function getCredsOrRedirect() {
    const creds = getAdminCreds();
    if (!creds?.username || !creds?.password) {
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
        setError(
          data.error ||
            (isAr ? "فشل في تحميل بيانات الاجنحة." : "Failed to load booths.")
        );
      } else {
        setError(isAr ? "فشل في تحميل بيانات الاجنحة." : "Failed to load booths.");
      }
    } catch (err) {
      console.error("Error loading booths:", err);
      setError(isAr ? "فشل في تحميل بيانات الاجنحة." : "Failed to load booths.");
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
    setError("");
    setIsModalOpen(true);
  }

  function openEditModal(booth) {
    setIsEditing(true);
    setEditingBoothId(booth._id);
    setForm({
      number: booth.number?.toString() || "",
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
    setError("");
    setIsModalOpen(true);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const creds = getCredsOrRedirect();
      if (!creds) return;

      const body = {
        number: form.number,
        category: form.category,
        status: form.status,
        companyName: form.companyName,
        companyWebsite: form.companyWebsite,
        companyShortText: form.companyShortText,
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        companyLogoUrl: form.companyLogoUrl,
      };

      let res;
      if (isEditing && editingBoothId) {
        res = await adminPatch(`/admin/booths/${editingBoothId}`, {
          username: creds.username,
          password: creds.password,
          body,
        });
      } else {
        res = await adminPost("/admin/booths", {
          username: creds.username,
          password: creds.password,
          body,
        });
      }

      if (res && res.error) {
        setError(
          res.error ||
            (isAr ? "فشل في حفظ بيانات الجناح." : "Failed to save booth.")
        );
      } else {
        setIsModalOpen(false);
        await loadBooths();
      }
    } catch (err) {
      console.error("Error saving booth:", err);
      setError(isAr ? "فشل في حفظ بيانات الجناح." : "Failed to save booth.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(boothId) {
    if (
      !window.confirm(
        isAr
          ? "هل تريد حذف هذه اجناح؟ لا يمكن التراجع عن هذا الإجراء."
          : "Delete this booth? This cannot be undone."
      )
    ) {
      return;
    }

    setDeleteLoadingId(boothId);
    setError("");

    try {
      const creds = getCredsOrRedirect();
      if (!creds) return;

      const res = await adminDelete(`/admin/booths/${boothId}`, {
        username: creds.username,
        password: creds.password,
      });

      if (res && res.error) {
        setError(
          res.error ||
            (isAr ? "فشل في حذف اجناح." : "Failed to delete booth.")
        );
      } else {
        await loadBooths();
      }
    } catch (err) {
      console.error("Error deleting booth:", err);
      setError(isAr ? "فشل في حذف اجناح." : "Failed to delete booth.");
    } finally {
      setDeleteLoadingId(null);
    }
  }

  async function handleLogoFileChange(e) {
    const file = e.target.files?.[0];
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
        setError(
          res?.error ||
            (isAr ? "فشل في رفع الشعار." : "Failed to upload logo.")
        );
      }
    } catch (err) {
      console.error("Logo upload error:", err);
      setError(isAr ? "فشل في رفع الشعار." : "Failed to upload logo.");
    } finally {
      setLogoUploading(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  }

  const totalBooths = booths.length;
  const occupiedCount = booths.filter((b) => b.status === "occupied").length;
  const emptyCount = booths.filter((b) => b.status === "empty").length;

  return (
    <main className="min-h-screen bg-black text-slate-50 relative overflow-hidden">
      {/* background glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-red-500/25 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-10 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 border-b border-white/5 bg-black/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 text-lg font-semibold tracking-tight">
              <span className="text-white">TEDx</span>
              <span className="text-red-500">Baghdad</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              {isAr ? "الإدارة · إدارة الاجنحة" : "Admin · Booth management"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => router.push("/admin/booking-requests")}
              className="rounded-full border border-white/15 px-3 py-1.5 text-slate-200 hover:bg-white/5"
            >
              {isAr ? "طلبات الحجز" : "Booking requests"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/booths")}
              className="hidden md:inline-flex rounded-full border border-white/15 px-3 py-1.5 text-slate-200 hover:bg-white/5"
            >
              {isAr ? "عرض خريطة الاجنحة" : "View booth plan"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-red-500/70 bg-red-600 px-3 py-1.5 font-medium text-white shadow-[0_10px_30px_rgba(220,38,38,0.7)] hover:bg-red-500"
            >
              {isAr ? "تسجيل الخروج" : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Header + stats */}
        <section className="space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className={isAr ? "md:text-right" : ""}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-red-300">
                {isAr ? "نظرة عامة على الاجنحة" : "Booths overview"}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold">
                {isAr ? "إدارة اجنحة المعرض" : "Manage exhibition booths"}
              </h1>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
                {isAr
                  ? "هذه اللوحة تتحكم بالاجنحة الظاهرة في خريطة المعرض العامة وتجربة الحجز. أي تغيير هنا يظهر مباشرة للزوار."
                  : "This panel controls the booths shown on the public exhibition map and in the booking experience. Any changes here are reflected live."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-[11px]">
                <p className="text-slate-400">
                  {isAr ? "الإجمالي" : "Total"}
                </p>
                <p className="text-sm font-semibold text-slate-50">
                  {totalBooths}{" "}
                  {isAr ? "جناح" : "booths"}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-[11px]">
                <p className="text-emerald-200">
                  {isAr ? "محجوزة" : "Occupied"}
                </p>
                <p className="text-sm font-semibold text-emerald-100">
                  {occupiedCount}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-2 text-[11px]">
                <p className="text-slate-300">
                  {isAr ? "فارغة" : "Empty"}
                </p>
                <p className="text-sm font-semibold text-slate-50">
                  {emptyCount}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/70 bg-red-900/40 px-4 py-2 text-xs md:text-sm text-red-50">
              {error}
            </div>
          )}
        </section>

        {/* Actions */}
        <section className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            {isAr
              ? "عدّل معلومات اجناح، أضف شعاراً، أو حدّد إذا كانت محجوزة أو فارغة."
              : "Edit booth info, attach a logo, or mark spaces as occupied / empty."}
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-[11px] font-semibold tracking-wide text-white shadow-[0_12px_32px_rgba(220,38,38,0.7)] hover:bg-red-500"
          >
            {isAr ? "جناح جديد" : "New booth"}
          </button>
        </section>

        {/* Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="max-h-[540px] overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
            <table className="min-w-full text-xs">
              <thead className="bg-black/60 sticky top-0 z-10">
                <tr className="text-[11px] text-slate-300">
                  <th className="px-4 py-2 text-left border-b border-slate-800">
                    #
                  </th>
                  <th className="px-4 py-2 text-left border-b border-slate-800">
                    {isAr ? "الفئة" : "Category"}
                  </th>
                  <th className="px-4 py-2 text-left border-b border-slate-800">
                    {isAr ? "الحالة" : "Status"}
                  </th>
                  <th className="px-4 py-2 text-left border-b border-slate-800">
                    {isAr ? "الشركة" : "Company"}
                  </th>
                  <th className="px-4 py-2 text-left border-b border-slate-800">
                    {isAr ? "الموقع" : "Website"}
                  </th>
                  <th className="px-4 py-2 text-left border-b border-slate-800">
                    {isAr ? "رابط الشعار" : "Logo URL"}
                  </th>
                  <th className="px-4 py-2 text-right border-b border-slate-800">
                    {isAr ? "إجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-4 text-center text-sm text-slate-400"
                    >
                      {isAr ? "جارٍ تحميل الاجنحة..." : "Loading booths..."}
                    </td>
                  </tr>
                )}

                {!loading && booths.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-4 text-center text-sm text-slate-400"
                    >
                      {isAr ? "لا توجد اجنحة حالياً." : "No booths found."}
                    </td>
                  </tr>
                )}

                {!loading &&
                  booths.map((booth) => {
                    const meta = getCategoryMeta(booth.category);
                    const isOccupied = booth.status === "occupied";

                    return (
                      <tr
                        key={booth._id}
                        className="border-b border-slate-900/60 hover:bg-black/40"
                      >
                        <td className="px-4 py-2 align-top text-slate-100 whitespace-nowrap">
                          #{booth.number}
                        </td>
                        <td className="px-4 py-2 align-top">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${meta.dotClass}`}
                            />
                            <span className="text-[11px] text-slate-100">
                              {getCategoryLabelUi(booth.category, isAr)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 align-top">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border ${
                              isOccupied
                                ? "bg-emerald-500/10 border-emerald-500/60 text-emerald-200"
                                : "bg-slate-700/40 border-slate-500/70 text-slate-100"
                            }`}
                          >
                            {getStatusLabelUi(booth.status, isAr)}
                          </span>
                        </td>
                        <td className="px-4 py-2 align-top">
                          <div
                            className={
                              "space-y-0.5 " + (isAr ? "text-right" : "")
                            }
                          >
                            <p className="text-[11px] text-slate-100">
                              {booth.companyName || (
                                <span className="text-slate-500">—</span>
                              )}
                            </p>
                            {booth.companyShortText && (
                              <p className="text-[10px] text-slate-400 line-clamp-2">
                                {booth.companyShortText}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 align-top">
                          {booth.companyWebsite ? (
                            <a
                              href={booth.companyWebsite}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-sky-300 hover:text-sky-200 underline underline-offset-2"
                            >
                              {booth.companyWebsite}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2 align-top">
                          {booth.companyLogoUrl ? (
                            <span className="text-[11px] text-slate-300 break-all">
                              {booth.companyLogoUrl}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2 align-top text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(booth)}
                              className="rounded-full border border-slate-600 px-3 py-1 text-[11px] text-slate-100 hover:bg-slate-800"
                            >
                              {isAr ? "تعديل" : "Edit"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(booth._id)}
                              disabled={deleteLoadingId === booth._id}
                              className="rounded-full border border-red-500/70 px-3 py-1 text-[11px] text-red-200 hover:bg-red-900/60 disabled:opacity-60"
                            >
                              {deleteLoadingId === booth._id
                                ? isAr
                                  ? "جارٍ الحذف..."
                                  : "Deleting..."
                                : isAr
                                ? "حذف"
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className={isAr ? "text-right" : ""}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-red-300">
                  {isEditing
                    ? isAr
                      ? "تعديل جناح"
                      : "Edit booth"
                    : isAr
                    ? "إنشاء جناح"
                    : "Create booth"}
                </p>
                <h2 className="text-lg font-semibold text-slate-50">
                  {isEditing
                    ? isAr
                      ? `جناح #${form.number}`
                      : `Booth #${form.number}`
                    : isAr
                    ? "جناح معرض جديدة"
                    : "New exhibition booth"}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {isAr
                    ? "أدخل تفاصيل اجناح كما ترغب أن تظهر في خريطة المعرض العامة ولوحة الإدارة."
                    : "Fill in booth details as they should appear in the public map and admin."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-100 text-sm"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-3 rounded-xl border border-red-500/70 bg-red-900/40 px-3 py-2 text-[11px] text-red-50">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className={isAr ? "text-right" : ""}>
                  <label className="block mb-1 text-[11px] text-slate-200">
                    {isAr ? "رقم اجناح" : "Booth number"}
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={form.number}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-700 bg-black/70 px-2 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div className={isAr ? "text-right" : ""}>
                  <label className="block mb-1 text-[11px] text-slate-200">
                    {isAr ? "الفئة" : "Category"}
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-700 bg-black/70 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {getCategoryLabelUi(c, isAr)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={isAr ? "text-right" : ""}>
                  <label className="block mb-1 text-[11px] text-slate-200">
                    {isAr ? "الحالة" : "Status"}
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-700 bg-black/70 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {getStatusLabelUi(s, isAr)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className={isAr ? "text-right" : ""}>
                  <label className="block mb-1 text-[11px] text-slate-200">
                    {isAr ? "اسم الشركة" : "Company name"}
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-700 bg-black/70 px-2 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div className={isAr ? "text-right" : ""}>
                  <label className="block mb-1 text-[11px] text-slate-200">
                    {isAr ? "موقع الشركة" : "Company website"}
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={form.companyWebsite}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-700 bg-black/70 px-2 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className={isAr ? "text-right" : ""}>
                <label className="block mb-1 text-[11px] text-slate-200">
                  {isAr
                    ? "وصف قصير (يظهر في البطاقات)"
                    : "Short text (appears in cards)"}
                </label>
                <textarea
                  name="companyShortText"
                  value={form.companyShortText}
                  onChange={handleFormChange}
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-black/70 px-2 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className={isAr ? "text-right" : ""}>
                  <label className="block mb-1 text-[11px] text-slate-200">
                    {isAr ? "اسم المسؤول" : "Contact name"}
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={form.contactName}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-700 bg-black/70 px-2 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div className={isAr ? "text-right" : ""}>
                  <label className="block mb-1 text-[11px] text-slate-200">
                    {isAr ? "الهاتف" : "Phone"}
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-700 bg-black/70 px-2 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div className={isAr ? "text-right" : ""}>
                  <label className="block mb-1 text-[11px] text-slate-200">
                    {isAr ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-700 bg-black/70 px-2 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[2fr,1fr] items-end">
                <div className={isAr ? "text-right" : ""}>
                  <label className="block mb-1 text-[11px] text-slate-200">
                    {isAr ? "رابط الشعار" : "Logo URL"}
                  </label>
                  <input
                    type="text"
                    name="companyLogoUrl"
                    value={form.companyLogoUrl}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-700 bg-black/70 px-2 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div className={isAr ? "text-right" : ""}>
                  <label className="block mb-1 text-[11px] text-slate-200">
                    {isAr ? "أو قم برفع الشعار" : "or upload logo"}
                  </label>
                  <label className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-black/70 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-slate-900 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoFileChange}
                    />
                    {logoUploading
                      ? isAr
                        ? "جارٍ الرفع..."
                        : "Uploading..."
                      : isAr
                      ? "اختيار ملف"
                      : "Choose file"}
                  </label>
                  <p className="text-[10px] text-slate-500">
                    {isAr
                      ? "سيقوم النظام برفع الملف عبر الخادم وتحديث حقل الرابط تلقائياً."
                      : "Upload will store the file via the backend and update the URL field."}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-slate-600 px-4 py-2 text-[11px] text-slate-200 hover:bg-slate-900"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-red-600 px-5 py-2 text-[11px] font-semibold tracking-wide text-white shadow-[0_12px_36px_rgba(220,38,38,0.8)] hover:bg-red-500 disabled:bg-red-900 disabled:text-red-200"
                >
                  {saving
                    ? isEditing
                      ? isAr
                        ? "جارٍ الحفظ..."
                        : "Saving..."
                      : isAr
                      ? "جارٍ الإنشاء..."
                      : "Creating..."
                    : isEditing
                    ? isAr
                      ? "حفظ التغييرات"
                      : "Save changes"
                    : isAr
                    ? "إنشاء جناح"
                    : "Create booth"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
