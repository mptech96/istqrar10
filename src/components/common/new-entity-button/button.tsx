"use client";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useAppSelector } from "@/lib/store";
import { useTranslations } from "next-intl";
import React from "react";

const NewEntityButton = ({
  url,
  label,
}: {
  url: string;
  label: string;
}) => {
  const { user } = useAppSelector((state) => state.auth);

  const t = useTranslations();
  if (
    user?.role !== "super_admin" &&
    user?.role !== "admin" &&
    user?.role !== "company_admin"
  )
    return null;
  return (
    <Link href={url}>
      <Button className="bg-[rgba(248,142,140,0.97)] text-white hover:bg-coralRed cursor-pointer py-4 ">
        {t(label)}
      </Button>
    </Link>
  );
};

export default NewEntityButton;
