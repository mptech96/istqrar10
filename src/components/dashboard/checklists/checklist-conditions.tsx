"use client";

import React from "react";
import { useGetAllConditionsQuery } from "@/services/api/conditions";
import { Checklist } from "@/types/checklist";
import { Question } from "@/types/question";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAppSelector } from "@/lib/store";
import ConditionModel from "@/components/models/condition-model";

export const ChecklistConditions = ({
  checklist,
}: {
  checklist: Checklist;
}) => {
  const { data, isLoading, error } =
    useGetAllConditionsQuery({ checklistId: checklist.id });
  const t = useTranslations();
  const { language } = useAppSelector(
    (state) => state.settings,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-destructive bg-destructive/10 rounded-lg">
        Failed to load conditions.
      </div>
    );
  }

  const conditions: Question[] = Array.isArray(data)
    ? data
    : data?.data || [];

  if (conditions.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground bg-muted rounded-lg border border-border">
        No conditions found for this checklist.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {conditions.map((condition, conditionIndex) => (
        <div
          key={condition.id}
          className="space-y-6 pt-6 border-t first:border-t-0 first:pt-0"
        >
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">
              {conditionIndex + 1}
            </span>
            {condition.question_text ||
              `Condition ${conditionIndex + 1}`}
            <div className="ml-auto">
              <ConditionModel condition={condition} />
            </div>
          </h4>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Basic Information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Checklist")}
                  </label>
                  <Input
                    readOnly
                    value={checklist.name}
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Criteria")}
                  </label>
                  <Input
                    readOnly
                    value={
                      condition.criteria_id?.toString() ||
                      "-"
                    }
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("Question Text")}
                </label>
                <Textarea
                  readOnly
                  value={condition.question_text}
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("Basic description")}
                </label>
                <Textarea
                  readOnly
                  value={condition.description || ""}
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("Help Text")}
                </label>
                <Input
                  readOnly
                  value={condition.help_text || ""}
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("Question Type")}
                </label>
                <Input
                  readOnly
                  value={
                    condition.type_text ||
                    condition.type ||
                    "-"
                  }
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          {condition.options &&
            condition.options.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("Options")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {condition.options.map(
                    (option, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg space-y-4"
                      >
                        <h4 className="font-medium">
                          {t("Option")} {index + 1}
                        </h4>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t("Value")}
                          </label>
                          <Input
                            readOnly
                            value={option.value}
                            className="bg-muted"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t("Points")}
                          </label>
                          <Input
                            readOnly
                            value={option.score}
                            className="bg-muted"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t("Basic description")}
                          </label>
                          <Input
                            readOnly
                            value={option.description || ""}
                            className="bg-muted"
                          />
                        </div>
                      </div>
                    ),
                  )}
                </CardContent>
              </Card>
            )}

          {/* Scoring & Validation */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Scoring & Validation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("Correct Answer")}
                </label>
                <Input
                  readOnly
                  value={condition.correct_answer || ""}
                  className="bg-muted"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Weight")}
                  </label>
                  <Input
                    readOnly
                    value={condition.weight || 0}
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Max Points")}
                  </label>
                  <Input
                    readOnly
                    value={condition.max_score || 0}
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Passing Score")}
                  </label>
                  <Input
                    readOnly
                    value={condition.passing_score || 0}
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("Sort Order")}
                </label>
                <Input
                  readOnly
                  value={condition.sort_order || 0}
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>

          {/* Attachment Settings */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Attachment Settings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">
                    {t("Allow Attachments")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("User can attach files")}
                  </div>
                </div>
                <Switch
                  disabled
                  checked={condition.has_attachment}
                />
              </div>

              {condition.has_attachment && (
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">
                    {t("Attachment Instructions")}
                  </label>
                  <Textarea
                    readOnly
                    value={
                      condition.attachment_instructions ||
                      ""
                    }
                    className="bg-muted"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status & Flags */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Status & Flags")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">
                    {t("Required Question")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("User must answer this question")}
                  </div>
                </div>
                <Switch
                  disabled
                  checked={condition.is_required}
                />
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">
                    {t("Critical Question")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("Is this question critical?")}
                  </div>
                </div>
                <Switch
                  disabled
                  checked={condition.is_critical}
                />
              </div>

              <div
                dir={language === "ar" ? "rtl" : "ltr"}
                className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30"
              >
                <div className="space-y-0.5">
                  <div className="text-base font-medium">
                    {t("Active")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("Is this question active?")}
                  </div>
                </div>
                <Switch
                  disabled
                  checked={condition.is_active}
                  dir={language === "ar" ? "rtl" : "ltr"}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
