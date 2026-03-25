"use client";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { LogIn, User } from "lucide-react";

const NavActions = () => {
  const t = useTranslations();
  const isMobile = useIsMobile();

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-1 lg:gap-4 items-center ">
        <div className="cursor-pointer text-sm flex align-center">
          <AnimatedThemeToggler className="text-[12px]" />
        </div>
        <div>
          <LangSwitcher />
        </div>
        <NavigationMenuItem>
          <Link
            href="/login"
            className={`flex items-center justify-center cursor-pointer font-normal text-primary-foreground text-center bg-linear-90 from-coralRed to-darkRed rounded-md transition-all hover:brightness-110 ${
              isMobile
                ? "w-10 h-10 p-2"
                : "w-36 px-2 py-1 text-[18px] leading-11.25"
            }`}
          >
            {isMobile ? <User size={20} /> : t("Sign In")}
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavActions;
