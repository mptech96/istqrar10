import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Users } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { SERVICES_DATA, type ServiceItem } from "@/data/marketing";
import { ServiceIcon } from "../shared/service-icon";

export default async function ServiceDetailView({
  service,
}: {
  service: ServiceItem;
}) {
  const t = await getTranslations();
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const related = SERVICES_DATA.filter((s) => s.slug !== service.slug).slice(
    0,
    3,
  );

  return (
    <section className="w-[90%] max-w-6xl mx-auto py-8 space-y-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Details */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 md:p-10 shadow-xs space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rotate-45 rounded-2xl bg-coralRed flex items-center justify-center shadow-lg shadow-coralRed/20 shrink-0">
              <div className="-rotate-45 text-white">
                <ServiceIcon iconKey={service.iconKey} className="w-6 h-6" />
              </div>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-coralRed">
                {t("Service Details")} · {service.id}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-1">
                {t(service.titleKey)}
              </h2>
            </div>
          </div>

          <p className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {t(service.descKey)}
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("Key Deliverables")}</h3>
            <div className="grid grid-cols-1 gap-3">
              {service.deliverableKeys.map((delKey) => (
                <div
                  key={delKey}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                >
                  <CheckCircle2 className="w-5 h-5 text-coralRed shrink-0 mt-0.5" />
                  <span className="font-medium text-sm md:text-base">
                    {t(delKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Target Audience & Actions */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-coralRed/5 border border-coralRed/20 p-7 space-y-4">
            <div className="flex items-center gap-3 text-coralRed font-bold">
              <Users className="w-5 h-5" />
              <h3>{t("Who It Is For")}</h3>
            </div>
            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {t(service.audienceKey)}
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-7 space-y-4 shadow-xs">
            <Link
              href="/contact"
              className="w-full py-3.5 px-5 rounded-xl bg-linear-to-r from-coralRed to-darkRed text-white font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <span>{t("Request This Service")}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/subscriptions"
              className="w-full py-3.5 px-5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-semibold flex items-center justify-center gap-2 hover:border-coralRed hover:text-coralRed transition-colors"
            >
              {t("Compare All Packages")}
            </Link>
            <Link
              href="/services"
              className="w-full pt-2 text-sm text-muted-foreground hover:text-coralRed flex items-center justify-center gap-1.5 transition-colors"
            >
              <BackIcon className="w-4 h-4" />
              <span>{t("Back to Services")}</span>
            </Link>
          </div>
        </aside>
      </div>

      {/* Other Services */}
      <div className="space-y-6 pt-4">
        <h3 className="text-xl font-bold">{t("Other Services")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/services/${item.slug}`}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-coralRed/40 hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="p-2.5 rounded-xl bg-coralRed/10 text-coralRed shrink-0">
                <ServiceIcon iconKey={item.iconKey} className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm md:text-base">
                  {t(item.titleKey)}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {t(item.descKey)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
