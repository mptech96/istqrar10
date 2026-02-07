import { useTranslations } from "next-intl";
import { Mail, Phone, Globe } from "lucide-react";

const Footer = () => {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  // Replace with actual contact info
  const phoneNumber = "+966500000000";
  const email = "info@istqrar.sa";
  const website = "https://istqrar.sa";

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-coralRed/90 via-coralRed to-coralRed/80 -z-10" />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Logo & Description */}
        <div className="flex flex-col items-center text-center mb-10">
          <img
            src="https://res.cloudinary.com/doxyvufkz/image/upload/v1769547758/Gemini_Generated_Image_v13ifrv13ifrv13i-removebg-preview_lqvicb.png"
            alt="Istqrar Logo"
            className="w-24 h-auto mb-4"
          />
          <p className="text-white/80 max-w-md text-sm">
            {t("Quality Control Excellence")}
          </p>
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {/* WhatsApp Link */}
          <a
            href={`https://wa.me/${phoneNumber.replace(/\+/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-white hover:text-cyan-200 transition-colors duration-300 group"
          >
            <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">
              {phoneNumber}
            </span>
          </a>

          {/* Email Link */}
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 text-white hover:text-cyan-200 transition-colors duration-300 group"
          >
            <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">
              {email}
            </span>
          </a>

          {/* Website Link */}
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-white hover:text-cyan-200 transition-colors duration-300 group"
          >
            <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">
              istqrar.sa
            </span>
          </a>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/20 mb-6" />

        {/* Copyright */}
        <div className="text-center text-white/70 text-sm">
          <p>
            © {currentYear} {t("Istqrar")}.{" "}
            {t("All rights reserved")}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
