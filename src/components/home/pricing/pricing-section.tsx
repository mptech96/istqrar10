"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import SectionHeader from "../section-header/section-header";
import PricingCard from "./pricing-card";
import SectionMoreLink from "../shared/section-more-link";

const PricingSection = () => {
  const t = useTranslations();

  const packages = [
    {
      title: t("plan_title"),
      features: [
        t("feature_1"),
        t("feature_2"),
        t("feature_3"),
        t("feature_4"),
        t("feature_5"),
        t("feature_6"),
      ],
      buttonText: t("Join Us"),
    },
    {
      title: t("plan_title"),
      isHighlighted: true,
      features: [
        t("feature_1_v2"),
        t("feature_2_v2"),
        t("feature_3_v2"),
        t("feature_5"),
        t("feature_4"),
        t("feature_6"),
      ],
      buttonText: t("Join Us"),
    },
    {
      title: t("plan_title"),
      features: [
        t("feature_1_v3"),
        t("feature_2_v3"),
        t("feature_3_v3"),
        t("feature_4_v3"),
        t("feature_5_v3"),
        t("feature_5"),
        t("feature_7"),
        t("feature_4"),
        t("feature_6"),
        t("feature_8"),
      ],
      buttonText: t("Join Us"),
    },
  ];

  return (
    <section
      id="Subscriptions"
      className="py-20 flex flex-col gap-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex justify-center"
      >
        <SectionHeader title={t("Packages")} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
        {packages.map((pkg, index) => (
          <PricingCard
            key={index}
            title={pkg.title}
            features={pkg.features}
            isHighlighted={pkg.isHighlighted}
            buttonText={pkg.buttonText}
          />
        ))}
      </div>

      <SectionMoreLink href="/subscriptions" label={t("Compare All Packages")} />
    </section>
  );
};

export default PricingSection;
