import { HelpCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import SectionHeader from "../section-header/section-header";
import { SUBSCRIPTION_FAQS } from "@/data/marketing";

export default async function SubscriptionFaqSection() {
  const t = await getTranslations();

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-12 space-y-10">
      <SectionHeader title={t("faq_title")} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SUBSCRIPTION_FAQS.map((faq, idx) => (
          <div
            key={idx}
            className="p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs space-y-3"
          >
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-coralRed shrink-0 mt-1" />
              <h3 className="font-bold text-base md:text-lg">{t(faq.qKey)}</h3>
            </div>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed ps-8">
              {t(faq.aKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
