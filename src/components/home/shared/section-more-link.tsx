"use client";

import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

interface SectionMoreLinkProps {
  href: string;
  label: string;
}

export default function SectionMoreLink({ href, label }: SectionMoreLinkProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="flex justify-center pt-4">
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-coralRed/30 bg-coralRed/5 text-coralRed font-bold hover:bg-coralRed hover:text-white transition-all duration-300 group"
      >
        <span>{label}</span>
        <ArrowIcon
          className={`w-4 h-4 transition-transform duration-300 ${
            isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
          }`}
        />
      </Link>
    </div>
  );
}
