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
              src="https://res.cloudinary.com/doxyvufkz/image/upload/v1769547758/Gemini_Generated_Image_v13ifrv13ifrv13i-removebg-preview_lqvicb.png"
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
