"use client";
import React from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  MessageCircle,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Footer = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: MapPin,
      label: t("Address"),
      value: t("Riyadh - Saudi Arabia"),
    },
    {
      icon: Phone,
      label: t("Phone / WhatsApp"),
      value: "+966593283732",
      href: "https://wa.me/966593283732",
    },
    {
      icon: Mail,
      label: t("Email Address"),
      value: "info@qsco.sa",
      href: "mailto:info@qsco.sa",
    },
  ];

  const socialLinks = [
    {
      icon: MessageCircle,
      href: "#",
    }, // Snapchat placeholder
    { icon: Youtube, href: "#" },
    { icon: Hash, href: "#" }, // Google placeholder/custom
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Facebook, href: "#" },
  ];

  return (
    <footer className="relative mt-20 pt-20 pb-10 overflow-hidden text-white font-din">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773233995/footer_reukpl.jpg"
          alt="Footer Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left Column: Contact Info & Socials (RTL Logic) */}
          <div className={cn("flex flex-col gap-8")}>
            <div className="relative w-48 h-20">
              <Image
                src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773234414/logo-white_text_xewlqs.svg"
                alt="Istqrar Logo"
                fill
                className="object-contain"
              />
            </div>

            <p className="text-zinc-300 max-w-md leading-relaxed text-lg">
              {t(
                "It is an organization founded in 2025 that is interested in and specialized in developing and improving food safety and security quality and operational solutions, We support small, medium and large enterprises to maintain the highest level of quality and food safety and to build and develop operational plans",
              )}
            </p>

            {/* Certification Badges */}
            <div className="flex items-center w-[280px] mt-4 bg-white p-4 rounded-2xl ">
              <div className="relative w-16.25 h-16.25  rounded-lg">
                <Image
                  src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773234775/c-1_nhrbn2.png"
                  alt="HACCP Certification"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-[100px] h-[80px]  rounded-lg bg-white">
                <Image
                  src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773234773/c-2_zjeqwj.png"
                  alt="ISO 22000 Certification"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-16.25 h-16.25    rounded-lg">
                <Image
                  src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773234775/c-3_r4oibv.png"
                  alt="ISO 9001 Certification"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className={cn("flex flex-col gap-10")}>
            <div className="flex flex-col gap-8 w-full max-w-sm">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className={cn("flex items-start gap-4")}
                >
                  <div className="p-3 rounded-full bg-coralRed/10 border border-coralRed/20 text-coralRed">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-zinc-400 text-sm">
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-lg font-medium hover:text-coralRed transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-lg font-medium">
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Icons Row */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110",

                    "bg-coralRed text-white",
                  )}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Logo & Description (RTL Logic) */}
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center items-center gap-4 text-zinc-500 text-sm">
          <p>
            Copyright © {currentYear} | {t("Istqrar")} |{" "}
            {t("All rights reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
