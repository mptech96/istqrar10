import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import nextra from "nextra";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**", // Allows all paths from Cloudinary
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
const withNextra = nextra({
  defaultShowCopyCode: true,
});

export default withNextra(withNextIntl(nextConfig));
