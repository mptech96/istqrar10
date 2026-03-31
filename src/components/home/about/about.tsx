"use client";
import React from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import SectionHeader from "../section-header/section-header";

interface AboutProps {
  aboutRef: React.RefObject<HTMLElement | null>;
  aboutImageRef: React.RefObject<HTMLDivElement | null>;
  isTransitioning: boolean;
  isTransitionComplete: boolean;
}

const About = ({
  aboutRef,
  aboutImageRef,
  isTransitioning,
  isTransitionComplete,
}: AboutProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const whyChooseUsItems = [
    {
      id: "01",
      title: t(
        "Full support for small, medium and large enterprises",
      ),
    },
    {
      id: "02",
      title: t(
        "Improving compliance with food quality and safety regulations",
      ),
    },
    {
      id: "03",
      title: t("Building and developing operational plans"),
    },
    {
      id: "04",
      title: t("Real field experience"),
    },
  ];

  return (
    <section
      ref={aboutRef}
      className="py-12 flex flex-col gap-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeader title={t("About Us")} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mx-auto">
        {/* Left Column: History, Vision, Goal */}
        <div className="flex flex-col gap-10 order-1 px-4 lg:px-0">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg">
              {t("history_title")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col gap-3"
          >
            <h3 className="text-coralRed text-xl font-bold">
              {t("vision_title")}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t("vision_description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col gap-3"
          >
            <h3 className="text-coralRed text-xl font-bold">
              {t("goal_title")}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t("goal_description_text")}
            </p>
          </motion.div>
        </div>

        {/* Middle Column: Diamond Image Layered Effect */}
        <div className="flex justify-center order-2 px-12 py-14">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            {/* Background Layer (Red Diamond Offset) */}
            <motion.div
              initial={{
                opacity: 0,
                x: isRTL ? -40 : 40,
                y: 40,
                rotate: 45,
              }}
              whileInView={{
                opacity: 1,
                x: isRTL ? -30 : 0,
                y: -45,
                rotate: 45,
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute hidden lg:block inset-4 bg-coralRed rounded-[40px] z-0 shadow-lg"
            />

            {/* Main Image Layer (Top Diamond) - with ref for position tracking */}
            <motion.div
              ref={
                aboutImageRef as React.RefObject<HTMLDivElement>
              }
              initial={{
                opacity: 0,
                scale: 0.9,
                rotate: 45,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: 45,
              }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="overflow-hidden rounded-[40px] shadow-2xl bg-white dark:bg-zinc-950"
              style={{
                zIndex: 1,
              }}
            >
              <div className="-rotate-45 scale-150 relative">
                <Image
                  src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773190541/groups_daj24s.jpg"
                  alt="Istqrar Team"
                  width={350}
                  height={450}
                  priority
                  id="about-image"
                />
              </div>
            </motion.div>

            {/* Decorative Blurs */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-coralRed/10 rounded-full blur-3xl z-[-1]" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-coralRed/10 rounded-full blur-3xl z-[-1]" />
          </div>
        </div>

        {/* Right Column: Why Choose Us */}
        <div className="flex flex-col gap-8 order-3 px-4 lg:px-0">
          <h2 className="text-coralRed text-2xl font-bold mb-4">
            {t("Why Choose Us")}
          </h2>
          <div className="flex flex-col gap-6">
            {whyChooseUsItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  x: isRTL ? -30 : 30,
                }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                }}
                className="flex items-center gap-6 group"
              >
                <span className="text-4xl font-bold text-zinc-100 dark:text-zinc-800/50 group-hover:text-coralRed/20 transition-colors duration-300">
                  {item.id}
                </span>
                <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
