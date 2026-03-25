"use client";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
const HeroSection = () => {
  const t = useTranslations();
  const language = useLocale();
  const isRTL = language === "ar";
  const isMobile = useIsMobile();
  return (
    <section
      className={`bg-transparent relative ${isMobile ? "" : "min-h-[100vh]"} overflow-clip flex items-center justify-center `}
    >
      <div className="grid grid-cols-1   lg:grid-cols-2   mt-[200px]">
        <div className=" flex flex-col gap-5 ">
          <h1
            className={`${isMobile ? "text-[36px]" : "text-[60px]"} font-bold leading-23.25 text-start`}
          >
            <span className=" bg-gradient-to-r from-coralRed to-darkRed bg-clip-text text-transparent">
              {t("Istqrar quality")}
            </span>
            <span>
              {t(
                "Permanent partner for food safety and quality",
              )}
            </span>
          </h1>
          {/* leading-trim: both;

text-edge: cap; */}
          <p className="text-start text-[#808080] text-[20px] leading-11.25 font-normal  leading-trim-both text-edge-cap">
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
                      {isRTL ? (
                        <ArrowLeft />
                      ) : (
                        <ArrowRight />
                      )}
                    </span>
                    {isRTL ? null : t("Show more")}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
        {!isMobile && (
          <div>
            <Image
              src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773185578/istqrar_icon_smubrt.png"
              alt=""
              width={825}
              height={500}
              className="aspect-75/53"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
