import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/lib/store";

import { Link } from "@/i18n/navigation";

const NavLinks = () => {
  const t = useTranslations();
  const { language } = useAppSelector(
    (state) => state.settings,
  );

  return (
    <NavigationMenu>
      <NavigationMenuList
        className={`flex gap-4 items-center ${language === "ar" ? "flex-row-reverse" : ""}`}
      >
        <NavigationMenuItem>
          <Link
            href="/"
            className=" relative cursor-pointer hover:text-primary transition-colors data-[active=true]:text-primary data-[active=true]:font-bold "
          >
            {t("Home")}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href="about"
            className="cursor-pointer hover:text-primary transition-colors"
          >
            {t("About")}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href="services"
            className="cursor-pointer hover:text-primary transition-colors"
          >
            {t("Services")}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href="contact"
            className="cursor-pointer hover:text-primary transition-colors"
          >
            {t("Contact")}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href="/login"
            className="bg-primary cursor-pointer text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            {t("Join Now")}
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavLinks;
