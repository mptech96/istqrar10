"use client";
import {
  Box,
  ChartNoAxesCombined,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import SectionHeader from "../section-header/section-header";
import Slider, { type sliderProps } from "../slider/slider";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

const certificatesData: sliderProps[] = [
  {
    title: "شهادة اعتماد في الجودة والسلامة",
    image:
      "https://res.cloudinary.com/doxyvufkz/image/upload/v1772681969/ISO-certification-scaled-1-removebg-preview_p9t4hs.png",
  },

  {
    title: "شهادة جودة وسلامة غذائية",
    image:
      "https://res.cloudinary.com/doxyvufkz/image/upload/v1769906379/cert8_b68o0b.png",
  },

  {
    title: "شهادة ISO في سلامة الأغذية",
    image:
      "https://res.cloudinary.com/doxyvufkz/image/upload/v1772681771/pngtree-iso-9001-certified-company-logo-badge-vector-png-image_20971536_pqmacb.png",
  },
];

const advantagesData = [
  {
    title:
      "Full support for small, medium and large enterprises",
    icon: ShieldCheck,
  },
  {
    title:
      "Improving compliance with food quality and safety regulations",
    icon: Wrench,
  },
  {
    title: "Building and developing operational plans",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Real field experience",
    icon: Box,
  },
];

const Advantages = () => {
  const t = useTranslations();
  return (
    <section className="min-h-[450px] flex flex-col gap-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader title={t("Why Choose Us")} />
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <motion.div
          className="flex"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ol start={1} className="grid grid-cols-1">
            {advantagesData.map((service, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.4,
                }}
                key={index}
                className="text-muted-foreground py-2"
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
        </motion.div>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Slider
            data={certificatesData}
            autoplay={true}
            className="max-w-full"
            itemClassName="basis-1/2 md:basis-1/3 "
            showControls={false}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Advantages;
