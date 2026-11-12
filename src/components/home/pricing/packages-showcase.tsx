import { getTranslations } from "next-intl/server";
import { PACKAGES_DATA } from "@/data/marketing";
import PricingCard from "./pricing-card";

export default async function PackagesShowcase() {
  const t = await getTranslations();

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {PACKAGES_DATA.map((pkg) => (
          <div key={pkg.id} className="flex flex-col gap-4">
            <div className="px-2 space-y-1.5 text-center">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-coralRed/10 text-coralRed">
                {t(pkg.tierKey)}
              </span>
              <p className="text-sm text-muted-foreground min-h-10">
                {t(pkg.descKey)}
              </p>
            </div>
            <div className="flex-1">
              <PricingCard
                title={t(pkg.titleKey)}
                features={pkg.featureKeys.map((key) => t(key))}
                isHighlighted={pkg.isHighlighted}
                buttonText={t("Join Us")}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
