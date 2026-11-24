"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/contact", label: "Contact" },
] as const;

interface NavLinksProps {
  vertical?: boolean;
  onNavigate?: () => void;
}

const NavLinks = ({ vertical = false, onNavigate }: NavLinksProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  const isRouteActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (vertical) {
    return (
      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map((link) => {
          const isActive = isRouteActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              data-active={isActive ? "true" : "false"}
              className={cn(
                "px-4 py-3 rounded-xl text-base font-medium transition-colors hover:bg-coralRed/10 hover:text-coralRed",
                isActive
                  ? "bg-coralRed/10 text-darkRed font-bold"
                  : "text-foreground",
              )}
            >
              {t(link.label)}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center bg-[#F0F0F0] dark:bg-[#1e1e1e] px-6 py-1.5 gap-3 rounded-full text-primary">
        {NAV_ITEMS.map((link) => {
          const isActive = isRouteActive(link.href);

          return (
            <NavigationMenuItem
              key={link.href}
              className="px-4 py-2.5 leading-11.25 font-[400] text-[18px]"
            >
              <Link
                href={link.href}
                data-active={isActive ? "true" : "false"}
                className="relative cursor-pointer hover:text-primary transition-colors data-[active=true]:text-darkRed data-[active=true]:font-bold"
              >
                {t(link.label)}
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavLinks;
