import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import LangSwitcher from "@/components/common/lang/lang-switcher";

const NavActions = () => {
  const t = useTranslations();
  return (
    <NavigationMenu>
      <NavigationMenuList
        className={`flex gap-4 items-center `}
      >
        <div className="cursor-pointer text-sm flex align-center">
          <AnimatedThemeToggler className="text-[16px]" />
        </div>
        <div>
          <LangSwitcher />
        </div>
        <NavigationMenuItem>
          <Link
            href="/login" /* 
                text-align: right;
font-family: "Noto Kufi Arabic";
font-size: 20px;
font-style: normal;
font-weight: 500;
line-height: 45px
            */
            className=" inline-block w-48 cursor-pointer text-[20px] font-medium leading-11.25 text-primary-foreground text-center bg-linear-90 from-coralRed to-darkRed px-6 py-1 rounded-md  transition-colors"
          >
            {t("Join Us")}
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavActions;
