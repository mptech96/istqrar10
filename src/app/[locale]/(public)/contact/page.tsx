import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/home/shared/page-hero";
import ContactHighlights from "@/components/home/contact-us/contact-highlights";
import Contact from "@/components/home/contact-us/contact";
import SectionHeader from "@/components/home/section-header/section-header";
import { ClipboardCheck, Headphones, PackageCheck } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "" });

  return {
    title: t("contact_seo_title"),
    description: t("contact_seo_description"),
    openGraph: {
      title: t("contact_seo_title"),
      description: t("contact_seo_description"),
      locale,
      type: "website",
    },
  };
}

export default async function ContactPage() {
  const t = await getTranslations();
  const departments = [
    {
      icon: ClipboardCheck,
      title: t("dept_audits_title"),
      description: t("dept_audits_desc"),
    },
    {
      icon: PackageCheck,
      title: t("dept_plans_title"),
      description: t("dept_plans_desc"),
    },
    {
      icon: Headphones,
      title: t("dept_support_title"),
      description: t("dept_support_desc"),
    },
  ];
  return (
    <main className="flex flex-col space-y-8 pb-8">
      <PageHero
        badge={t("Contact Us")}
        title={t("Contact us for any inquiries about quality control services")}
        subtitle={t("contact_page_subtitle")}
        breadcrumbs={[{ label: t("Contact") }]}
      />

      {/* How We Can Help */}
      <div className="space-y-10 w-[90%] max-w-7xl mx-auto">
        <SectionHeader title={t("How Can We Help")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departments.map((dept, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs space-y-4 hover:border-coralRed/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-coralRed/10 text-coralRed flex items-center justify-center">
                <dept.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">{dept.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {dept.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[90%] max-w-7xl mx-auto">
        <Contact />
      </div>
      <ContactHighlights />
    </main>
  );
}
