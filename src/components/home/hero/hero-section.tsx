"use client";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { motion } from "motion/react";
import { useRouter } from "@/i18n/navigation";
const HeroSection = () => {
  const t = useTranslations();
  const language = useLocale();
  const isRTL = language === "ar";
  const router = useRouter();
  return (
    <section className="bg-transparent relative min-h-[100vh] overflow-clip flex items-center justify-center ">
      {/* Subtle Neon Gradient Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-visible  -z-10 pointer-events-none bg-transparent">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-coralRed/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-24 right-0 w-[20%] h-[20%] bg-cyan-500/20 rounded-full blur-[100px] " />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-coralRed/20 rounded-full blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center bg-transparent">
        {/* Main headline with neon gradient effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-coralRed/10 border border-coralRed/30">
            {language === "en" && (
              <span className="w-2 h-2 rounded-full bg-coralRed animate-ping" />
            )}
            <span className="bg-linear-to-r from-coralRed to-cyan-500 bg-clip-text text-transparent text-sm font-medium">
              {t("New Era of Quality")}
            </span>
            {language === "ar" && (
              <span className="w-2 h-2 rounded-full bg-coralRed animate-ping" />
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block mb-2 text-foreground">
              {t("Elevate Your")}
            </span>
            <span
              className="inline-block bg-linear-to-r from-cyan-500 to-coralRed bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(240,89,87,0.3)]"
              style={{
                textShadow:
                  "0 0 40px rgba(240,89,87,0.3), 0 0 80px rgba(6,182,212,0.2)",
              }}
            >
              {t("Quality Control")}
            </span>
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero_description")}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.7,
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? "sm:flex-row-reverse" : ""}`}
          >
            <Button
              size="lg"
              className="group relative px-8 py-6 text-lg font-semibold bg-linear-to-r from-coralRed to-cyan-600 hover:from-coralRed hover:to-cyan-500 text-white border-0 rounded-xl shadow-[0_0_30px_rgba(240,89,87,0.4)] hover:shadow-[0_0_50px_rgba(240,89,87,0.6)] transition-all duration-300"
              onClick={() => router.push("/sign-up")}
            >
              {t("Join Now")}
              <ArrowRight
                className={`w-5 h-5 transition-transform duration-300 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
              />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold border-2 border-coralRed/30 hover:border-coralRed/60 hover:bg-coralRed/10 rounded-xl transition-all duration-300"
            >
              {t("Learn More")}
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.9,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-linear-to-br from-coralRed/5 to-cyan-500/5 border border-coralRed/20 hover:border-coralRed/40 hover:from-coralRed/10 hover:to-cyan-500/10 transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold bg-linear-to-r from-coralRed to-cyan-500 bg-clip-text text-transparent">
                <NumberTicker value={500} />+
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {t("Clients")}
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-linear-to-br from-coralRed/5 to-cyan-500/5 border border-coralRed/20 hover:border-coralRed/40 hover:from-coralRed/10 hover:to-cyan-500/10 transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold bg-linear-to-r from-coralRed to-cyan-500 bg-clip-text text-transparent">
                <NumberTicker
                  value={99.9}
                  decimalPlaces={1}
                />
                %
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {t("Accuracy")}
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-linear-to-br from-coralRed/5 to-cyan-500/5 border border-coralRed/20 hover:border-coralRed/40 hover:from-coralRed/10 hover:to-cyan-500/10 transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold bg-linear-to-r from-coralRed to-cyan-500 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {t("Support")}
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-linear-to-br from-coralRed/5 to-cyan-500/5 border border-coralRed/20 hover:border-coralRed/40 hover:from-coralRed/10 hover:to-cyan-500/10 transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold bg-linear-to-r from-coralRed to-cyan-500 bg-clip-text text-transparent">
                <NumberTicker value={10} />+
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {t("Years")}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
