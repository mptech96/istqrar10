"use client";

import NavLinks from "../navigation-links/nav-links";
import dynamic from "next/dynamic";
import { ThemeLogo } from "@/components/ui/theme-logo";
import { useIsMobile } from "@/hooks/use-mobile";

const NavActions = dynamic(
  () => import("../nav-actions/actions"),
  {
    loading: () => <div className="w-36" />,
  },
);

const NavBar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className=" absolute top-10 z-50 w-full h-28 flex items-center ">
      <div className="flex items-center justify-between w-[90%] mx-auto ">
        <div className="flex items-center">
          <ThemeLogo
            width={isMobile ? 60 : 90}
            height={isMobile ? 60 : 90}
          />
        </div>
        {/* nav-links */}
        <div className="hidden lg:block">
          <NavLinks />
        </div>
        <NavActions />
      </div>
    </nav>
  );
};

export default NavBar;
