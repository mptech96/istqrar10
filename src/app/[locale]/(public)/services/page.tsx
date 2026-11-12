import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/home/shared/page-hero";
import ServicesShowcaseGrid from "@/components/home/services/services-showcase-grid";
import ServiceWorkflowSection from "@/components/home/services/service-workflow-section";
import CtaBanner from "@/components/home/shared/cta-banner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "" });

  return {
    title: t("services_seo_title"),
    description: t("services_seo_description"),
    openGraph: {
      title: t("services_seo_title"),
      description: t("services_seo_description"),
      locale,
      type: "website",
    },
  };
}

export default async function ServicesPage() {
  const t = await getTranslations();

  return (
    <main className="flex flex-col space-y-12 pb-8">
      <PageHero
        badge={t("Our Services")}
        title={t("Permanent partner for food safety and quality")}
        subtitle={t("services_page_subtitle")}
        breadcrumbs={[{ label: t("Services") }]}
      />
      <ServicesShowcaseGrid />
      <ServiceWorkflowSection />
      <CtaBanner
        title={t("about_cta_title")}
        description={t("about_cta_desc")}
        primaryLabel={t("Compare All Packages")}
        primaryHref="/subscriptions"
        secondaryLabel={t("Contact Us")}
        secondaryHref="/contact"
      />
    </main>
  );
}
