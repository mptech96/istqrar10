"use client";

import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/lib/store";
import { getDashboardUrl } from "@/components/dashboard/sidebar/sidebar-items";

export default function UnauthorizedPage() {
  const t = useTranslations();
  const user = useAppSelector((state) => state.auth.user);

  const dashboardUrl = user?.role ? getDashboardUrl(user.role) : "/dashboard";

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-4 text-center bg-background">
      <div className="rounded-full bg-destructive/10 p-6 animate-pulse">
        <ShieldAlert className="h-20 w-20 text-destructive" />
      </div>
      <div className="space-y-3 max-w-md">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground">
          {t("unauthorized_title")}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("unauthorized_description")}
        </p>
      </div>
      <Button asChild size="lg" className="mt-4 px-8 font-semibold shadow-lg transition-all hover:scale-105">
        <Link href={dashboardUrl}>{t("unauthorized_back_home")}</Link>
      </Button>
    </div>
  );
}
