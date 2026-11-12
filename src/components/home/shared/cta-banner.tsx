import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getLocale } from "next-intl/server";

interface CtaBannerProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default async function CtaBanner({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CtaBannerProps) {
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-8">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-coralRed to-darkRed p-8 md:p-12 text-white shadow-xl shadow-coralRed/15">
        <div className="absolute -end-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold leading-snug">
              {title}
            </h2>
            <p className="text-white/85 text-base md:text-lg leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href={primaryHref}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-coralRed font-bold hover:bg-zinc-100 transition-colors shadow-md"
            >
              {primaryLabel}
              <ArrowIcon className="w-4 h-4" />
            </Link>
            {secondaryLabel && secondaryHref && (
              <Link
                href={secondaryHref}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-black/25 text-white font-semibold border border-white/25 hover:bg-black/40 transition-colors"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
