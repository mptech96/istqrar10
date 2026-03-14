import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AIAnalysisMetadata } from "@/types/ai-analysis";
import { Sparkles, BarChart3, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";

interface Props {
  summary?: string;
  metadata?: AIAnalysisMetadata;
}

export const OverviewCard: React.FC<Props> = ({ summary, metadata }) => {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;

  if (!metadata) return null;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
             <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                   <div className="p-2 rounded-xl bg-linear-to-tr from-primary/20 to-primary/5 border border-primary/10">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                   </div>
                   {t("ai_analysis_header_title")}
                </h1>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                   <Clock className="w-4 h-4" /> {t("ai_analysis_generated_at")} {metadata.generated_at ? format(new Date(metadata.generated_at), "eeee, d MMMM yyyy HH:mm", { locale: dateLocale }) : "-"}
                </p>
             </div>
             
             <div className="flex gap-3">
                <div className="px-4 py-2 rounded-2xl bg-white border shadow-sm flex flex-col items-center">
                   <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{t("ai_analysis_processing_time")}</span>
                   <span className="text-sm font-semibold">{((metadata.processing_time_ms || 0) / 1000).toFixed(1)}s</span>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-white border shadow-sm flex flex-col items-center">
                   <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{t("ai_analysis_tokens")}</span>
                   <span className="text-sm font-semibold">{(metadata.tokens_used || 0).toLocaleString()}</span>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-white border shadow-sm flex flex-col items-center">
                   <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{t("ai_analysis_estimated_cost")}</span>
                   <span className="text-sm font-semibold text-emerald-600">${(metadata.estimated_cost_usd || 0).toFixed(2)}</span>
                </div>
             </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-linear-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                <BarChart3 className="w-5 h-5" /> {t("ai_analysis_summary_title")}
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-800 dark:text-slate-100">
                {summary || t("ai_analysis_no_summary")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
