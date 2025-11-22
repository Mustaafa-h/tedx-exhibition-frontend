"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminGet,
  getAdminCreds,
  clearAdminCreds,
} from "../../../lib/apiClient";
import { useLanguage } from "../../../components/LanguageProvider";

export default function AdminBookingRequestsPage() {
  const router = useRouter();
  const { isArabic } = useLanguage();
  const isAr = isArabic;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [boothFilter, setBoothFilter] = useState("");
  const [filtering, setFiltering] = useState(false);

  function getCredsOrRedirect() {
    const creds = getAdminCreds();
    if (!creds?.username || !creds?.password) {
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
        setError(
          data.error ||
            (isAr
              ? "فشل في تحميل طلبات الحجز."
              : "Failed to load booking requests.")
        );
      } else {
        setError(
          isAr ? "فشل في تحميل طلبات الحجز." : "Failed to load booking requests."
        );
      }
    } catch (err) {
      console.error("Error loading booking requests:", err);
      setError(
        isAr ? "فشل في تحميل طلبات الحجز." : "Failed to load booking requests."
      );
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
      <main className="min-h-screen flex items-center justify-center bg-black text-slate-100">
        <p className="text-sm md:text-lg">
          {isAr ? "جارٍ تحميل طلبات الحجز..." : "Loading booking requests..."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-slate-50 relative overflow-hidden">
      {/* background glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-80 w-[34rem] -translate-x-1/2 rounded-full bg-red-500/25 blur-3xl" />
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
              {isAr ? "الإدارة · طلبات الحجز" : "Admin · Booking requests"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => router.push("/admin/booths")}
              className="rounded-full border border-white/15 px-3 py-1.5 text-slate-200 hover:bg-white/5"
            >
              {isAr ? "الاجنحة" : "Booths"}
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

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 space-y-6">
        {/* Header */}
        <section className="space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className={isAr ? "md:text-right" : ""}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-red-300">
                {isAr ? "نظرة عامة على الطلبات" : "Booking overview"}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold">
                {isAr
                  ? "طلبات حجز الاجنحة الواردة"
                  : "Incoming booth booking requests"}
              </h1>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
                {isAr ? (
                  <>
                    يتم إنشاء كل صف هنا عندما يضغط شخص ما على{" "}
                    <span className="font-semibold text-slate-200">
                      "احجز هذا الجناح"
                    </span>{" "}
                    في الموقع العام. تفاصيل الاتصال الكاملة تبقى في Google Forms أو
                    محادثات WhatsApp.
                  </>
                ) : (
                  <>
                    Each row here is created when someone clicks{" "}
                    <span className="font-semibold text-slate-200">
                      “Book this booth”
                    </span>{" "}
                    on the public site. Detailed contact / form data still lives in
                    Google Forms or WhatsApp threads.
                  </>
                )}
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/70 bg-red-900/40 px-4 py-2 text-xs md:text-sm text-red-50">
              {error}
            </div>
          )}
        </section>

        {/* Filter */}
        <section>
          <form
            onSubmit={handleApplyFilter}
            className="mb-4 flex flex-wrap items-center gap-3 text-xs md:text-sm"
          >
            <div
              className={
                "flex items-center gap-2 " + (isAr ? "flex-row-reverse" : "")
              }
            >
              <label className="text-[11px] text-slate-300">
                {isAr ? "تصفية حسب رقم الجناح:" : "Filter by booth number:"}
              </label>
              <input
                type="number"
                min="1"
                value={boothFilter}
                onChange={(e) => setBoothFilter(e.target.value)}
                className="w-24 rounded-xl border border-slate-700 bg-black/70 px-2 py-1 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={filtering}
              className="rounded-full bg-red-600 px-4 py-1.5 text-[11px] font-semibold text-white shadow-[0_10px_26px_rgba(220,38,38,0.7)] hover:bg-red-500 disabled:bg-red-900 disabled:text-red-200"
            >
              {filtering
                ? isAr
                  ? "جارٍ التصفية..."
                  : "Filtering..."
                : isAr
                ? "تطبيق"
                : "Apply"}
            </button>
            <button
              type="button"
              onClick={() => {
                setBoothFilter("");
                loadRequests();
              }}
              className="rounded-full border border-slate-600 px-4 py-1.5 text-[11px] text-slate-200 hover:bg-slate-900"
            >
              {isAr ? "إعادة تعيين" : "Reset"}
            </button>
          </form>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
            <div className="max-h-[460px] overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
              <table className="min-w-full text-xs">
                <thead className="bg-black/70 sticky top-0 z-10">
                  <tr className="text-[11px] text-slate-300">
                    <th className="px-4 py-2 text-left border-b border-slate-800">
                      #
                    </th>
                    <th className="px-4 py-2 text-left border-b border-slate-800">
                      {isAr ? "الجناح" : "Booth"}
                    </th>
                    <th className="px-4 py-2 text-left border-b border-slate-800">
                      {isAr ? "اسم الجناح" : "Name"}
                    </th>
                    <th className="px-4 py-2 text-left border-b border-slate-800">
                      {isAr ? "تاريخ الإنشاء" : "Created at"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req._id}
                      className="border-b border-slate-900/70 hover:bg-black/40"
                    >
                      <td className="px-4 py-2 text-[11px] text-slate-100">
                        {req.boothNumber}
                      </td>
                      <td className="px-4 py-2 text-[11px] text-slate-200">
                        {isAr
                          ? `جناح #${req.boothNumber}`
                          : `Booth #${req.boothNumber}`}
                      </td>
                      <td className="px-4 py-2 text-[11px] text-slate-200">
                        {req.boothName || (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-[11px] text-slate-300">
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
                        className="px-4 py-4 text-center text-xs md:text-sm text-slate-400"
                      >
                        {isAr
                          ? "لا توجد طلبات حجز حتى الآن."
                          : "No booking requests found yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
