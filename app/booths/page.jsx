"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicGet, publicPost } from "../../lib/apiClient";
import { useLanguage } from "../../components/LanguageProvider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// UI-only helper for colors based on booth category
function getCategoryMeta(category) {
  const cat = (category || "other").toLowerCase();

  switch (cat) {
    case "diamond":
      return {
        label: "Diamond",
        badgeClass:
          "bg-sky-500/15 text-sky-300 border border-sky-500/60",
        borderClass: "border-sky-500/50",
        dotClass: "bg-sky-400",
      };
    case "gold":
      return {
        label: "Gold",
        badgeClass:
          "bg-amber-500/15 text-amber-300 border border-amber-500/60",
        borderClass: "border-amber-500/60",
        dotClass: "bg-amber-400",
      };
    case "silver":
      return {
        label: "Silver",
        badgeClass:
          "bg-slate-400/15 text-slate-200 border border-slate-300/50",
        borderClass: "border-slate-300/60",
        dotClass: "bg-slate-200",
      };
    default:
      return {
        label: "Standard",
        badgeClass:
          "bg-emerald-500/15 text-emerald-300 border border-emerald-500/50",
        borderClass: "border-emerald-500/50",
        dotClass: "bg-emerald-400",
      };
  }
}

export default function BoothsPage() {
  const { isArabic } = useLanguage();
  const isAr = isArabic;

  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingBoothNumber, setBookingBoothNumber] = useState(null);
  const [error, setError] = useState("");

  function getCategoryLabelForUi(category) {
    const cat = (category || "other").toLowerCase();
    if (!isAr) {
      return getCategoryMeta(cat).label;
    }
    switch (cat) {
      case "diamond":
        return "ماسي";
      case "gold":
        return "ذهبي";
      case "silver":
        return "فضي";
      default:
        return "عادي";
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchBooths() {
      try {
        const data = await publicGet("/booths");
        if (isMounted) {
          setBooths(data || []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching booths:", err);
        if (isMounted) {
          setError(
            isAr ? "فشل في تحميل بيانات الاجنحة." : "Failed to load booths."
          );
          setLoading(false);
        }
      }
    }

    fetchBooths();

    const interval = setInterval(fetchBooths, 10000); // every 10s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAr]);

  async function handleBook(booth) {
    try {
      setBookingBoothNumber(booth.number);
      setError("");

      const body = {
        boothNumber: booth.number,
        boothName: `Booth ${booth.number}`,
      };

      const res = await publicPost("/booking-requests", body);

      if (res && res.success && res.redirectUrl) {
        window.location.href = res.redirectUrl;
      } else {
        console.error("Booking response:", res);
        setError(
          isAr
            ? "حدث خطأ أثناء حجز هذا الجناح."
            : "Something went wrong while booking this booth."
        );
      }
    } catch (err) {
      console.error("Error booking booth:", err);
      setError(
        isAr
          ? "حدث خطأ أثناء حجز هذا الجناح."
          : "Something went wrong while booking this booth."
      );
    } finally {
      setBookingBoothNumber(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-slate-100">
        <p className="text-sm md:text-lg">
          {isAr ? "جارٍ تحميل الاجنحة..." : "Loading booths..."}
        </p>
      </main>
    );
  }

  const boothsWithPosition = booths.filter((b) => b.position);
  const boothsWithoutPosition = booths.filter((b) => !b.position);

  return (
    <main className="min-h-screen bg-black text-slate-50">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-red-500/25 via-transparent to-transparent" />

      {/* Navbar (same vibe as home) */}
      <header className="relative z-20 border-b border-white/5 bg-black/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 text-lg font-semibold tracking-tight">
              <span className="text-white">TEDx</span>
              <span className="text-red-500">Baghdad</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              {isAr ? "خريطة الاجنحة" : "Exhibition Booths"}
            </span>
          </div>

          <nav className="flex items-center gap-3 text-xs md:text-sm">
            <Link
              href="/"
              className="hidden rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-white/5 md:inline-flex"
            >
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <Link
              href="/booths"
              className="rounded-full border border-red-500/70 bg-red-600 px-4 py-1.5 text-[11px] font-medium tracking-wide text-white shadow-lg shadow-red-600/40 hover:bg-red-500"
            >
              {isAr ? "احجز جناح" : "Book Booth"}
            </Link>
            <Link
              href="/admin/login"
              className="hidden rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-white/5 md:inline-flex"
            >
              {isAr ? "ادمن " : "Admin"}
            </Link>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 space-y-8">
        {/* Header */}
        <section className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-red-300">
            {isAr
              ? "خريطة المعرض / Exhibition Booths"
              : "Exhibition Booths / خريطة المعرض"}
          </p>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className={isAr ? "md:text-right" : ""}>
              <h1 className="text-2xl md:text-3xl font-bold">
                {isAr
                  ? "اختر جناحك في معرض TEDxBaghdad"
                  : "Choose your space in the TEDxBaghdad exhibition"}
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1">
                {isAr
                  ? "اضغط على منصة فارغة من الخريطة أو من القائمة لإرسال طلب حجز. يتم تأكيد الحجز نهائياً من قبل فريق التنظيم."
                  : "Click on an empty booth on the map or from the list to send a booking request. Final confirmation happens via the organizing team."}
              </p>
            </div>
            <div className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-[11px] text-slate-300 max-w-xs">
              {isAr ? (
                <>
                  يتم تحديث حالة المنصات تلقائياً كل{" "}
                  <span className="font-semibold text-slate-100">
                    10 ثوانٍ
                  </span>
                  .
                </>
              ) : (
                <>
                  Status updates refresh automatically every{" "}
                  <span className="font-semibold text-slate-100">
                    10 seconds
                  </span>
                  .
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-900/40 border border-red-500/70 px-4 py-2 text-xs md:text-sm text-red-50">
              {error}
            </div>
          )}
        </section>

        {/* Legend */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-[11px] text-slate-200 flex flex-wrap items-center gap-3">
          <span className="font-semibold mr-2">
            {isAr ? "الترميز:" : "Legend:"}
          </span>
          {["diamond", "gold", "silver", "other"].map((cat) => {
            const meta = getCategoryMeta(cat);
            return (
              <div
                key={cat}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-black/40 px-3 py-1"
              >
                <span
                  className={`h-2 w-2 rounded-full ${meta.dotClass}`}
                />
                <span className="text-[11px] font-medium">
                  {getCategoryLabelForUi(cat)}
                </span>
              </div>
            );
          })}
        </section>

        {/* Map + booth list */}
        <section className="grid gap-6 lg:grid-cols-[2fr,3fr] items-start">
          {/* Floorplan */}
          {/* Floorplan */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 via-black to-slate-950 p-4 shadow-lg shadow-black/40">
            <h2 className="mb-2 text-sm font-semibold text-slate-100">
              Exhibition map
            </h2>

            <div className="relative w-full h-[260px] md:h-[380px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
              {/* floorplan image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tedx/map.png" // change to .png if needed
                alt="TEDxBaghdad exhibition floorplan"
                className="h-full w-full object-cover"
              />
              {/* subtle overlay for contrast */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

              {/* markers */}
              {boothsWithPosition.map((booth) => {
                const pos = booth.position;
                const meta = getCategoryMeta(booth.category);
                const isOccupied = booth.status === "occupied";

                return (
                  <button
                    key={booth._id}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(
                        `booth-card-${booth._id}`
                      );
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                        el.classList.add(
                          "ring-2",
                          "ring-red-500",
                          "ring-offset-2",
                          "ring-offset-slate-950"
                        );
                        setTimeout(() => {
                          el.classList.remove(
                            "ring-2",
                            "ring-red-500",
                            "ring-offset-2",
                            "ring-offset-slate-950"
                          );
                        }, 1400);
                      }
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-1 text-[10px] font-semibold shadow-md backdrop-blur ${isOccupied
                        ? "bg-emerald-400 text-slate-900 border-emerald-600"
                        : "bg-black/80 text-slate-100 border-slate-500"
                      }`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                  >
                    #{booth.number}
                  </button>
                );
              })}

              {boothsWithPosition.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] text-slate-400">
                    No positioned booths yet – map markers will appear here.
                  </span>
                </div>
              )}
            </div>
          </div>


          {/* Booth cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">
                {isAr ? "قائمة الاجنحة" : "Booth list"}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isAr ? "إجمالي الاجنحة: " : "Total booths: "}
                <span className="font-semibold text-slate-100">
                  {booths.length}
                </span>
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {booths.map((booth) => {
                const isOccupied = booth.status === "occupied";
                const meta = getCategoryMeta(booth.category);

                return (
                  <div
                    key={booth._id}
                    id={`booth-card-${booth._id}`}
                    className={`flex flex-col rounded-2xl border bg-slate-950/80 p-4 shadow-lg shadow-black/40 ${meta.borderClass}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className={isAr ? "text-right" : ""}>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          {isAr
                            ? `جناح #${booth.number}`
                            : `Booth #${booth.number}`}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {isAr ? "الفئة:" : "Category: "}{" "}
                          <span className="font-medium text-slate-100">
                            {getCategoryLabelForUi(booth.category)}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={meta.badgeClass}>
                          {getCategoryLabelForUi(booth.category)}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${isOccupied
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/60"
                              : "bg-slate-700/60 text-slate-100 border border-slate-500/60"
                            }`}
                        >
                          {isOccupied
                            ? isAr
                              ? "محجوز"
                              : "Occupied"
                            : isAr
                              ? "متاح"
                              : "Empty"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 text-[11px] text-slate-300">
                      {isOccupied && booth.companyName && (
                        <div className="flex items-center gap-3">
                          {booth.companyLogoUrl && (
                            <div className="h-9 w-9 overflow-hidden rounded-lg border border-slate-700 bg-black/60">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={booth.companyLogoUrl}
                                alt={booth.companyName}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          )}
                          <div className={isAr ? "text-right" : ""}>
                            <p className="text-[11px] text-slate-400">
                              {isAr ? "محجوز لصالح:" : "Reserved for:"}
                            </p>
                            <p className="text-xs font-medium text-slate-100">
                              {booth.companyName}
                            </p>
                          </div>
                        </div>
                      )}

                      {!isOccupied && (
                        <p className="text-[11px] text-slate-300">
                          {isAr ? (
                            <>
                              هذه الجناح حالياً{" "}
                              <span className="font-semibold text-emerald-300">
                                متاح
                              </span>
                              . اضغط على الزر أدناه لإرسال طلب الحجز.
                            </>
                          ) : (
                            <>
                              This booth is currently{" "}
                              <span className="font-semibold text-emerald-300">
                                available
                              </span>
                              . Click the button below to send a booking
                              request.
                            </>
                          )}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-[10px] text-slate-500">
                        ID:{" "}
                        <span className="font-mono text-[10px] text-slate-400">
                          {booth._id}
                        </span>
                      </p>

                      {!isOccupied ? (
                        <button
                          type="button"
                          onClick={() => handleBook(booth)}
                          disabled={bookingBoothNumber === booth.number}
                          className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-white shadow-[0_10px_26px_rgba(220,38,38,0.6)] hover:bg-red-500 disabled:bg-emerald-900 disabled:text-emerald-300 transition-colors"
                        >
                          {bookingBoothNumber === booth.number
                            ? isAr
                              ? "جاري الحجز..."
                              : "Booking..."
                            : isAr
                              ? "احجز"
                              : "Book"}
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          {isAr ? "غير متاح" : "Not available"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {boothsWithoutPosition.length > 0 && (
              <p className="text-[11px] text-slate-500">
                {isAr ? (
                  <>
                    ملاحظة:{" "}
                    {boothsWithoutPosition.length} جناح لا تحتوي على
                    إحداثيات في الخريطة بعد، لكن يمكنك حجزه من خلال القائمة.
                  </>
                ) : (
                  <>
                    Note: {boothsWithoutPosition.length} booth(s) do not have
                    map positions yet. You can still book them via the list.
                  </>
                )}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
