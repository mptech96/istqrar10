import SignInForm from "@/components/auth/signin-form";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="max-h-screen grid lg:grid-cols-2 bg-background relative overflow-hidden  ">
      {/* Left Column: Form */}
      <div className="flex items-center justify-center  py-6 sm:p-12 lg:px-20  relative z-10 w-full  ">
        <div className="w-full max-w-[420px]">
          <SignInForm />
        </div>
      </div>

      {/* Right Column: Feature Image (Desktop Only) */}
      <div className="hidden lg:flex items-center  justify-center p-8 bg-muted/30">
        <div className="relative w-full h-[720px] aspect-[979/653] rounded-[2.5rem] overflow-hidden ">
          <Image
            src="https://res.cloudinary.com/doxyvufkz/image/upload/v1773288897/login_ybdssp.png"
            alt="Istqrar Security & Quality"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
