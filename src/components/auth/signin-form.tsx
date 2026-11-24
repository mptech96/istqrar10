"use client";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { signinSchema } from "@/schema/signin.schema.zod";
import { useRouter } from "@/i18n/navigation";
import { useLoginMutation } from "@/services/api/auth";
import { toast } from "sonner";
import { useLoader } from "@/hooks/use-loader";
import { setCredentials } from "@/features/auth-slice";
import { getDashboardUrl } from "../dashboard/sidebar/sidebar-items";
import { ThemeLogo } from "../ui/theme-logo";

export default function SignInForm() {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const t = useTranslations();
  const { language } = useAppSelector((state) => state.settings);

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<ReturnType<typeof signinSchema>>>({
    resolver: zodResolver(signinSchema(t)) as Resolver<
      z.infer<ReturnType<typeof signinSchema>>
    >,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* Removed bad dispatch from render */
  const { start, stop } = useLoader();

  useEffect(() => {
    if (isLoading) {
      start(t("Signing in"));
    }
  }, [isLoading, start, t]);
  async function onSubmit(values: z.infer<typeof signinSchema>) {
    // Handle login logic here
    try {
      const res = await login(values).unwrap();
      if (res.success) {
        dispatch(setCredentials({ ...res.data }));
        toast.success(t("login successfully !"));
        const dashboardUrl = getDashboardUrl(res.data.user.role);
        console.log("dashboardUrl", res.data.user.role);
        router.push(dashboardUrl);
      }
    } catch {
      toast.error(t("login failed !"));
    } finally {
      stop();
    }
  }

  return (
    <div className="w-full space-y-8 relative p-4 md:p-0 ">
      {/* Logo */}
      <div className="flex justify-center">
        <ThemeLogo width={120} height={100} />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-darkRed">{t("Sign In")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("Enter your credentials to access your account")}
        </p>
      </div>

      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem
                  className="space-y-1.5"
                  dir={language === "ar" ? "rtl" : "ltr"}
                >
                  <FormControl>
                    <Input
                      placeholder={t("Email")}
                      className="h-12 bg-background border-input/60 rounded-lg focus-visible:ring-darkRed/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-1.5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem
                    className="space-y-1.5"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("Password")}
                          className={`h-12 bg-background border-input/60 rounded-lg focus-visible:ring-darkRed/20 ${language === "ar" ? "pl-10" : "pr-10"}`}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${language === "ar" ? "left-3" : "right-3"}`}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-start">
                <Link
                  href=""
                  className="text-xs text-muted-foreground hover:text-darkRed transition-colors font-medium"
                >
                  {t("Forgot Password?")}
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 cursor-pointer bg-darkRed hover:bg-darkRed/90 text-white font-bold text-lg rounded-lg transition-all duration-300 shadow-lg shadow-darkRed/20"
            >
              {t("Sign In")}
            </Button>
          </form>
        </Form>

        {/* Divider */}
        {/*  <div className="relative flex items-center gap-4 py-2">
          <Separator className="flex-1" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">
            {t("Or continue with")}
          </span>
          <Separator className="flex-1" />
        </div> */}

        {/* Social Sign-In Grid */}
        {/* <div className="grid grid-cols-4 gap-3">
          {[
            { icon: "facebook", color: "#1877F2" },
            { icon: "x", color: "#000000" },
            { icon: "apple", color: "#000000" },
            { icon: "google", color: "#DB4437" },
          ].map((social) => (
            <Button
              key={social.icon}
              variant="outline"
              className="h-12 w-full p-0 bg-background hover:bg-muted/50 transition-colors rounded-lg border-input/60"
            >
              <SocialIcon name={social.icon} />
            </Button>
          ))}
        </div> */}

        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            {t("Don't have an account?")}{" "}
            <Link
              href="/#pricing"
              className="text-darkRed hover:underline font-bold"
            >
              {t("Create new account")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Simple internal component for social icons
function SocialIcon({ name }: { name: string }) {
  switch (name) {
    case "facebook":
      return (
        <svg
          className="w-5 h-5 text-[#1877F2]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "x":
      return (
        <svg
          className="w-4 h-4 text-foreground fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "apple":
      return (
        <svg
          className="w-5 h-5 text-foreground fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18-.02 2.31-.93 3.9-.84 1.91.1 3.2 1.05 3.93 2.13-3.85 2.25-3.24 7.42.61 9.02-.38.98-1.52 1.92-3.52 1.92zm-5.03-13.6c0-2.43 2.01-4.41 4.51-4.43.08 2.5-1.93 4.51-4.51 4.43z" />
        </svg>
      );
    case "google":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      );
    default:
      return null;
  }
}
