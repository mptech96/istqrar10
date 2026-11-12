import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { SERVICES_DATA } from "@/data/marketing";
import { ServiceIcon } from "../shared/service-icon";

export default async function ServicesShowcaseGrid() {
  const t = await getTranslations();
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SERVICES_DATA.map((service) => (
          <article
            key={service.id}
            className="group relative rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 shadow-xs hover:shadow-xl hover:border-coralRed/30 transition-all duration-300 flex flex-col justify-between gap-6"
          >
            <div className="space-y-5">
              {/* Top Row: Diamond Icon + Number */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rotate-45 rounded-xl bg-coralRed flex items-center justify-center shadow-md shadow-coralRed/20 group-hover:scale-105 transition-transform">
                  <div className="-rotate-45 text-white">
                    <ServiceIcon iconKey={service.iconKey} className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-3xl font-black text-zinc-200 dark:text-zinc-800 group-hover:text-coralRed/30 transition-colors">
                  {service.id}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2.5">
                <h2 className="text-xl md:text-2xl font-bold leading-snug">
                  {t(service.titleKey)}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {t(service.descKey)}
                </p>
              </div>

              {/* Deliverables */}
              <div className="space-y-2.5 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-coralRed">
                  {t("Key Deliverables")}
                </p>
                <ul className="space-y-2">
                  {service.deliverableKeys.map((delKey) => (
                    <li
                      key={delKey}
                      className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-coralRed shrink-0 mt-0.5" />
                      <span>{t(delKey)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4">
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-coralRed hover:text-darkRed transition-colors"
              >
                <span>{t("View Full Details")}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("Request This Service")}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
