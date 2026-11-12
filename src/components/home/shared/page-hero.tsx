import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default async function PageHero({
  badge,
  title,
  subtitle,
  breadcrumbs,
}: PageHeroProps) {
  const t = await getTranslations();
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const CrumbSeparator = isRTL ? ChevronLeft : ChevronRight;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <section className="relative min-h-dvh w-full flex flex-col items-center justify-center pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-[#fdf8f7] dark:bg-[#090304] text-[#2a0b10] dark:text-[#fff6f2] select-none transition-colors duration-300">
      {/* 1. Ambient Spotlights, Architectural Grid & Subtle Specks */}
      <div className="pointer-events-none absolute inset-0">
        {/* Top-left & Top-right Corner Spotlights */}
        <div className="absolute -top-28 -left-28 w-[560px] h-[480px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(235,55,79,0.22)_0%,rgba(244,162,140,0.14)_45%,transparent_72%)] dark:bg-[radial-gradient(circle_at_30%_30%,rgba(195,28,44,0.62)_0%,rgba(130,14,26,0.28)_45%,transparent_72%)] blur-2xl" />
        <div className="absolute -top-28 -right-28 w-[560px] h-[480px] rounded-full bg-[radial-gradient(circle_at_70%_30%,rgba(235,55,79,0.22)_0%,rgba(244,162,140,0.14)_45%,transparent_72%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(195,28,44,0.62)_0%,rgba(130,14,26,0.28)_45%,transparent_72%)] blur-2xl" />

        {/* Central Warm Glow Behind Badge & Headline */}
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[380px] bg-[radial-gradient(ellipse_at_center,rgba(235,55,79,0.10)_0%,rgba(245,158,11,0.06)_50%,transparent_75%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(190,32,48,0.28)_0%,rgba(115,14,26,0.12)_50%,transparent_75%)] blur-3xl" />

        {/* Square Architectural Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(188,31,52,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(188,31,52,0.10)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(215,75,75,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(215,75,75,0.16)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_88%_75%_at_50%_38%,#000_32%,transparent_100%)]" />

        {/* Subtle Shimmer Specks */}
        <div className="absolute inset-0 opacity-40 dark:opacity-45 bg-[radial-gradient(rgba(217,119,6,0.38)_1px,transparent_1px),radial-gradient(rgba(235,55,79,0.45)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,215,195,0.5)_1px,transparent_1px),radial-gradient(rgba(235,55,79,0.55)_1px,transparent_1px)] bg-size-[110px_110px,175px_175px] bg-position-[18px_22px,65px_80px] mask-[radial-gradient(ellipse_78%_62%_at_50%_40%,#000_25%,transparent_100%)]" />

        {/* Bottom Hairline Border */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#bc1f34]/25 dark:via-[#e8a88b]/35 to-transparent" />
      </div>

      <div className="relative z-10 w-[90%] max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* 2. Frosted Glass Breadcrumb Pill */}
        {/*  <nav
          aria-label="Breadcrumb"
          className="inline-flex flex-wrap items-center justify-center gap-2.5 p-1.5 pe-5 mb-9 rounded-full bg-white/80 dark:bg-[#241617]/75 backdrop-blur-md border border-[#bc1f34]/15 dark:border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_rgba(188,31,52,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_28px_rgba(0,0,0,0.55)] text-xs sm:text-sm"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 text-zinc-600 hover:text-[#bc1f34] dark:text-[#b8a7a3] dark:hover:text-white transition-colors font-medium"
          >
            <span className="w-6 h-6 rounded-full bg-[#eb374f]/10 dark:bg-white/[0.08] border border-[#eb374f]/20 dark:border-white/12 flex items-center justify-center text-[#bc1f34] dark:text-[#d8c8c4] group-hover:bg-[#eb374f]/20 dark:group-hover:bg-white/15 dark:group-hover:text-white transition-colors">
              <BackArrow className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
            </span>
            <span>{t("Home")}</span>
          </Link>

          {breadcrumbs?.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2.5">
              <CrumbSeparator className="w-3.5 h-3.5 text-zinc-400 dark:text-[#9c8985]" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-zinc-600 hover:text-[#bc1f34] dark:text-[#b8a7a3] dark:hover:text-white transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#8f1626] dark:text-[#f3e5df] font-semibold">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav> */}

        {/* 3. Ultra-Luxury Pearl & Rose-Coral Jewel Badge (RTL & Arabic Safe) */}
        <div className="relative group mb-8">
          {/* Soft Ambient Coral Aura */}
          <div className="absolute -inset-2.5 rounded-full bg-linear-to-r from-[#eb374f]/15 via-[#f4a28c]/25 to-[#eb374f]/15 blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />

          {/* Outer Hairline Metallic Rose-Gold & Coral Rim */}
          <div className="relative p-[1px] rounded-full bg-linear-to-r from-[#e89984]/60 via-[#eb374f]/50 to-[#e89984]/60 shadow-[0_8px_28px_-4px_rgba(235,55,79,0.16),0_2px_6px_rgba(235,55,79,0.06)]">
            {/* Outer Glass Bezel */}
            <div className="p-[3px] rounded-full bg-white/70 dark:bg-[#1a0d10]/80 backdrop-blur-md">
              {/* Inner Silk-Pearl Capsule */}
              <div className="relative inline-flex items-center gap-3.5 px-5 py-1.5 rounded-full bg-linear-to-b from-white via-[#fff9f9] to-[#fdedef] dark:from-[#241216] dark:via-[#180b0e] dark:to-[#120709] border border-[#eb374f]/15 dark:border-[#f4a28c]/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] overflow-hidden">
                {/* Top & Bottom Specular Light Flares */}
                <div className="absolute top-0 inset-x-8 h-[1px] bg-linear-to-r from-transparent via-[#eb374f]/45 dark:via-[#ffd6cc]/80 to-transparent" />
                <div className="absolute bottom-0 inset-x-10 h-[1px] bg-linear-to-r from-transparent via-[#e89984]/40 to-transparent" />

                {/* Start Icon: Delicate Rose-Gold Star in a Micro-Medallion */}
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-linear-to-b from-[#fff0f2] to-[#fde2e5] dark:from-[#2e151a] dark:to-[#1c0b0e] border border-[#eb374f]/20 dark:border-[#f4a28c]/25 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#eb374f] dark:text-[#f4a28c] fill-[#eb374f]/25" />
                </span>

                {/* Badge Label — Wide tracking for English, zero tracking for Arabic */}
                <span className="px-1 text-[#9e192b] dark:text-[#ffe4e6] text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] rtl:tracking-normal rtl:text-sm rtl:sm:text-base rtl:font-bold">
                  {badge}
                </span>

                {/* End Icon: Subtle Glowing Coral Jewel Dot */}
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-linear-to-b from-[#fff0f2] to-[#fde2e5] dark:from-[#2e151a] dark:to-[#1c0b0e] border border-[#eb374f]/20 dark:border-[#f4a28c]/25 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#eb374f] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-linear-to-tr from-[#bc1f34] via-[#eb374f] to-[#ffb3bd] shadow-[0_0_6px_#eb374f]" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Metallic Headline */}
        <h1
          className={cn(
            "text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold tracking-tight max-w-4xl leading-[1.14] bg-clip-text text-transparent bg-linear-to-b from-[#1f090d] via-[#5c121c] to-[#bc1f34] dark:from-[#fffaf6] dark:via-[#f6d7cb] dark:to-[#d68c7d] drop-shadow-[0_4px_14px_rgba(188,31,52,0.12)] dark:drop-shadow-[0_6px_22px_rgba(0,0,0,0.85)] py-1",
            !isRTL && "font-serif",
          )}
        >
          {title}
        </h1>

        {/* 5. Subtitle */}
        <p className="mt-5 text-base sm:text-lg md:text-[1.1875rem] text-[#5e4649] dark:text-[#d8c7c4]/90 max-w-2xl leading-relaxed font-normal">
          &ldquo;{subtitle}&rdquo;
        </p>

        {/* 6. Art-Deco Geometric Diamond Lattice Divider */}
        <div
          className="mt-12 flex items-center justify-center w-full max-w-xl"
          aria-hidden="true"
        >
          {/* Left Double Hairline */}
          <div className="flex-1 flex flex-col gap-[5px]">
            <div className="h-px bg-linear-to-r from-transparent via-[#bc1f34]/45 to-[#eb374f]/80 dark:via-[#c96f6b]/55 dark:to-[#e49a89]/80" />
            <div className="h-px bg-linear-to-r from-transparent via-[#bc1f34]/25 to-[#eb374f]/55 dark:via-[#c96f6b]/35 dark:to-[#e49a89]/60" />
          </div>

          {/* Center Nested Diamond Motif */}
          <svg
            viewBox="0 0 148 56"
            className="w-36 h-14 mx-3 shrink-0 drop-shadow-[0_2px_10px_rgba(235,55,79,0.25)] dark:drop-shadow-[0_0_12px_rgba(235,55,79,0.45)]"
            fill="none"
          >
            {/* Left Side Diamonds */}
            <rect
              x="24"
              y="21"
              width="14"
              height="14"
              transform="rotate(45 31 28)"
              stroke="#c9424b"
              strokeWidth="1.2"
            />
            <rect
              x="36"
              y="17"
              width="22"
              height="22"
              transform="rotate(45 47 28)"
              stroke="#eb374f"
              strokeWidth="1.15"
            />
            <rect
              x="43"
              y="24"
              width="8"
              height="8"
              transform="rotate(45 47 28)"
              fill="#bc1f34"
              fillOpacity="0.65"
            />

            {/* Right Side Diamonds */}
            <rect
              x="110"
              y="21"
              width="14"
              height="14"
              transform="rotate(45 117 28)"
              stroke="#c9424b"
              strokeWidth="1.2"
            />
            <rect
              x="90"
              y="17"
              width="22"
              height="22"
              transform="rotate(45 101 28)"
              stroke="#eb374f"
              strokeWidth="1.15"
            />
            <rect
              x="97"
              y="24"
              width="8"
              height="8"
              transform="rotate(45 101 28)"
              fill="#bc1f34"
              fillOpacity="0.65"
            />

            {/* Center Layered Diamond */}
            <rect
              x="56"
              y="10"
              width="36"
              height="36"
              transform="rotate(45 74 28)"
              fill="currentColor"
              className="text-[#fdf8f7] dark:text-[#190609]"
              stroke="#eb374f"
              strokeWidth="1.4"
            />
            <rect
              x="61"
              y="15"
              width="26"
              height="26"
              transform="rotate(45 74 28)"
              stroke="#bc1f34"
              strokeWidth="1.2"
            />
            <rect
              x="66"
              y="20"
              width="16"
              height="16"
              transform="rotate(45 74 28)"
              fill="#eb374f"
              stroke="#f59e0b"
              strokeOpacity="0.65"
              strokeWidth="1"
            />
            <rect
              x="70.5"
              y="24.5"
              width="7"
              height="7"
              transform="rotate(45 74 28)"
              fill="#fde68a"
              fillOpacity="0.75"
            />
          </svg>

          {/* Right Double Hairline */}
          <div className="flex-1 flex flex-col gap-[5px]">
            <div className="h-px bg-linear-to-l from-transparent via-[#bc1f34]/45 to-[#eb374f]/80 dark:via-[#c96f6b]/55 dark:to-[#e49a89]/80" />
            <div className="h-px bg-linear-to-l from-transparent via-[#bc1f34]/25 to-[#eb374f]/55 dark:via-[#c96f6b]/35 dark:to-[#e49a89]/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
