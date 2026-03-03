"use client";

import React from "react";
import { useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LifeBuoy } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function SupportButton() {
  const user = useAppSelector((state) => state.auth.user);
  const t = useTranslations();
  const locale = useLocale();
  // Hide for admin and super_admin
  if (
    !user ||
    user.role === "super_admin" ||
    user.role === "admin" ||
    user.role === "company_admin"
  ) {
    return null;
  }

  return (
    <Link href="/dashboard/tickets/new">
      <Button
        size="lg"
        className={` cursor-pointer fixed bottom-6  z-50 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-primary ${locale === "ar" ? "left-6" : "right-6"}`}
        title={t("Support")}
      >
        <LifeBuoy className="h-6 w-6" />
      </Button>
    </Link>
  );
}
