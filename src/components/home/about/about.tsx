"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import SectionHeader from "@/components/home/section-header/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { TextAnimate } from "@/components/ui/text-animate";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import Image from "next/image";

const About = () => {
  const t = useTranslations();
  return (
    <section className="min-h-[400px] flex flex-col gap-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader title={t("About Us")} />
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <TextAnimate
            animation="blurIn"
            as="p"
            className="text-muted-foreground leading-12 pe-4"
          >
            {t("about_description")}
          </TextAnimate>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="bg-linear-to-br from-coralRed/5 to-cyan-500/5 border border-coralRed/10">
            <CardContent className="flex items-center justify-center p-0">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src="https://res.cloudinary.com/doxyvufkz/image/upload/v1769914291/Banner-2_bktjar.png"
                  alt={t("Istqrar")}
                  className="h-full w-full rounded-md object-cover"
                  fill
                />
              </AspectRatio>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
