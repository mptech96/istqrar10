import { Eye, Target } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function VisionGoalGrid() {
  const t = await getTranslations();

  const items = [
    {
      icon: Eye,
      title: t("vision_title"),
      description: t("vision_description"),
      accent: "from-coralRed/10 to-transparent border-coralRed/20",
    },
    {
      icon: Target,
      title: t("goal_title"),
      description: t("goal_description_text"),
      accent: "from-darkRed/10 to-transparent border-darkRed/20",
    },
  ];

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-8 md:p-10 bg-linear-to-br ${item.accent} border bg-white dark:bg-zinc-900 shadow-xs flex flex-col gap-5`}
          >
            <div className="w-12 h-12 rounded-2xl bg-coralRed text-white flex items-center justify-center shadow-md shadow-coralRed/20">
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-coralRed">{item.title}</h3>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base md:text-lg">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
