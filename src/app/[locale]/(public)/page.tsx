import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import HomeContent from "@/components/home/home-content/home-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "",
  });

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: [
      "Istqrar",
      "Quality Control",
      "Food Safety",
      "Inspection Solutions",
      "استقرار",
      "مراقبة الجودة",
      "سلامة الغذاء",
      "حلول التفتيش",
    ],
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
    },
  };
}

export default function Home() {
  return <HomeContent />;
}
