import SignInForm from "@/components/auth/signin-form";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Gradient Blobs - matching hero section */}
      <div className="absolute top-0 left-0 w-full h-full overflow-visible -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-coralRed/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-24 right-0 w-[20%] h-[20%] bg-cyan-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-coralRed/20 rounded-full blur-[80px]" />
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}
