"use client";

import NavLinks from "../navigation-links/nav-links";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

const NavBar = () => {
  return (
    <nav className="absolute top-0 z-50 w-full py-2 h-28 flex items-center ">
      <div className="flex items-center justify-between w-[90%] mx-auto">
        {/* logo */}
        <div className="flex items-center w-20 h-14    ">
          <AspectRatio ratio={16 / 14}>
            <Image
              src="https://res.cloudinary.com/doxyvufkz/image/upload/v1772428106/ChatGPT_Image_Mar_2_2026_07_08_05_AM_ccmhaf.png"
              alt="Istqrar"
              className="object-cover"
              width={80}
              height={80}
            />
          </AspectRatio>
        </div>
        {/* nav-links */}
        <NavLinks />
      </div>
    </nav>
  );
};

export default NavBar;
