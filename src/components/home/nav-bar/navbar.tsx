"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import NavLinks from "../navigation-links/nav-links";
import { ThemeLogo } from "@/components/ui/theme-logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NavActions = dynamic(() => import("../nav-actions/actions"), {
  loading: () => <div className="w-36" />,
});

const NavBar = () => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHomePage = pathname === "/";
  const isRTL = locale === "ar";

  return (
    <nav
      className={cn(
        "z-50 w-full flex items-center transition-all",
        isHomePage
          ? "absolute top-10 h-28"
          : "fixed top-0 inset-x-0 h-24 bg-background/85 backdrop-blur-md border-b border-border/50",
      )}
    >
      <div className="flex items-center justify-between w-[90%] mx-auto gap-3">
        <div className="flex items-center gap-2">
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="rounded-xl"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "right" : "left"} className="w-72">
                <SheetHeader className="pb-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <ThemeLogo width={48} height={48} />
                    <span>{t("Istqrar")}</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <NavLinks
                    vertical
                    onNavigate={() => setMobileOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="flex items-center">
            <ThemeLogo
              width={isMobile ? 60 : isHomePage ? 90 : 72}
              height={isMobile ? 60 : isHomePage ? 90 : 72}
            />
          </Link>
        </div>

        {/* Desktop nav-links */}
        <div className="hidden lg:block">
          <NavLinks />
        </div>

        <NavActions />
      </div>
    </nav>
  );
};

export default NavBar;
