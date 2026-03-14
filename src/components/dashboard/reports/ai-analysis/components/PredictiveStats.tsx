import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PredictiveAnalysis, ComparativeAnalysis } from "@/types/ai-analysis";
import { TrendingUp, TrendingDown, Target, Award, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface Props {
  predictive: PredictiveAnalysis;
  comparative: ComparativeAnalysis;
}

export const PredictiveStatsWidget: React.FC<Props> = ({ predictive, comparative }) => {
  const t = useTranslations();
  if (!predictive || !comparative) return null;
  const isPositive = predictive.improvement_potential > 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Forecast Card */}
      <Card className="relative overflow-hidden border-none shadow-xl bg-linear-to-br from-indigo-600 to-indigo-800 text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingUp className="w-24 h-24" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-indigo-100/80 text-sm font-medium">{t("ai_analysis_predictive_score_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-5xl font-bold tracking-tight">{predictive.forecast_next_score.toFixed(1)}</span>
            <span className="text-xl opacity-80 mb-1">%</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/10">
            <div className={`p-1 rounded ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3 text-white" /> : <TrendingDown className="w-3 h-3 text-white" />}
            </div>
            <span className="text-xs font-medium">
              {t("ai_analysis_improvement_potential")} <span className="text-emerald-300">+{predictive.improvement_potential}</span> {t("ai_analysis_point")}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
             <div className="flex justify-between text-[10px] opacity-70">
                <span>{t("ai_analysis_confidence_interval")} {predictive.confidence_interval[0]}%</span>
                <span>{predictive.confidence_interval[1]}%</span>
             </div>
             <Progress value={predictive.forecast_next_score} className="h-1.5 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Ranking Card */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">{t("ai_analysis_ranking_comparison")}</CardTitle>
          <Target className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
               <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{comparative.ranking}</p>
              <p className="text-xs text-muted-foreground">{t("ai_analysis_peer_comparison")}</p>
            </div>
          </div>
          
          <div className="space-y-3">
             {comparative.weaknesses_vs_peers.map((item, idx) => (
               <div key={idx} className="flex items-start gap-2">
                 <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                 <p className="text-xs text-muted-foreground leading-tight">{item}</p>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors & Warnings */}
      <Card className="shadow-lg border-l-4 border-l-amber-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> {t("ai_analysis_risks_warnings")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {predictive.risk_factors.map((factor, idx) => (
              <Badge key={idx} variant="outline" className="bg-amber-50/50 border-amber-200 text-amber-700 text-[10px]">
                {factor}
              </Badge>
            ))}
          </div>
          <div className="space-y-2">
            {predictive.critical_warnings.map((warn, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-rose-50 border border-rose-100">
                <p className="text-xs text-rose-700 leading-relaxed font-medium">
                  {warn}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
