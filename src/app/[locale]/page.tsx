import About from "@/components/home/about/about";
import Advantages from "@/components/home/advantages/advantages";
import Contact from "@/components/home/contact-us/contact";
import Footer from "@/components/home/footer/footer";
import HeroSection from "@/components/home/hero/hero-section";
import NavBar from "@/components/home/nav-bar/navbar";
import Services from "@/components/home/services/services";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

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
  return (
    <section>
      <NavBar />
      <main className=" flex flex-col space-y-20">
        <div id="home">
          <HeroSection />
        </div>

        <div id="services">
          <Services />
        </div>

        <div className="w-[90%] mx-auto flex flex-col space-y-20">
          <div id="about">
            <Advantages />
            <About />
          </div>
          <div id="contact">
            <Contact />
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
}
