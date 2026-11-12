import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SectionHeader from "../section-header/section-header";
import { CERTIFICATIONS_DATA } from "@/data/marketing";

export default async function CertificationsSection() {
  const t = await getTranslations();

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-12 space-y-12">
      <SectionHeader
        title={t("certifications_title")}
        subtitle={t("certifications_subtitle")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CERTIFICATIONS_DATA.map((cert) => (
          <div
            key={cert.id}
            className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs flex flex-col items-center text-center gap-5 hover:shadow-lg transition-shadow"
          >
            <div className="w-24 h-24 rounded-2xl bg-zinc-50 dark:bg-white p-3 relative flex items-center justify-center border border-zinc-100">
              <Image
                src={cert.imageUrl}
                alt={cert.alt}
                fill
                className="object-contain p-2"
              />
            </div>
            <h3 className="text-xl font-bold">{t(cert.titleKey)}</h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {t(cert.descKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
