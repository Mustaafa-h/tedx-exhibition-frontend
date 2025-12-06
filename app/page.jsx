"use client";

import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";
import hero from "../public/tedx/hero.jpg"

export default function HomePage() {
  const { isArabic, toggleLang } = useLanguage();
  const isAr = isArabic;

  return (
    <main className="min-h-screen bg-black text-slate-50">
      {/* Top background glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-red-500/25 via-transparent to-transparent" />

      {/* Hero + navbar */}
      <div className="relative min-h-screen overflow-hidden bg-black">
        {/* Hero background image */}
        {/* Hero + navbar */}
        {/* Hero + navbar */}
        <div
          className="relative min-h-screen overflow-hidden bg-black"
          style={{
            backgroundImage: "url('/tedx/hero.jpg')", // use .png if that's your file
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/70" />

          {/* Subtle background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-red-500/25 blur-3xl" />
            <div className="absolute bottom-[-8rem] left-1/4 h-72 w-72 rounded-full bg-orange-500/25 blur-3xl" />
          </div>

          {/* Navbar */}
          <header className="relative z-20 border-b border-white/5 bg-black/70 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
              {/* Logo placeholder */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1 text-lg font-semibold tracking-tight">
                    <span className="text-white">TEDx</span>
                    <span className="text-red-500">Baghdad</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    {isAr ? "معرض 2025" : "Exhibition 2025"}
                  </span>
                </div>
              </div>

              {/* Nav actions */}
              <nav className="flex items-center gap-3 text-xs md:text-sm">
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
                  {isAr ? "ادمن" : "Admin"}
                </Link>

                {/* EN / AR toggle (uses LanguageProvider) */}
                <button
                  type="button"
                  onClick={toggleLang}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] hover:bg-white/10"
                >
                  <span
                    className={
                      isAr
                        ? "text-slate-400"
                        : "font-semibold text-slate-50"
                    }
                  >
                    EN
                  </span>
                  <span className="text-slate-400">/</span>
                  <span
                    className={
                      isAr
                        ? "font-semibold text-slate-50"
                        : "text-slate-400"
                    }
                  >
                    AR
                  </span>
                </button>
              </nav>
            </div>
          </header>

          {/* Hero section */}
          <section className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center">
            <div
              className={
                "mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 text-center " +
                (isAr ? "md:items-end md:text-right" : "md:items-start md:text-left")
              }
            >
              <div className="max-w-3xl space-y-6">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                  {isAr
                    ? "TEDxBaghdad | المؤتمر السنوي الخامس عشر"
                    : "TEDxBaghdad | 15th Annual Exhibition"}
                </p>

                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-red-500 drop-shadow-[0_0_22px_rgba(248,113,113,0.85)] sm:text-4xl md:text-5xl">
                  {isAr ? "ACTIONS   BEHIND   WORDS" : "ACTIONS   BEHIND   WORDS"}
                </h1>

                <div className="space-y-2 text-sm text-slate-200">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs sm:text-sm">
                    <span className="text-base">📅</span>
                    <span>
                      {isAr
                        ? "السبت، 13 ديسمبر  2025، الساعة 11:00 صباحاً"
                        : "Saturday, December 13, 2025, 11:00 AM"}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-base">📍</span>
                    <span>
                      {isAr ? "قرية دجلة، بغداد" : "Dijlah Village, Baghdad"}
                    </span>
                  </div>
                </div>

                <p className="max-w-xl text-xs text-slate-300 sm:text-sm">
                  {isAr
                    ? "مساحة معرض مخصصة تلتقي فيها العلامات التجارية والشركات الناشئة والشركاء مع جمهور TEDx المتحمّس. احجز منصتك وكن جزءاً من تجربة تحوّل الأفكار إلى أفعال."
                    : "A dedicated exhibition space where brands, startups, and partners meet a highly engaged TEDx audience. Reserve your booth and be part of the experience that turns ideas into action."}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  <Link
                    href="/booths"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_18px_45px_rgba(220,38,38,0.65)] transition hover:bg-red-500"
                  >
                    {isAr ? "احجز جناحك الآن" : "Book Booth Now"}
                  </Link>

                  <a
                    href="#why-participate"
                    className="text-xs font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
                  >
                    {isAr
                      ? "تعرّف أكثر على تفاصيل المعرض"
                      : "Learn more about the exhibition"}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Content sections below hero */}
      <div className="mx-auto max-w-6xl px-4 py-16 space-y-16">
        {/* Stats section */}
        <section id="stats" className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className={isAr ? "sm:text-right" : ""}>
              <h2 className="text-lg font-semibold">
                {isAr ? "TEDxBaghdad بالأرقام" : "TEDxBaghdad in numbers"}
              </h2>
              <p className="text-xs text-slate-300">
                {isAr
                  ? "لمحة سريعة عن المجتمع الذي يجتمع حول الأفكار الجديرة بالانتشار في بغداد."
                  : "A snapshot of the community that gathers around ideas worth spreading in Baghdad."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Guests */}
            <article className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-lg shadow-black/40">
              <div className="flex items-center justify-between text-[11px]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20 text-base">
                  👥
                </span>
                <span className="uppercase tracking-[0.18em] text-red-400">
                  {isAr ? "الضيوف" : "Guests"}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-50">15k+</p>
              <p className="text-xs text-slate-300">
                {isAr
                  ? "ضيوف مسجّلون عبر نسخ مختلفة من TEDxBaghdad."
                  : "Registered guests across different TEDxBaghdad editions."}
              </p>
            </article>

            {/* Attendees */}
            <article className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-lg shadow-black/40">
              <div className="flex items-center justify-between text-[11px]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20 text-base">
                  🎫
                </span>
                <span className="uppercase tracking-[0.18em] text-red-400">
                  {isAr ? "الحضور" : "Attendees"}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-50">1k+</p>
              <p className="text-xs text-slate-300">
                {isAr
                  ? "حضور فعلي يتفاعلون مع الأحاديث والمنصات والتجارب المختلفة."
                  : "On-site attendees engaging with talks, booths, and experiences."}
              </p>
            </article>

            {/* Volunteers */}
            <article className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-lg shadow-black/40">
              <div className="flex items-center justify-between text-[11px]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20 text-base">
                  ❤️
                </span>
                <span className="uppercase tracking-[0.18em] text-red-400">
                  {isAr ? "المتطوعون" : "Volunteers"}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-50">8.8k+</p>
              <p className="text-xs text-slate-300">
                {isAr
                  ? "آلاف المتطوعين الذين يساهمون في صناعة تجربة TEDxBaghdad."
                  : "Registered volunteers who help bring the TEDxBaghdad experience to life."}
              </p>
            </article>

            {/* Gender split */}
            <article className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-lg shadow-black/40">
              <div className="flex items-center justify-between text-[11px]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20 text-base">
                  📊
                </span>
                <span className="uppercase tracking-[0.18em] text-red-400">
                  {isAr ? "توزيع الحضور" : "Gender split"}
                </span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                {isAr ? "نسبة تقريبية للجمهور" : "Approximate audience mix"}
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[40%] bg-red-500" />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-300">
                <span>{isAr ? "40٪ ذكور" : "40% male"}</span>
                <span>{isAr ? "60٪ إناث" : "60% female"}</span>
              </div>
            </article>
          </div>
        </section>

        {/* Exhibition at a glance */}
        <section className="grid items-start gap-6 md:grid-cols-[2fr,3fr]">
          <div
            className={
              "rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-black/40 " +
              (isAr ? "md:text-right" : "")
            }
          >
            <h2 className="mb-1 text-sm font-semibold">
              {isAr ? "لمحة عن المعرض" : "Exhibition at a glance"}
            </h2>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                {isAr
                  ? "• خريطة رقمية واضحة لجميع المنصات (دايموند / غولد / سيلفر)."
                  : "• Clear digital map of all booths (Diamond / Gold / Silver)."}
              </li>
              <li>
                {isAr
                  ? "• تحديثات حالة مباشرة لمعرفة المنصات المحجوزة والمتاحة."
                  : "• Live status updates – see which spaces are occupied in real time."}
              </li>
              <li>
                {isAr
                  ? "• مسار حجز بسيط عبر Google Forms مع متابعة عبر الواتساب."
                  : "• Simple booking flow powered by Google Forms + WhatsApp follow-up."}
              </li>
              <li>
                {isAr
                  ? "• صفحة عامة للزوّار تعرض شعارك ورابط موقعك بعد تأكيد الحجز."
                  : "• Public page for visitors showing your logo and website link once confirmed."}
              </li>
            </ul>

            <div className="mt-4 border-t border-slate-800 pt-3 text-[11px] text-slate-400">
              {isAr ? "عندك صلاحيات مسبقاً؟ " : "Already have access? "}
              <Link
                href="/admin/login"
                className="text-red-300 underline-offset-2 hover:text-red-200 hover:underline"
              >
                {isAr ? "افتح لوحة الإدارة" : "Open the admin dashboard"}
              </Link>
            </div>
          </div>

          {/* Placeholder visual card */}
          <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-black to-slate-950 shadow-lg shadow-black/40">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.25),transparent_60%),radial-gradient(circle_at_bottom,_rgba(248,113,113,0.15),transparent_55%)]" />
            <p className="relative z-10 text-xs uppercase tracking-[0.2em] text-slate-300">
              {isAr ? "معاينة خريطة المنصات" : "BOOTH MAP PREVIEW"}
            </p>
          </div>
        </section>

        {/* مزايا المشاركة */}
        <section id="advantages" className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className={isAr ? "sm:text-right" : ""}>
              <h2 className="text-lg font-semibold text-slate-50">
                {isAr ? "مزايا المشاركة" : "Participation advantages"}
              </h2>
              <p className="text-[11px] text-slate-300">
                {isAr
                  ? "أهم الفوائد للعلامات التجارية والشركات الناشئة المشاركة في المعرض."
                  : "Key advantages for brands and startups participating in the exhibition."}
              </p>
            </div>
          </div>

          <div className={"grid gap-4 sm:grid-cols-2 lg:grid-cols-4"}>
            {/* Card 1 */}
            <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-black/40">
              <div className="relative h-28 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/tedx/card1.jpg"
                  alt="Direct interaction with visitors at an exhibition booth"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="text-sm font-semibold text-slate-50">تفاعل مباشر مع الجمهور</p>
                <p className="text-[11px] text-slate-300">
                  تحدث مع حضور مهتمين بالأفكار الجديدة والمنتجات المختلفة وجهاً لوجه.
                </p>
              </div>
            </article>


            {/* Card 2 */}
            {/* Card 2 */}
            <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-black/40">
              <div className="relative h-28 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/tedx/card2.jpg"
                  alt="Premium exhibition booth space"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="text-sm font-semibold text-slate-50">مساحة مميزة لعرض خدماتك</p>
                <p className="text-[11px] text-slate-300">
                  منصتك تصبح جزءاً من تجربة TEDxBaghdad البصرية والقصصية.
                </p>
              </div>
            </article>


            {/* Card 3 */}
            {/* Card 3 */}
            <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-black/40">
              <div className="relative h-28 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/tedx/card3.jpg"
                  alt="Networking and partnership opportunities"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="text-sm font-semibold text-slate-50">فرص شراكات جديدة</p>
                <p className="text-[11px] text-slate-300">
                  التقي بشركات، مبادرات، ومؤسسات إعلامية يمكن أن تصبح شركاءك المقبلين.
                </p>
              </div>
            </article>


            {/* Card 4 */}
            {/* Card 4 */}
            <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-black/40">
              <div className="relative h-28 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/tedx/card4.jpg"
                  alt="Media and social coverage at the event"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="text-sm font-semibold text-slate-50">حضور إعلامي أقوى</p>
                <p className="text-[11px] text-slate-300">
                  استفد من تغطية السوشال ميديا وصور وفيديوهات الحدث لرفع حضور علامتك التجارية.
                </p>
              </div>
            </article>

          </div>
        </section>

        {/* Why participate */}
        <section id="why-participate" className="space-y-4">
          <h2 className="text-lg font-semibold">
            {isAr ? "لماذا تشارك في المعرض؟" : "Why participate?"}
          </h2>
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="mb-1 font-medium">
                {isAr ? "حضور بصري قوي" : "Brand visibility"}
              </p>
              <p className="text-xs text-slate-300">
                {isAr
                  ? "يظهر شعارك على خريطة المعرض وفي بطاقة المنصة ليتمكن الحضور من العثور عليك وتذكّر علامتك بسهولة."
                  : "Your logo is displayed on the exhibition map and booth card, so attendees can easily find and remember you."}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="mb-1 font-medium">
                {isAr ? "جمهور عالي التفاعل" : "High-intent audience"}
              </p>
              <p className="text-xs text-slate-300">
                {isAr
                  ? "تصل إلى روّاد أعمال وطلاب ومهنيين يبحثون عن أفكار ومشاريع جديدة ليدعموها."
                  : "Reach entrepreneurs, students, and professionals who are already invested in new ideas and projects."}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="mb-1 font-medium">
                {isAr ? "حجز بسيط وشفّاف" : "Simple, transparent booking"}
              </p>
              <p className="text-xs text-slate-300">
                {isAr
                  ? "استعرض خريطة المنصات المحدثة، واختر منصة فارغة، وأرسل طلب الحجز بخطوات قليلة وواضحة."
                  : "Browse the live booth map, pick an empty space, and submit your booking request in a few clicks."}
              </p>
            </div>
          </div>
        </section>

        {/* Previous partners carousel */}
        <section id="partners" className="space-y-4">
          <h2 className="text-lg font-semibold">
            {isAr ? "الرعاة والشركاء السابقون" : "Previous partners & sponsors"}
          </h2>
          <p className="text-xs text-slate-300">
            {isAr
              ? "الشعارات في الأسفل هي أماكن مخصصة سيتم استبدالها بشعارات الرعاة والشركاء الحقيقيين لفعاليات TEDxBaghdad السابقة."
              : "Logos below are placeholders – they will be replaced with real partners who supported TEDxBaghdad in previous years."}
          </p>

          <div className="space-y-3">
            {[0, 1, 2].map((rowIndex) => (
              <div
                key={rowIndex}
                className="marquee-row rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2"
              >
                <div className={`marquee-track ${rowIndex === 1 ? "reverse" : ""}`}>
                  {["Brand One", "Brand Two", "Brand Three", "Brand Four", "Brand Five", "Brand Six"].map(
                    (name, idx) => (
                      <div
                        key={`${rowIndex}-${idx}`}
                        className="flex h-12 w-32 items-center justify-center rounded-xl border border-slate-700 bg-black/40 text-[11px] text-slate-200"
                      >
                        {name}
                      </div>
                    )
                  )}

                  {/* duplicate set to make the loop seamless */}
                  {["Brand One", "Brand Two", "Brand Three", "Brand Four", "Brand Five", "Brand Six"].map(
                    (name, idx) => (
                      <div
                        key={`${rowIndex}-dup-${idx}`}
                        className="flex h-12 w-32 items-center justify-center rounded-xl border border-slate-800 bg-black/30 text-[11px] text-slate-500"
                      >
                        {name}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pioneer Package / باقة الريادة */}
        <section id="pioneer-package" className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className={isAr ? "sm:text-right" : ""}>
              <h2 className="text-lg font-semibold text-slate-50">
                {isAr ? "باقة الريادة" : "Pioneer Package"}
              </h2>
              <p className="text-[11px] text-slate-300">
                {isAr
                  ? "باقة مميزة للعلامات التجارية التي ترغب بأقصى حضور بصري في المعرض."
                  : "A flagship package designed for brands who want maximum visibility at the exhibition."}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-red-500/40 bg-gradient-to-br from-red-600/25 via-slate-950 to-black p-[1px] shadow-[0_0_40px_rgba(248,113,113,0.3)]">
            <div className="flex flex-col gap-6 rounded-[22px] bg-black/70 px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-8 sm:py-6">
              <div className="space-y-2">
                <p className="inline-flex items-center gap-2 rounded-full bg-red-600/15 px-3 py-1 text-[11px] font-medium text-red-200">
                  {isAr ? "Pioneer Package" : "Pioneer Package"}
                  <span className="text-[9px] text-red-300/80">
                    {isAr ? "عدد محدود" : "Limited availability"}
                  </span>
                </p>
                <h3 className="text-xl font-semibold text-slate-50">
                  {isAr ? "باقة الريادة" : "Pioneer Package / باقة الريادة"}
                </h3>
                <p className="text-xs text-slate-300">
                  {isAr
                    ? "مناسبة للبنوك وشركات الاتصالات والجامعات والعلامات الكبرى التي ترغب بأن تكون في قلب تجربة المعرض."
                    : "Ideal for banks, telecoms, universities, and major brands who want to anchor the exhibition experience."}
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    {isAr ? "ابتداءً من" : "Starting from"}
                  </p>
                  <p className="text-2xl font-bold text-red-400">$5,000</p>
                </div>
                <Link
                  href="/booths"
                  className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-2 text-xs font-semibold tracking-wide text-white shadow-[0_14px_32px_rgba(220,38,38,0.6)] hover:bg-red-500"
                >
                  {isAr ? "اطلب باقة الريادة" : "Request Pioneer Package"}
                </Link>
              </div>
            </div>

            <div className="border-t border-red-500/20 bg-black/60 px-6 py-4 sm:px-8">
              <ul className="grid gap-2 text-[11px] text-slate-200 sm:grid-cols-2">
                <li>
                  {isAr
                    ? "• موقع مميز للمنصة في منطقة عالية الحركة."
                    : "• Premium booth location in a high-traffic area."}
                </li>
                <li>
                  {isAr
                    ? "• إبراز شعارك في خريطة المعرض والتواصلات الرسمية."
                    : "• Highlighted logo placement on exhibition map and communications."}
                </li>
                <li>
                  {isAr
                    ? "• ذكر خاص عبر قنوات TEDxBaghdad على السوشال ميديا."
                    : "• Social media mention from TEDxBaghdad channels."}
                </li>
                <li>
                  {isAr
                    ? "• بطاقات إضافية لفريقك أو لضيوف VIP."
                    : "• Extra passes for your team or VIP guests."}
                </li>
                <li>
                  {isAr
                    ? "• إمكانية تفعيل تجربة براندية بالقرب من منصتك."
                    : "• Possibility to activate a branded experience near your booth."}
                </li>
                <li>
                  {isAr
                    ? "• نقطة اتصال مخصصة من فريق التنظيم."
                    : "• Dedicated point of contact from the organizing team."}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Book your booth CTA strip */}
        <section className="overflow-hidden rounded-3xl border border-red-500/40 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-[1px]">
          <div className="flex flex-col items-center justify-between gap-4 rounded-[22px] bg-black/80 px-6 py-4 text-center sm:flex-row sm:text-left">
            <div className={isAr ? "sm:text-right" : ""}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-200">
                {isAr ? "جاهز تنضم إلينا؟" : "Ready to join us?"}
              </p>
              <p className="text-sm font-medium text-slate-50">
                {isAr
                  ? "جاهز تشارك معنا وتعرض مشروعك أو خدمتك لجمهور TEDxBaghdad؟"
                  : "Ready to showcase your project or service to the TEDxBaghdad audience?"}
              </p>
            </div>
            <Link
              href="/booths"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-xs font-semibold tracking-wide text-red-600 shadow-[0_14px_36px_rgba(0,0,0,0.45)] hover:bg-slate-100"
            >
              {isAr ? "احجز منصتك" : "Book your booth"}
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-black/95">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-xs text-slate-300 sm:flex-row sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-baseline gap-1 text-sm font-semibold">
              <span className="text-white">TEDx</span>
              <span className="text-red-500">Baghdad</span>
            </div>
            <p className="max-w-xs text-[11px] text-slate-400">
              {isAr
                ? "هذا الموقع هو واجهة معرض TEDxBaghdad 2025، لمساعدة الشركاء والزوّار على استكشاف المنصات بسهولة."
                : "This exhibition interface is a companion to TEDxBaghdad 2025, helping partners and visitors navigate the booth experience."}
            </p>
          </div>

          <div className="flex gap-8">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-slate-200">
                {isAr ? "روابط" : "Links"}
              </p>
              <ul className="space-y-1 text-[11px]">
                <li>
                  <Link href="/" className="hover:text-white">
                    {isAr ? "الرئيسية" : "Home"}
                  </Link>
                </li>
                <li>
                  <Link href="/booths" className="hover:text-white">
                    {isAr ? "خريطة المعرض" : "Exhibition map"}
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="hover:text-white">
                    {isAr ? "لوحة الإدارة" : "Admin"}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-slate-200">
                {isAr ? "تواصل معنا" : "Contact"}
              </p>
              <p className="text-[11px] text-slate-400">
                {isAr ? "البريد الإلكتروني: " : "Email: "}
                <a href="mailto:info@tedxbaghdad.com" className="hover:text-white">
                  info@tedxbaghdad.com
                </a>
                <br />
                {isAr ? "الهاتف: +964 000 000 0000" : "Phone: +964 000 000 0000"}
              </p>
              <div className="mt-2 flex gap-3 text-[13px]">
                <a href="#" className="hover:text-white">
                  FB
                </a>
                <a href="#" className="hover:text-white">
                  IG
                </a>
                <a href="#" className="hover:text-white">
                  YT
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
