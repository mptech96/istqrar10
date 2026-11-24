import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/home/shared/page-hero";
import ServiceDetailView from "@/components/home/services/service-detail-view";
import { SERVICES_DATA } from "@/data/marketing";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SERVICES_DATA.map((service) => ({
      locale,
      slug: service.slug,
    })),
  );
}

export async function generateMetadata(props: {
  params?: Promise<{ locale?: string; slug?: string }>;
}): Promise<Metadata> {
  const resolvedParams = await props?.params;
  const locale = resolvedParams?.locale || "ar";
  const slug = resolvedParams?.slug || "";
  const service = SERVICES_DATA.find((item) => item.slug === slug);
  const t = await getTranslations({ locale, namespace: "" });

  if (!service) {
    return { title: t("services_seo_title") };
  }

  return {
    title: `${t(service.titleKey)} | ${t("Istqrar")}`,
    description: t(service.descKey),
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES_DATA.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  const t = await getTranslations();

  return (
    <main className="flex flex-col space-y-8 pb-12">
      <PageHero
        badge={t("Service Details")}
        title={t(service.titleKey)}
        subtitle={t(service.descKey)}
        breadcrumbs={[
          { label: t("Services"), href: "/services" },
          { label: t(service.titleKey) },
        ]}
      />
      <ServiceDetailView service={service} />
    </main>
  );
}
