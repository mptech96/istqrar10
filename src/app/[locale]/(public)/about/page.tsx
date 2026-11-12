import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/home/shared/page-hero";
import AboutStorySection from "@/components/home/about/about-story-section";
import VisionGoalGrid from "@/components/home/about/vision-goal-grid";
import PillarsGrid from "@/components/home/about/pillars-grid";
import CertificationsSection from "@/components/home/about/certifications-section";
import CtaBanner from "@/components/home/shared/cta-banner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "" });

  return {
    title: t("about_seo_title"),
    description: t("about_seo_description"),
    openGraph: {
      title: t("about_seo_title"),
      description: t("about_seo_description"),
      locale,
      type: "website",
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations();

  return (
    <main className="flex flex-col space-y-12 pb-8">
      <PageHero
        badge={t("About Us")}
        title={t("Istqrar quality")}
        subtitle={t("about_page_subtitle")}
        breadcrumbs={[{ label: t("About") }]}
      />
      <AboutStorySection />
      <VisionGoalGrid />
      <PillarsGrid />
      <CertificationsSection />
      <CtaBanner
        title={t("about_cta_title")}
        description={t("about_cta_desc")}
        primaryLabel={t("Explore All Services")}
        primaryHref="/services"
        secondaryLabel={t("Contact Us")}
        secondaryHref="/contact"
      />
    </main>
  );
}
