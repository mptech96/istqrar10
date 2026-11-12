import { getTranslations } from "next-intl/server";
import SectionHeader from "../section-header/section-header";
import { WHY_CHOOSE_US_DATA } from "@/data/marketing";

export default async function PillarsGrid() {
  const t = await getTranslations();

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-12 space-y-12">
      <SectionHeader
        title={t("Why Choose Us")}
        subtitle={t("about_pillars_subtitle")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WHY_CHOOSE_US_DATA.map((pillar) => (
          <div
            key={pillar.id}
            className="group p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs hover:shadow-xl hover:border-coralRed/30 transition-all duration-300 flex gap-6 items-start"
          >
            <span className="text-4xl font-black text-coralRed/25 group-hover:text-coralRed transition-colors shrink-0 leading-none">
              {pillar.id}
            </span>
            <div className="space-y-2.5">
              <h3 className="text-lg md:text-xl font-bold leading-snug">
                {t(pillar.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {t(pillar.detailKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
