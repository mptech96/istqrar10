import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskAssessmentAnalysis } from "@/types/ai-analysis";
import { AlertTriangle, ShieldAlert, ShieldCheck, HeartPulse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface Props {
  data: RiskAssessmentAnalysis;
}

export const RiskAssessmentWidget: React.FC<Props> = ({ data }) => {
  const t = useTranslations();
  if (!data) return null;
  const hasRisks = (data.critical_risks?.length || 0) > 0 || (data.high_risks?.length || 0) > 0;

  return (
    <Card className={`shadow-lg border-2 ${hasRisks ? 'border-destructive/20' : 'border-emerald-500/20'}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
           {hasRisks ? <ShieldAlert className="w-6 h-6 text-destructive" /> : <ShieldCheck className="w-6 h-6 text-emerald-500" />}
           {t("ai_analysis_risk_compliance_title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Critical Risks */}
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-destructive flex items-center gap-1 uppercase">
                    <AlertTriangle className="w-3 h-3" /> {t("ai_analysis_critical_risks")}
                  </span>
                  <Badge variant="destructive" className="h-5 px-2 text-[10px]">{data.critical_risks.length}</Badge>
               </div>
               <p className="text-[11px] text-muted-foreground">{t("ai_analysis_critical_risks_desc")}</p>
            </div>

            {/* High Risks */}
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-orange-600 flex items-center gap-1 uppercase">
                    <HeartPulse className="w-3 h-3" /> {t("ai_analysis_high_risks")}
                  </span>
                  <Badge className="h-5 px-2 text-[10px] bg-orange-500 hover:bg-orange-600 border-none">{data.high_risks.length}</Badge>
               </div>
               <p className="text-[11px] text-muted-foreground">{t("ai_analysis_high_risks_desc")}</p>
            </div>

            {/* Compliance */}
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 uppercase">
                    <ShieldCheck className="w-3 h-3" /> {t("ai_analysis_compliance")}
                  </span>
                  <Badge className="h-5 px-2 text-[10px] bg-indigo-500 hover:bg-indigo-600 border-none">{data.compliance_risks.length}</Badge>
               </div>
               <p className="text-[11px] text-muted-foreground">{t("ai_analysis_compliance_desc")}</p>
            </div>
         </div>

         <div className="p-5 rounded-2xl bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <ShieldAlert className="w-16 h-16" />
            </div>
            <div className="relative">
               <h4 className="text-sm font-bold opacity-70 mb-2">{t("ai_analysis_assessment_summary")}</h4>
               <p className="text-lg leading-relaxed">{data.summary}</p>
            </div>
         </div>
      </CardContent>
    </Card>
  );
};
