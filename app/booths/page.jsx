"use client";

import { useEffect, useState } from "react";
import { publicGet, publicPost } from "../../lib/apiClient";
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BoothsPage() {


    const [booths, setBooths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingBoothNumber, setBookingBoothNumber] = useState(null);
    const [error, setError] = useState("");

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
                    setError("Failed to load booths.");
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
    }, []);

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
                setError("Something went wrong while booking this booth.");
            }
        } catch (err) {
            console.error("Error booking booth:", err);
            setError("Something went wrong while booking this booth.");
        } finally {
            setBookingBoothNumber(null);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
                <p className="text-lg">Loading booths...</p>
            </div>
        );
    }

    const boothsWithPosition = booths.filter((b) => b.position);
    const boothsWithoutPosition = booths.filter((b) => !b.position);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">
                        Exhibition Booths
                    </h1>
                    <p  className="text-slate-300 text-sm">
                        Click on an empty booth to start booking. The floorplan view will use booth positions once we set them.
                    </p>
                </div>

                {error && (
                    <div className="rounded bg-red-900/40 border border-red-500 px-4 py-2 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
                    {/* Left: floorplan */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <h2 className="text-sm font-semibold text-slate-200 mb-3">
                            Floorplan (preview)
                        </h2>
                        <div className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-black/40">
                            {/* Floorplan image */}
                            <div className="relative w-full h-[320px] md:h-[420px] bg-slate-800 flex items-center justify-center">
                                <span className="text-xs text-slate-400">
                                    Floorplan placeholder image will be added later
                                </span>
                            </div>

                            {/* Markers (only for booths that have position) */}
                            {boothsWithPosition.map((booth) => {
                                const pos = booth.position;
                                return (
                                    <button
                                        key={booth._id}
                                        type="button"
                                        onClick={() => {
                                            // for now this just scrolls & highlights in list;
                                            // later you can open a modal directly from here.
                                            const el = document.getElementById(
                                                `booth-card-${booth._id}`
                                            );
                                            if (el) {
                                                el.scrollIntoView({ behavior: "smooth", block: "center" });
                                                el.classList.add("ring-2", "ring-emerald-400");
                                                setTimeout(() => {
                                                    el.classList.remove("ring-2", "ring-emerald-400");
                                                }, 1200);
                                            }
                                        }}
                                        className={`
                      absolute text-xs font-semibold rounded-full px-2 py-1
                      transform -translate-x-1/2 -translate-y-1/2
                      border backdrop-blur
                      ${booth.status === "occupied"
                                                ? "bg-emerald-500/80 border-emerald-900 text-slate-900"
                                                : "bg-slate-800/80 border-slate-500 text-slate-100"
                                            }
                    `}
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
                                    <p className="text-xs text-slate-400 bg-black/60 px-3 py-1 rounded-full">
                                        No positions set yet. Map markers will appear once positions are saved in admin.
                                    </p>
                                </div>
                            )}
                        </div>

                        <p className="mt-3 text-xs text-slate-500">
                            Once you set <code>position</code> (x, y, width, height as %) for each booth in the admin,
                            markers will appear on this map.
                        </p>
                    </div>

                    {/* Right: booth cards list */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-slate-200">
                                Booth list
                            </h2>
                            <span className="text-xs text-slate-400">
                                Total: {booths.length}
                            </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {booths.map((booth) => (
                                <div
                                    key={booth._id}
                                    id={`booth-card-${booth._id}`}
                                    className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 flex flex-col justify-between transition-shadow"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-lg font-semibold">
                                                Booth #{booth.number}
                                            </h3>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${booth.status === "occupied"
                                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                                                    : "bg-slate-700/60 text-slate-100 border border-slate-500/60"
                                                    }`}
                                            >
                                                {booth.status === "occupied" ? "Occupied" : "Empty"}
                                            </span>
                                        </div>

                                        <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                                            Category: {booth.category || "N/A"}
                                        </p>

                                        {booth.status === "occupied" && booth.companyName && (
                                            <div className="mt-2 flex gap-3">
                                                {/* Logo (if exists) */}
                                                {booth.companyLogoUrl && (
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-800/80">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={
                                                                booth.companyLogoUrl.startsWith("http")
                                                                    ? booth.companyLogoUrl
                                                                    : `${API_BASE_URL}${booth.companyLogoUrl}`
                                                            }
                                                            alt={booth.companyName}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                )}

                                                {/* Text info */}
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {booth.companyName}
                                                    </p>
                                                    {booth.companyShortText && (
                                                        <p className="text-xs text-slate-400 mt-1">
                                                            {booth.companyShortText}
                                                        </p>
                                                    )}
                                                    {booth.companyWebsite && (
                                                        <a
                                                            href={booth.companyWebsite}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="mt-2 inline-block text-xs text-sky-300 hover:text-sky-200 underline"
                                                        >
                                                            Visit website
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        {booth.status === "empty" ? (
                                            <button
                                                onClick={() => handleBook(booth)}
                                                disabled={bookingBoothNumber === booth.number}
                                                className="text-sm px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:text-emerald-300 transition-colors"
                                            >
                                                {bookingBoothNumber === booth.number
                                                    ? "Booking..."
                                                    : "Book this booth"}
                                            </button>
                                        ) : (
                                            <span className="text-xs text-slate-500">
                                                Not available
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {boothsWithoutPosition.length > 0 && (
                            <p className="text-[11px] text-slate-500">
                                Note: {boothsWithoutPosition.length} booth(s) do not have
                                map positions yet. You can still book them via the list.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
