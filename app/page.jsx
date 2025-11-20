"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* top gradient */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-500/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-16">
        {/* Header / navbar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold">
              TEDx
            </div>
            <div>
              <p className="text-sm font-semibold">TEDxBaghdad</p>
              <p className="text-[11px] text-slate-400">
                Exhibition &amp; Partners Area
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-xs">
            <Link
              href="/booths"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Booth map
            </Link>
            <Link
              href="/admin/login"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Admin
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="grid gap-10 lg:grid-cols-[3fr,2fr] items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-emerald-300 mb-3">
              TEDxBaghdad 2025 · Exhibition
            </p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Showcase your brand in front of{" "}
              <span className="text-emerald-400">TEDx</span> attendees.
            </h1>
            <p className="text-sm text-slate-300 mb-6 max-w-xl">
              Reserve a booth in the exhibition area, highlight your products
              and services, and connect with a highly engaged audience attending
              TEDxBaghdad.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/booths"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-sm font-medium shadow-lg shadow-emerald-500/20"
              >
                Book a booth
              </Link>

              <a
                href="#why-participate"
                className="text-xs text-slate-300 hover:text-white underline-offset-4 hover:underline"
              >
                Learn more about participation
              </a>
            </div>

            <p className="mt-5 text-[11px] text-slate-500">
              The booking process is simple: choose an empty booth on the map,
              submit your details via the form, then our team will contact you
              on WhatsApp to finalize everything.
            </p>
          </div>

          {/* Right: small info card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <h2 className="text-sm font-semibold mb-1">
              Exhibition at a glance
            </h2>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• Clear digital map of all booths (Diamond / Gold / Silver).</li>
              <li>• Live status updates – see which spaces are occupied in real time.</li>
              <li>• Simple booking flow powered by Google Forms + WhatsApp follow-up.</li>
              <li>• Public page for visitors showing your logo and website link once confirmed.</li>
            </ul>

            <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              Already have access?{" "}
              <Link
                href="/admin/login"
                className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline"
              >
                Open the admin dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Why participate */}
        <section id="why-participate" className="space-y-4">
          <h2 className="text-lg font-semibold">Why participate?</h2>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="font-medium mb-1">Brand visibility</p>
              <p className="text-slate-300 text-xs">
                Your logo is displayed on the exhibition map and booth card,
                with a direct link to your website or campaign page.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="font-medium mb-1">Quality visitors</p>
              <p className="text-slate-300 text-xs">
                Engage with professionals, entrepreneurs, and students attending
                TEDxBaghdad for inspiration and new ideas.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="font-medium mb-1">Simple logistics</p>
              <p className="text-slate-300 text-xs">
                All booth info is managed digitally; once confirmed, the booth
                status and company details are updated in real time.
              </p>
            </div>
          </div>
        </section>

        {/* Previous partners – placeholder */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Previous partners &amp; sponsors</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            This section can later be filled with real logos from previous
            years. For now we just keep it as placeholders so content can be
            dropped in quickly.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Partner A", "Partner B", "Partner C", "Partner D"].map((name) => (
              <div
                key={name}
                className="h-16 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center justify-center text-[11px] text-slate-300"
              >
                {name}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
