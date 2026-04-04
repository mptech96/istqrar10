"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CriterionScore } from "@/types/visit-report";
import { useTranslations } from "next-intl";

interface CriteriaScoreCardProps {
  score: CriterionScore;
}

const CriteriaScoreCard: React.FC<
  CriteriaScoreCardProps
> = ({ score }) => {
  const t = useTranslations();

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-muted/30">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-sm font-bold leading-tight">
            {score.criteria_name}
          </CardTitle>
          <Badge
            style={{
              backgroundColor: `${score.level_color}20`, // 20% opacity for background
              color: score.level_color,
              borderColor: score.level_color,
            }}
            className="border"
          >
            {score.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">
              {t("Percentage")}
            </span>
            <span style={{ color: score.level_color }}>
              {score.percentage}%
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full transition-all"
              style={{
                width: `${score.percentage}%`,
                backgroundColor: score.level_color,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              {t("Earned vs Possible")}
            </span>
            <span className="text-sm font-bold">
              {score.earned_points} /{" "}
              {score.possible_points}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              {t("Weight")}
            </span>
            <span className="text-sm font-bold">
              {score.weight}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriteriaScoreCard;
