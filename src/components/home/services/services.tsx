"use client";
import { useLocale, useTranslations } from "next-intl";
import SectionHeader from "../section-header/section-header";
import { motion } from "motion/react";
import {
  Box,
  ChartNoAxesCombined,
  HatGlasses,
  Map,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

const imageSrc = {
  ar: "https://res.cloudinary.com/doxyvufkz/image/upload/v1773015520/our_service-3-Arabic_zwru1d.png",
  en: "https://res.cloudinary.com/doxyvufkz/image/upload/v1773015616/Banner-3-English-_ds6jkx.png",
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const servicesData: { title: string; icon: any }[] = [
  {
    title: "Integrated quality department",
    icon: ShieldCheck,
  },
  {
    title: "4 visits per month",
    icon: HatGlasses,
  },
  {
    title: "Develop and improve operational plans",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Application of ISO systems",
    icon: Box,
  },
  {
    title: "HACCP (HASP) System Application",
    icon: Zap,
  },
  {
    title: "Immediate field training during the visit",
    icon: Wrench,
  },
  {
    title: "Detailed reports on each visit",
    icon: Map,
  },
];

const Services = () => {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <section className="min-h-[450px] flex flex-col   gap-20 ">
      <motion.div
        className="w-[90%] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader title={t("Our Services")} />
      </motion.div>
      <motion.div
        className="w-[90%] mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mt-10  ">
          <ol
            start={1}
            className="  grid grid-cols-1 md:grid-cols-2  h-2/3"
          >
            {servicesData.map((service, index) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.4,
                }}
                key={index}
                className="text-muted-foreground  py-2"
              >
                <p className="flex items-center gap-2">
                  {" "}
                  <span className="text-coralRed">
                    {" "}
                    <service.icon />
                  </span>{" "}
                  {t(service.title)}{" "}
                </p>
              </motion.div>
            ))}
          </ol>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-linear-to-br from-coralRed/5 to-cyan-500/5 border border-coralRed/10">
              <div className="flex items-center justify-center p-0">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={
                      imageSrc[
                        locale as keyof typeof imageSrc
                      ]
                    } // Use the appropriate image based on the locale
                    alt={t("Istqrar")}
                    className="h-full w-full rounded-md object-fill"
                    fill
                    loading="eager"
                  />
                </AspectRatio>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Services;
