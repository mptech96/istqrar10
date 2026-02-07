import { useTranslations } from "next-intl";
import React from "react";

const Header = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const t = useTranslations();
  return (
    <header>
      <h1 className="text-2xl font-bold uppercase tracking-wider">
        {t(title)}
      </h1>
      <p className="text-gray-500 text-sm mt-1.5 ">
        {t(description)}
      </p>
    </header>
  );
};

export default Header;
