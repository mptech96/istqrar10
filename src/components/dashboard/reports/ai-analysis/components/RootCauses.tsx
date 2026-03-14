import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RootCauseAnalysis } from "@/types/ai-analysis";
import { AlertCircle, Info } from "lucide-react";
import { useTranslations } from "next-intl";

interface RootCausesProps {
  data: RootCauseAnalysis;
}

export const RootCausesAnalysisWidget: React.FC<RootCausesProps> = ({ data }) => {
  const t = useTranslations();
  if (!data) return null;
  return (
    <Card className="shadow-lg border-primary/10 overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl">{t("ai_analysis_root_causes_title")}</CardTitle>
        </div>
        <CardDescription>{data.summary}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        {/* Primary Causes */}
        <div>
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-destructive">
             {t("ai_analysis_primary_causes")}
          </h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.primary_causes.map((cause, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-destructive/5 border border-destructive/10 hover:border-destructive/30 transition-colors">
                <p className="font-medium text-sm mb-2">{cause.description}</p>
                <div className="flex items-start gap-2">
                  <Badge variant="destructive" className="mt-0.5 text-[10px] shrink-0">{t("ai_analysis_impact")}</Badge>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cause.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Causes */}
        <div>
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-orange-500">
             {t("ai_analysis_secondary_causes")}
          </h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.secondary_causes.map((cause, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/30 transition-colors">
                <p className="font-medium text-sm mb-2">{cause.description}</p>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5 text-[10px] shrink-0 bg-orange-500/20 text-orange-700 hover:bg-orange-500/30">{t("ai_analysis_impact")}</Badge>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cause.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contributing Factors */}
        <div>
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-primary">
            <Info className="w-4 h-4" /> {t("ai_analysis_contributing_factors")}
          </h4>
          <div className="flex flex-wrap gap-3">
            {data.contributing_factors.map((factor, idx) => (
              <div key={idx} className="px-4 py-2 rounded-full bg-primary/5 border border-primary/20 flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] uppercase">{factor.type}</Badge>
                <span className="text-sm">{factor.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Systemic Issues */}
        {data.systemic_issues.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-900 text-slate-50 border border-slate-800">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-400" /> {t("ai_analysis_systemic_issues")}
            </h4>
            <div className="space-y-3">
              {data.systemic_issues.map((issue, idx) => (
                <div key={idx} className="border-l-2 border-orange-500 pl-4 py-1">
                  <p className="text-sm font-medium">{issue.description}</p>
                  <p className="text-xs text-slate-400 mt-1">{issue.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
