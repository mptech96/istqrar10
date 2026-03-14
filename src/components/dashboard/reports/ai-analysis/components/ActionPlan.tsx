import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ActionPlan } from "@/types/ai-analysis";
import { ListTodo, Milestone, ArrowRight, User, Timer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

interface Props {
  data: ActionPlan;
}

export const ActionPlanWidget: React.FC<Props> = ({ data }) => {
  const t = useTranslations();
  if (!data) return null;
  return (
    <Card className="shadow-lg border-primary/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">{t("ai_analysis_action_plan_title")}</CardTitle>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center gap-2">
            <Timer className="w-3 h-3" /> {t("ai_analysis_expected_duration")} {data.estimated_timeline}
          </div>
        </div>
        <CardDescription>{t("ai_analysis_action_plan_desc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Timeline Tasks */}
        <div className="relative border-r-2 border-primary/20 mr-4 pr-8 space-y-8">
          {data.tasks.map((task, idx) => (
            <div key={idx} className="relative">
              {/* Dot */}
              <div className="absolute top-1 -right-10.75 w-5 h-5 rounded-full border-4 border-white bg-primary shadow-sm" />
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-lg">{task.task}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                    task.priority === 'high' ? 'bg-rose-500 text-white' : 
                    task.priority === 'medium' ? 'bg-amber-500 text-white' : 'bg-slate-500 text-white'
                  }`}>
                    {task.priority === 'high' ? t("ai_analysis_high_priority").replace(/أولوية |priority /i, '') : task.priority === 'medium' ? t("ai_analysis_medium_priority").replace(/أولوية |priority /i, '') : t("ai_analysis_low_priority").replace(/أولوية |priority /i, '')}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                   <div className="flex items-center gap-2">
                     <User className="w-3 h-3" />
                     <span>{t("ai_analysis_responsible")} <span className="text-foreground">{task.responsible}</span></span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Timer className="w-3 h-3" />
                     <span>{t("ai_analysis_timeline")} <span className="text-foreground">{task.timeline}</span></span>
                   </div>
                </div>

                {/* Success Criteria Related Task */}
                {data.success_criteria.find(s => s.task === task.task) && (
                   <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 italic text-[11px] text-slate-600">
                      {t("ai_analysis_success_criteria")} {data.success_criteria.find(s => s.task === task.task)?.criteria}
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Milestones */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Milestone className="w-4 h-4 text-indigo-500" /> {t("ai_analysis_milestones")}
            </h4>
            <div className="space-y-3">
              {data.milestones.map((ms, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-indigo-50/50 border border-indigo-100">
                  <span className="text-sm font-medium">{ms.milestone}</span>
                  <span className="text-[10px] text-indigo-600 font-bold">{ms.timeline}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold flex items-center gap-2 mb-4">
              <ArrowRight className="w-4 h-4 text-emerald-500" /> {t("ai_analysis_review_points")}
            </h4>
            <div className="space-y-2">
              {data.review_points.map((rp, idx) => (
                <div key={idx} className="text-xs p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                   • {rp.point} <span className="text-muted-foreground opacity-70">({rp.timeline})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
