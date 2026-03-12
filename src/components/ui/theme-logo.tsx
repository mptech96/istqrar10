import Image from "next/image";

interface ThemeLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function ThemeLogo({
  className = "",
  width = 120,
  height = 140,
}: ThemeLogoProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Light Theme Logo (Hidden in dark mode) */}
      <Image
        src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773188599/logo_yilq7x.svg"
        alt="Istqrar"
        width={width}
        height={height}
        className="block dark:hidden object-contain"
        priority
      />
      {/* Dark Theme Logo (Hidden in light mode) */}
      <Image
        src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773234414/logo-white_text_xewlqs.svg"
        alt="Istqrar"
        width={width}
        height={height}
        className="hidden dark:block object-contain"
        priority
      />
    </div>
  );
}
