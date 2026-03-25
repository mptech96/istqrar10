"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useActiveSection } from "@/hooks/use-active-section";

const NavLinks = () => {
  const t = useTranslations();

  const links = [
    {
      href: "/#home",
      label: "Home",
    },
    {
      href: "/#about",
      label: "About",
    },
    {
      href: "/#services",
      label: "Services",
    },
    {
      href: "/#pricing",
      label: "Subscriptions",
    },
    /*   {
      href: "/#Blogs",
      label: "Blogs",
    }, */
    {
      href: "/#contact",
      label: "Contact",
    },
  ];

  const sectionIds = links.map((link) =>
    link.href.replace("/#", ""),
  );
  const activeSection = useActiveSection(sectionIds);

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center bg-[#F0F0F0] dark:bg-[#1e1e1e] px-6 py-1.5 gap-3 rounded-full text-primary">
        {links.map((link, index) => {
          const sectionId = link.href.replace("/#", "");
          const isActive = activeSection === sectionId;

          return (
            <NavigationMenuItem
              key={index}
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
