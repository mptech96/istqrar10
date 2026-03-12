"use client";

import NavLinks from "../navigation-links/nav-links";
import Image from "next/image";
import NavActions from "../nav-actions/actions";
import { useAppSelector } from "@/lib/store";
import { useEffect, useState } from "react";

const NavBar = () => {
  const theme = useAppSelector((state) => state.settings.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);

  const logo =
    mounted && theme === "dark"
      ? "https://res.cloudinary.com/doxyvufkz/image/upload/v1773234414/logo-white_text_xewlqs.svg"
      : "https://res.cloudinary.com/doxyvufkz/image/upload/v1773188599/logo_yilq7x.svg";

  return (
    <nav className="absolute top-10 z-50 w-full  h-28 flex items-center ">
      <div className="flex items-center justify-between w-[90%] mx-auto ">
        {/* logo */}
        <div className="flex items-center ">
          <Image
            src={logo}
            alt="Istqrar"
            className="object-cover"
            width={120}
            height={140}
            priority
          />
        </div>
        {/* nav-links */}
        <NavLinks />
        <NavActions />
      </div>
    </nav>
  );
};

export default NavBar;
