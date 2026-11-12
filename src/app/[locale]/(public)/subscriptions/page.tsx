import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/home/shared/page-hero";
import PackagesShowcase from "@/components/home/pricing/packages-showcase";
import PackagesComparisonTable from "@/components/home/pricing/packages-comparison-table";
import SubscriptionFaqSection from "@/components/home/pricing/subscription-faq-section";
import CtaBanner from "@/components/home/shared/cta-banner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "" });

  return {
    title: t("subscriptions_seo_title"),
    description: t("subscriptions_seo_description"),
    openGraph: {
      title: t("subscriptions_seo_title"),
      description: t("subscriptions_seo_description"),
      locale,
      type: "website",
    },
  };
}

export default async function SubscriptionsPage() {
  const t = await getTranslations();

  return (
    <main className="flex flex-col space-y-12 pb-8">
      <PageHero
        badge={t("Packages")}
        title={t("Subscriptions")}
        subtitle={t("subscriptions_page_subtitle")}
        breadcrumbs={[{ label: t("Subscriptions") }]}
      />
      <PackagesShowcase />
      <PackagesComparisonTable />
      <SubscriptionFaqSection />
      <CtaBanner
        title={t("about_cta_title")}
        description={t("about_cta_desc")}
        primaryLabel={t("Contact Us")}
        primaryHref="/contact"
        secondaryLabel={t("Explore All Services")}
        secondaryHref="/services"
      />
    </main>
  );
}
