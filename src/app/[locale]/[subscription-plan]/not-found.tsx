"use client";

import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-4 text-center bg-background">
      <div className="rounded-full bg-primary/10 p-6">
        <FileQuestion className="h-20 w-20 text-primary" />
      </div>
      <div className="space-y-3 max-w-md">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground">
          {t("not_found_title")}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("not_found_description")}
        </p>
      </div>
      <Button asChild size="lg" className="mt-4 px-8 font-semibold shadow-lg transition-all hover:scale-105">
        <Link href="/">{t("not_found_back_home")}</Link>
      </Button>
    </div>
  );
}
