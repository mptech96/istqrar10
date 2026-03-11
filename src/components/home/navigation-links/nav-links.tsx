import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useTranslations, useLocale } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useAppSelector } from "@/lib/store";

const NavLinks = () => {
  const t = useTranslations();
  const theme = useAppSelector(
    (state) => state.settings.theme,
  );

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
      href: "/#Subscriptions",
      label: "Subscriptions",
    },
    {
      href: "/#Blogs",
      label: "Blogs",
    },
    {
      href: "/#contact",
      label: "Contact",
    },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList
        /* 
      display: flex;
width: 712px;
padding: 16px 24px;
align-items: center;
gap: 12px;
flex-shrink: 0;
       */
        className={`flex  items-center bg-[#F0F0F0] dark:bg-[#1e1e1e]   px-6 py-1.5 gap-3 rounded-full text-primary `}
      >
        {links.map((link, index) => (
          <NavigationMenuItem
            key={index}
            className="px-4 py-2.5 leading-11.25 font-[400] text-[18px]  "
          >
            <Link
              href={link.href}
              className=" relative cursor-pointer  hover:text-primary transition-colors data-[active=true]:text-primary data-[active=true]:font-bold  "
            >
              {t(link.label)}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavLinks;
