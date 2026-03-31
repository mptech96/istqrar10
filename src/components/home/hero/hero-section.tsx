"use client";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
  heroImageRef: React.RefObject<HTMLDivElement | null>;
  floatingRef: React.RefObject<HTMLDivElement | null>;
  isTransitioning: boolean;
  isTransitionComplete: boolean;
}

const HeroSection = ({
  heroRef,
  heroImageRef,
  floatingRef,
  isTransitioning,
  isTransitionComplete,
}: HeroSectionProps) => {
  const t = useTranslations();
  const language = useLocale();
  const isRTL = language === "ar";
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldFloat = isTransitioning || isTransitionComplete;

  const floatingImage = (
    <div
      ref={floatingRef}
      style={{
        position: 'fixed' as const,
        zIndex: 2147483647,
        opacity: 1,
        pointerEvents: 'none',
        display: 'none',
        // left, top, width, height are set directly by the transition hook
      }}
    >
      <Image
        src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773185578/istqrar_icon_smubrt.png"
        alt=""
        width={825}
        height={500}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );

  return (
    <>
      <section
        ref={heroRef}
        className={`bg-transparent relative ${isMobile ? "" : "min-h-[100vh]"} overflow-visible flex items-center justify-center `}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-[200px]">
          <div className="flex flex-col gap-5">
            <h1
              className={`${isMobile ? "text-[36px]" : "text-[60px]"} font-bold leading-23.25 text-start`}
            >
              <span className="bg-gradient-to-r from-coralRed to-darkRed bg-clip-text text-transparent">
                {t("Istqrar quality")}
              </span>
              <span>
                {t(
                  "Permanent partner for food safety and quality",
                )}
              </span>
            </h1>
            <p className="text-start text-[#808080] text-[20px] leading-11.25 font-normal leading-trim-both text-edge-cap">
              {t(
                "Turn quality costs into net profit, raise the bar for world-class quality, and add real value to your facility",
              )}
            </p>
            <div className="flex gap-4 sm:gap-6 mt-4">
              <div>
                <Link
                  href="/#pricing"
                  className={`flex items-center justify-center ${isMobile ? "w-36" : "w-54.5"} h-14.5 cursor-pointer text-[20px] font-medium leading-normal text-white bg-linear-to-r from-coralRed to-darkRed hover:brightness-110 transition-all rounded-[10px]`}
                >
                  <span className="flex items-center gap-2">
                    {isRTL ? t("Join Us") : null}
                    <span className="w-6 h-6 flex items-center justify-center">
                      {isRTL ? <ArrowLeft /> : <ArrowRight />}
                    </span>
                    {isRTL ? null : t("Join Us")}
                  </span>
                </Link>
              </div>
              {!isMobile && (
                <div>
                  <Link
                    href="/login"
                    className="flex items-center justify-center w-54.5 h-14.5 cursor-pointer text-[20px] font-medium leading-normal text-white bg-black hover:bg-zinc-900 transition-all rounded-[10px]"
                  >
                    <span className="flex items-center gap-2">
                      {isRTL ? t("Show more") : null}
                      <span className="w-6 h-6 flex items-center justify-center">
                        {isRTL ? <ArrowLeft /> : <ArrowRight />}
                      </span>
                      {isRTL ? null : t("Show more")}
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          {!isMobile && (
            <div
              ref={heroImageRef}
              className="transition-opacity duration-300"
              style={{
                opacity: shouldFloat ? 0 : 1,
              }}
            >
              <Image
                src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773185578/istqrar_icon_smubrt.png"
                alt=""
                width={825}
                height={500}
                className="aspect-75/53"
                id="hero-image"
                priority
              />
            </div>
          )}
        </div>
      </section>
      {mounted && typeof document !== 'undefined' && createPortal(floatingImage, document.body)}
    </>
  );
};

export default HeroSection;
