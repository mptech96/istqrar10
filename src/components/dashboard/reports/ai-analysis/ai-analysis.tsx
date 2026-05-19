"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  useGetVisitAIAnalysisQuery,
  useCreateVisitAIAnalysisMutation,
} from "@/services/api/visits";
import { OverviewCard } from "./components/OverviewCard";
import { RootCausesAnalysisWidget } from "./components/RootCauses";
import { PredictiveStatsWidget } from "./components/PredictiveStats";
import { RecommendationsWidget } from "./components/Recommendations";
import { ActionPlanWidget } from "./components/ActionPlan";
import { RiskAssessmentWidget } from "./components/RiskAssessment";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useLoader } from "@/hooks/use-loader";

const AIAnalysisOverview = () => {
  const t = useTranslations();
  const params = useParams();
  const visitId = params.visitId as string;
  const { start, stop } = useLoader();
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetVisitAIAnalysisQuery(visitId);
  const [createAnalysis, { isLoading: isCreating }] =
    useCreateVisitAIAnalysisMutation();

  useEffect(() => {
    if (isLoading || isFetching || isCreating) {
      start();
    } else {
      stop();
    }
  }, [isLoading, isFetching, isCreating, start, stop]);

  const handleGenerate = async () => {
    try {
      await createAnalysis({
        id: visitId,
        data: {},
      }).unwrap();
      toast.success(t("ai_analysis_success_start"));
      // refetch is not strictly needed here if RTK Query tag invalidation works, but keeping it ensures UI update
      await refetch();
    } catch (error: any) {
      toast.error( error.data?.message || t("ai_analysis_error_start"));
    }
  };

  // We should wait for either the initial load, OR a refetch triggered by the mutation to complete
  const isFetchingData =
    isLoading || (isFetching && !response?.data);

  if (isFetchingData) {
    return (
      <div className="space-y-8 p-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-100 w-full rounded-2xl" />
      </div>
    );
  }

  // Only show the empty state if we are absolutely sure there is no data and we aren't currently fetching it
  if (!isFetchingData && (isError || !response?.data)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] mt-4 gap-6 p-8 border-2 border-dashed rounded-3xl bg-slate-50/50">
        <div className="p-4 rounded-full bg-primary/10">
          <Sparkles className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold italic">
            {t("ai_analysis_empty_title")}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("ai_analysis_empty_description")}
          </p>
        </div>
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={isCreating}
          className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20"
        >
          {isCreating ? (
            <RefreshCcw className="w-5 h-5 ml-2 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 ml-2" />
          )}
          {t("ai_analysis_generate_button")}
        </Button>
      </div>
    );
  }

  const analysis = response.data;

  return (
    <div className="space-y-12 pb-20 max-w-350 mx-auto  animate-in fade-in duration-700">
      {/* 1. Header & Summary */}
      <OverviewCard
        summary={analysis?.summary}
        metadata={
          analysis
            ? {
                processing_time_ms:
                  analysis.processing_time_ms,
                tokens_used: analysis.tokens_used,
                estimated_cost_usd:
                  analysis.estimated_cost_usd,
                generated_at: analysis.created_at,
              }
            : undefined
        }
      />

      {/* 2. Predictive & Comparative Stats */}
      <PredictiveStatsWidget
        predictive={analysis?.full_analysis?.predictive}
        comparative={analysis?.full_analysis?.comparative}
      />

      {/* 4. Recommendations & Quick Wins */}
      <div className="grid gap-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">
              {t("ai_analysis_recommendations_title")}
            </h2>
          </div>
          <RecommendationsWidget
            data={
              analysis?.full_analysis?.recommendations ||
              analysis?.recommendations
            }
          />
        </section>

        {/* 3. Root Cause Analysis */}
        <section>
          <RootCausesAnalysisWidget
            data={analysis?.full_analysis?.root_cause}
          />
        </section>

        {/* 5. Action Plan Timeline */}
        <section>
          <ActionPlanWidget
            data={
              analysis?.full_analysis?.action_plan ||
              analysis?.action_plan
            }
          />
        </section>

        {/* 6. Risk Assessment Widget */}
        <section>
          <RiskAssessmentWidget
            data={
              analysis?.full_analysis?.risk_assessment ||
              analysis?.risks
            }
          />
        </section>
      </div>

      {/* Refetch Trigger */}
      <div className="fixed bottom-20 left-8">
        <Button
          variant="outline"
          size="icon"
          onClick={handleGenerate}
          disabled={isCreating}
          className="h-14 w-14 rounded-full shadow-2xl bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-white"
        >
          <RefreshCcw
            className={`w-6 h-6 text-primary ${isCreating ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
    </div>
  );
};

export default AIAnalysisOverview;
