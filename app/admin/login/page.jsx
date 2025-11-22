"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  saveAdminCreds,
  getAdminCreds,
  clearAdminCreds,
} from "../../../lib/apiClient";
import { useLanguage } from "../../../components/LanguageProvider";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isArabic } = useLanguage();
  const isAr = isArabic;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already have creds, we prefill username (but not password)
  useEffect(() => {
    try {
      const creds = getAdminCreds();
      if (creds && creds.username) {
        setUsername(creds.username);
      }
    } catch (err) {
      console.error("Error reading saved admin creds:", err);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError(
        isAr
          ? "يرجى إدخال اسم المستخدم وكلمة المرور."
          : "Please enter username and password."
      );
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
          Authorization: `Basic ${basicToken}`,
        },
      });

      if (res.status === 401) {
        setError(
          isAr
            ? "بيانات الدخول غير صحيحة. تأكد من اسم المستخدم وكلمة المرور."
            : "Invalid credentials. Please check username/password."
        );
        return;
      }

      if (!res.ok) {
        console.error("Login check failed with status", res.status);
        setError(
          isAr
            ? "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى."
            : "Login failed. Please try again."
        );
        return;
      }

      // If ok, save creds and go to admin booths
      saveAdminCreds(username, password);
      router.push("/admin/booths");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        isAr
          ? "حدث خطأ ما. يرجى المحاولة مرة أخرى."
          : "Something went wrong. Please try again."
      );
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
    <main className="min-h-screen bg-black text-slate-50 relative overflow-hidden">
      {/* background glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-80 w-[34rem] -translate-x-1/2 rounded-full bg-red-500/25 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-10 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/5 bg-black/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 text-lg font-semibold tracking-tight">
              <span className="text-white">TEDx</span>
              <span className="text-red-500">Baghdad</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              {isAr ? "الادمن " : "Admin Console"}
            </span>
          </div>

          <nav className="flex items-center gap-3 text-xs md:text-sm">
            <a
              href="/"
              className="hidden rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-white/5 md:inline-flex"
            >
              {isAr ? "العودة إلى الموقع" : "Back to site"}
            </a>
          </nav>
        </div>
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/85 p-6 shadow-[0_22px_60px_rgba(0,0,0,0.85)]">
          <div className={`mb-5 space-y-1 ${isAr ? "text-right" : ""}`}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-red-300">
              {isAr ? "تسجيل دخول المشرف" : "Admin Login"}
            </p>
            <h1 className="text-xl font-semibold text-slate-50">
              {isAr
                ? "سجّل الدخول لإدارة الاجنحة وطلبات الحجز"
                : "Sign in to manage booths & requests"}
            </h1>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/70 bg-red-900/40 px-3 py-2 text-xs md:text-sm text-red-50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={`space-y-1 text-xs ${isAr ? "text-right" : ""}`}>
              <label className="block text-[11px] font-medium text-slate-200">
                {isAr ? "اسم المستخدم" : "Username"}
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="admin"
              />
            </div>

            <div className={`space-y-1 text-xs ${isAr ? "text-right" : ""}`}>
              <label className="block text-[11px] font-medium text-slate-200">
                {isAr ? "كلمة المرور" : "Password"}
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-red-600 px-4 py-2.5 text-xs font-semibold tracking-wide text-white shadow-[0_16px_40px_rgba(220,38,38,0.7)] hover:bg-red-500 disabled:bg-red-900 disabled:text-red-300 transition"
            >
              {loading
                ? isAr
                  ? "جارٍ تسجيل الدخول..."
                  : "Signing in..."
                : isAr
                ? "تسجيل الدخول"
                : "Sign in"}
            </button>
          </form>

          <div className="mt-4 flex flex-col gap-2 text-[11px] text-slate-400">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left text-[11px] text-slate-400 hover:text-slate-200 underline underline-offset-2"
            >
              {isAr ? "مسح بيانات الدخول المحفوظة" : "Clear saved credentials"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
