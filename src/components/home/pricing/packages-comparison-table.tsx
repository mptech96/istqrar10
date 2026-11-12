import { Check, Minus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import SectionHeader from "../section-header/section-header";
import { COMPARISON_ROWS } from "@/data/marketing";

export default async function PackagesComparisonTable() {
  const t = await getTranslations();

  const renderCell = (
    labelKey: string,
    isBoolean?: boolean,
    included?: boolean,
  ) => {
    if (!isBoolean) {
      return <span className="font-semibold text-sm">{t(labelKey)}</span>;
    }
    return included ? (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-coralRed/15 text-coralRed">
        <Check className="w-4 h-4" />
      </span>
    ) : (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
        <Minus className="w-4 h-4" />
      </span>
    );
  };

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-12 space-y-10">
      <SectionHeader
        title={t("Package Comparison")}
        subtitle={t("comparison_subtitle")}
      />

      <div className="overflow-x-auto rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <table className="w-full text-start border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40">
              <th className="py-5 px-6 text-start font-bold text-base">
                {t("Feature")}
              </th>
              <th className="py-5 px-6 text-center font-bold text-base">
                {t("tier_starter")}
              </th>
              <th className="py-5 px-6 text-center font-bold text-base text-coralRed bg-coralRed/5">
                {t("tier_growth")}
              </th>
              <th className="py-5 px-6 text-center font-bold text-base">
                {t("tier_enterprise")}
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, idx) => (
              <tr
                key={idx}
                className="border-b last:border-b-0 border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
              >
                <td className="py-4 px-6 font-medium text-sm md:text-base">
                  {t(row.featureKey)}
                </td>
                <td className="py-4 px-6 text-center">
                  {renderCell(
                    row.starterKey,
                    row.isBoolean,
                    row.starterIncluded,
                  )}
                </td>
                <td className="py-4 px-6 text-center bg-coralRed/5">
                  {renderCell(row.growthKey, row.isBoolean, row.growthIncluded)}
                </td>
                <td className="py-4 px-6 text-center">
                  {renderCell(
                    row.enterpriseKey,
                    row.isBoolean,
                    row.enterpriseIncluded,
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
