"use client";

import NavLinks from "../navigation-links/nav-links";
import NavActions from "../nav-actions/actions";
import { ThemeLogo } from "@/components/ui/theme-logo";

const NavBar = () => {
  return (
    <nav className="absolute top-10 z-50 w-full  h-28 flex items-center ">
      <div className="flex items-center justify-between w-[90%] mx-auto ">
        <div className="flex items-center">
          <ThemeLogo width={120} height={140} />
        </div>
        {/* nav-links */}
        <NavLinks />
        <NavActions />
      </div>
    </nav>
  );
};

export default NavBar;
