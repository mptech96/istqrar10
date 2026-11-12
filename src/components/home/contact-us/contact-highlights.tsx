import {
  Clock,
  Headphones,
  ClipboardCheck,
  PackageCheck,
  Timer,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import SectionHeader from "../section-header/section-header";

export default async function ContactHighlights() {
  const t = await getTranslations();

  const metaCards = [
    {
      icon: Clock,
      label: t("Working Hours"),
      value: t("working_hours_value"),
    },
    {
      icon: Timer,
      label: t("Response Time"),
      value: t("response_time_value"),
    },
  ];

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-8 space-y-14">
      {/* Meta Info Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metaCards.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs"
          >
            <div className="p-3.5 rounded-2xl bg-coralRed/10 text-coralRed shrink-0">
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="font-bold text-base md:text-lg mt-0.5">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
