import { getTranslations } from "next-intl/server";
import SectionHeader from "../section-header/section-header";
import { WORKFLOW_STEPS } from "@/data/marketing";

export default async function ServiceWorkflowSection() {
  const t = await getTranslations();

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-12 space-y-12">
      <SectionHeader
        title={t("workflow_title")}
        subtitle={t("workflow_subtitle")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {WORKFLOW_STEPS.map((step) => (
          <div
            key={step.id}
            className="relative p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs space-y-4"
          >
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-coralRed/10 text-coralRed font-black text-lg">
              {step.id}
            </div>
            <h3 className="text-lg font-bold">{t(step.titleKey)}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(step.descKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
