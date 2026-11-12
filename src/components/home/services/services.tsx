"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import SectionHeader from "../section-header/section-header";
import ServiceCard from "./service-card";
import SectionMoreLink from "../shared/section-more-link";
import { 
  Monitor, 
  CalendarCheck, 
  Zap, 
  ShieldCheck, 
  GraduationCap, 
  FileText, 
  LayoutList, 
  Eye 
} from "lucide-react";

const Services = () => {
  const t = useTranslations();
  
  const services = [
    { title: t("service_1"), icon: Monitor },
    { title: t("service_2"), icon: CalendarCheck },
    { title: t("service_3"), icon: Zap },
    { title: t("service_4"), icon: ShieldCheck },
    { title: t("service_5"), icon: GraduationCap },
    { title: t("service_6"), icon: FileText },
    { title: t("service_7"), icon: LayoutList },
    { title: t("service_8"), icon: Eye },
  ];

  return (
    <section className="py-20 flex flex-col gap-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex justify-center"
      >
        <SectionHeader title={t("Our Services")} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 max-w-7xl mx-auto px-6">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            index={index}
            title={service.title}
            icon={service.icon}
          />
        ))}
      </div>

      <SectionMoreLink href="/services" label={t("Explore All Services")} />
    </section>
  );
};

export default Services;
