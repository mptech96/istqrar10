import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecommendationsAnalysis } from "@/types/ai-analysis";
import { Zap, Clock, Calendar, CheckSquare, Target, Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  data: RecommendationsAnalysis;
}

const PriorityBadge = ({ priority }: { priority: string }) => {
  const t = useTranslations();
  const styles = {
    high: "bg-rose-100 text-rose-700 border-rose-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  }[priority] || "bg-gray-100 text-gray-700";

  return (
    <Badge variant="outline" className={`${styles} text-[10px] px-2 capitalize`}>
      {priority === 'high' ? t("ai_analysis_high_priority") : priority === 'medium' ? t("ai_analysis_medium_priority") : t("ai_analysis_low_priority")}
    </Badge>
  );
};

export const RecommendationsWidget: React.FC<Props> = ({ data }) => {
  const t = useTranslations();
  if (!data) return null;
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Wins */}
        <Card className="border-emerald-200 shadow-md bg-emerald-50/10">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              <CardTitle className="text-lg">{t("ai_analysis_quick_wins_title")}</CardTitle>
            </div>
            <CardDescription className="text-emerald-700/70 text-xs">{t("ai_analysis_quick_wins_desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.quick_wins.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-emerald-100 shadow-sm">
                <div className="space-y-1 flex-1">
                   <p className="text-sm font-semibold">{item.task}</p>
                   <div className="flex flex-wrap items-center gap-2 mt-2">
                     <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 hover:bg-emerald-200">{t("ai_analysis_effort")} {item.effort === 'low' ? t("ai_analysis_low_priority").replace(/أولوية |priority /i, '') : item.effort}</Badge>
                     <Badge variant="secondary" className="text-[10px] bg-indigo-100 text-indigo-700 hover:bg-indigo-200">{t("ai_analysis_impact")} {item.impact === 'high' ? t("ai_analysis_high_priority").replace(/أولوية |priority /i, '') : item.impact}</Badge>
                     <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                       <Clock className="w-3 h-3" /> {item.timeline}
                     </span>
                   </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Immediate Actions */}
        <Card className="shadow-md border-rose-200 bg-rose-50/10">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-rose-600" />
              <CardTitle className="text-lg">{t("ai_analysis_immediate_actions")}</CardTitle>
            </div>
            <CardDescription className="text-rose-700/70 text-xs">{t("ai_analysis_immediate_actions_desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {data.immediate_actions.map((item, idx) => (
               <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-rose-100 bg-white shadow-sm">
                 <div className="flex-1">
                   <p className="text-sm font-medium mb-2">{item.task}</p>
                   <div className="flex items-center gap-3">
                     <PriorityBadge priority={item.priority} />
                     <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {item.timeline}
                     </span>
                   </div>
                 </div>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         {/* Short Term */}
         <Card className="shadow-sm">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm flex items-center gap-2">
               <Target className="w-4 h-4 text-blue-500" /> {t("ai_analysis_short_term")}
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-3">
              {data.short_term.map((item, idx) => (
                <div key={idx} className="text-xs text-muted-foreground border-r-2 border-blue-500 pr-2">
                   {item.task}
                </div>
              ))}
           </CardContent>
         </Card>

         {/* Long Term */}
         <Card className="shadow-sm">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm flex items-center gap-2">
               <Clock className="w-4 h-4 text-slate-500" /> {t("ai_analysis_long_term")}
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-3">
              {data.long_term.map((item, idx) => (
                <div key={idx} className="text-xs text-muted-foreground border-r-2 border-slate-500 pr-2">
                   {item.task}
                </div>
              ))}
           </CardContent>
         </Card>

         {/* Training/Process */}
         <Card className="shadow-sm border-indigo-100 bg-indigo-50/5">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm flex items-center gap-2">
               <Lightbulb className="w-4 h-4 text-indigo-500" /> {t("ai_analysis_procedural_improvements")}
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-3">
              {data.training_needs.map((item, idx) => (
                <div key={idx} className="text-xs text-muted-foreground flex flex-col gap-1">
                   <span className="font-medium text-indigo-900">{item.task}</span>
                   <span className="opacity-70">{t("ai_analysis_responsible")} {item.responsible_person}</span>
                </div>
              ))}
           </CardContent>
         </Card>
      </div>
    </div>
  );
};
