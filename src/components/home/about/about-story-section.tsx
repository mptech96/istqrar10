import Image from "next/image";
import { Building2, Calendar, MapPin, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AboutStorySection() {
  const t = await getTranslations();

  const highlights = [
    { icon: Calendar, label: t("Founded in 2025") },
    { icon: MapPin, label: t("Riyadh, Saudi Arabia") },
    { icon: Building2, label: t("Enterprise & SME Support") },
    { icon: ShieldCheck, label: t("Certified Standards") },
  ];

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Image Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-4/5 max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 dark:border-zinc-800">
            <Image
              src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773190541/groups_daj24s.jpg"
              alt="Istqrar Team"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          </div>
          <div className="hidden sm:block absolute -bottom-5 -end-3 w-36 h-36 bg-coralRed/15 rounded-3xl -z-10" />
        </div>

        {/* Story & Highlights */}
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-block text-sm font-bold uppercase tracking-wider text-coralRed">
            {t("about_story_title")}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold leading-snug">
            {t("history_title")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {t("about_story_extended")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs"
              >
                <div className="p-2.5 rounded-xl bg-coralRed/10 text-coralRed shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm md:text-base">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
