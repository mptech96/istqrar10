"use client";
import React from "react";
import { motion } from "motion/react";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  features: string[];
  isHighlighted?: boolean;
  buttonText: string;
}

const PricingCard = ({
  title,
  features,
  isHighlighted,
  buttonText,
}: PricingCardProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative rounded-[2rem] overflow-hidden flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
        isHighlighted
          ? "bg-linear-to-b from-coralRed to-darkRed text-white shadow-xl shadow-coralRed/20"
          : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "py-8 px-6 text-center",
          isHighlighted ? "bg-black" : "bg-coralRed",
        )}
      >
        <h3 className="text-xl font-bold text-white">
          {title}
        </h3>
      </div>

      {/* Body */}
      <div className="flex-1 px-8 py-10 flex flex-col gap-5">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-3 group"
          >
            <div
              className={cn(
                "mt-1 p-0.5 rounded-full",
                isHighlighted
                  ? "bg-white/20"
                  : "bg-coralRed/10",
              )}
            >
              <Check
                className={cn(
                  "w-4 h-4",
                  isHighlighted
                    ? "text-white"
                    : "text-coralRed",
                )}
              />
            </div>
            <p
              className={cn(
                "text-sm font-medium leading-relaxed",
                isHighlighted
                  ? "text-zinc-100"
                  : "text-zinc-600 dark:text-zinc-400",
              )}
            >
              {feature}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-8 pb-10">
        <button
          onClick={() => {
            const planSlug = encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
            window.location.href = `/${locale}/${planSlug}`;
          }}
          className={cn(
            "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 group transition-all duration-300",
            isHighlighted
              ? "bg-white text-coralRed hover:bg-zinc-100"
              : "bg-coralRed text-white hover:bg-darkRed",
          )}
        >
          {buttonText}
          <ArrowIcon
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              isRTL
                ? "group-hover:-translate-x-1"
                : "group-hover:translate-x-1",
            )}
          />
        </button>
      </div>
    </motion.div>
  );
};

export default PricingCard;
