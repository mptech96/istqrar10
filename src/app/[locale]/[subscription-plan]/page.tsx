import React from "react";
import SubscriptionRequestForm from "@/components/home/subscription/subscription-request-form";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getLocale,
  getTranslations,
} from "next-intl/server";
import { ThemeLogo } from "@/components/ui/theme-logo";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    locale: string;
    "subscription-plan": string;
  }>;
}

const SubscriptionPlanPage = async ({ params }: Props) => {
  const { "subscription-plan": planSlug } = await params;
  const locale = await getLocale();
  const t = await getTranslations();

  // Validate the slug against the valid plan title from the home page
  // This ensures that random paths don't hit this page
  const validTitle = t("plan_title");
  const expectedSlug = encodeURIComponent(validTitle.toLowerCase().replace(/\s+/g, '-'));

  if (decodeURIComponent(planSlug) !== decodeURIComponent(expectedSlug)) {
    notFound();
  }

  const isRTL = locale === "ar";

  // Convert slug back to a more readable title (e.g., "premium-plan" -> "Premium Plan")
  const packageName = decodeURIComponent(planSlug)
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");

  return (
    <section className="min-h-screen bg-slate-50/50 relative overflow-hidden">
      {/* Hero-like background element */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10" />

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8 flex justify-between">
          {/* Logo */}
          <div className="flex justify-center">
            <ThemeLogo width={100} height={100} />
          </div>
          <div className="flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-coralRed transition-colors font-medium group"
            >
              {t("Back to Home")}
              {isRTL ? (
                <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              )}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-12">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                {packageName}
              </h1>
              <div className="h-1.5 w-24 bg-coralRed mx-auto rounded-full" />
            </div>
          </div>

          <SubscriptionRequestForm
            packageName={packageName}
          />
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlanPage;
