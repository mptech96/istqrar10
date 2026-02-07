import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";

const NewEntityButton = ({
  url,
  label,
}: {
  url: string;
  label: string;
}) => {
  const t = useTranslations();
  return (
    <Link href={url}>
      <Button className="bg-[rgba(248,142,140,0.97)] text-white hover:bg-coralRed cursor-pointer py-4 ">
        {t(label)}
      </Button>
    </Link>
  );
};

export default NewEntityButton;
