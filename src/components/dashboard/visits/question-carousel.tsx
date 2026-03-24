/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Question } from "@/types/question";
import { QuestionField } from "@/components/dashboard/question-field/question-field";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useCallback, useState } from "react";
import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

interface QuestionCarouselProps {
  currentQuestions: Question[];
  currentPageIndex: number;
  totalPages: number;
  allQuestions: Question[];
  totalQuestions: number;
  isLoadingMore: boolean;
  goNext: () => void;
  goPrev: () => void;
  goTo: (index: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
  progress: number;
  direction: "next" | "prev";
  control: Control<any>;
  watchedAnswers: any[];
}

export function QuestionCarousel({
  currentQuestions,
  currentPageIndex,
  totalPages,
  allQuestions,
  totalQuestions,
  isLoadingMore,
  goNext,
  goPrev,
  goTo,
  hasNext,
  hasPrev,
  progress,
  direction,
  control,
  watchedAnswers,
}: QuestionCarouselProps) {
  const t = useTranslations();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(true);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && hasPrev) {
        // RTL: right arrow = previous
        goPrev();
      } else if (e.key === "ArrowLeft" && hasNext) {
        // RTL: left arrow = next
        goNext();
      }
    },
    [goNext, goPrev, hasNext, hasPrev],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Animate slide transition
  useEffect(() => {
    setShowContent(false);
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setShowContent(true);
      setIsAnimating(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [currentPageIndex, direction]);

  // Count answered questions
  const answeredCount =
    watchedAnswers?.filter(
      (answer: any) =>
        answer?.answer_value !== undefined &&
        answer?.answer_value !== "",
    ).length ?? 0;

  // Check if current page is answered (all questions on current page)
  const isCurrentPageAnswered = currentQuestions.every((q) => {
    const qIndex = allQuestions.findIndex((aq) => aq.id === q.id);
    const answer = watchedAnswers?.[qIndex];
    return (
      answer?.answer_value !== undefined && answer?.answer_value !== ""
    );
  });

  if (currentQuestions.length === 0) {
    return (
      <Card className="p-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  const QUESTIONS_PER_PAGE = 10;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">
                {t("progress")}
              </span>
              <Badge
                variant={
                  isCurrentPageAnswered
                    ? "default"
                    : "secondary"
                }
                className="text-xs"
              >
                {isCurrentPageAnswered
                  ? t("Answers Complete")
                  : t("Incomplete Page")}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal text-muted-foreground">
                {answeredCount} {t("of")} {totalQuestions}{" "}
                {t("questions")}
              </span>
              {isLoadingMore && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Progress value={progress} className="h-2" />
          {/* Page dots/pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const startIdx = idx * QUESTIONS_PER_PAGE;
              const endIdx = Math.min((idx + 1) * QUESTIONS_PER_PAGE, totalQuestions);
              
              const pageQuestions = allQuestions.slice(startIdx, endIdx);
              const isPageComplete = pageQuestions.length > 0 && pageQuestions.every((q, pIdx) => {
                const globalIdx = startIdx + pIdx;
                const answer = watchedAnswers?.[globalIdx];
                return answer?.answer_value !== undefined && answer?.answer_value !== "";
              });
              
              const isCurrent = idx === currentPageIndex;
              const isLoaded = startIdx < allQuestions.length;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo(idx)}
                  disabled={!isLoaded && idx > 0}
                  className={cn(
                    "w-7 h-7 rounded-full text-xs font-medium transition-all duration-200 border-2",
                    isCurrent
                      ? "border-primary bg-primary text-primary-foreground scale-110 shadow-md"
                      : isPageComplete && isLoaded
                        ? "border-green-500 bg-green-500/10 text-green-700 hover:bg-green-500/20"
                        : "border-muted-foreground/20 bg-muted/50 text-muted-foreground hover:border-muted-foreground/40",
                    !isLoaded && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Question Range Counter */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium text-muted-foreground">
          {t("Questions")} {currentPageIndex * QUESTIONS_PER_PAGE + 1} -{" "}
          {Math.min((currentPageIndex + 1) * QUESTIONS_PER_PAGE, totalQuestions)} /{" "}
          {totalQuestions}
        </span>
        <span className="text-sm text-muted-foreground">
          {t("Page")} {currentPageIndex + 1} {t("of")} {totalPages}
        </span>
      </div>

      {/* Carousel Content */}
      <div className="relative overflow-hidden">
        <div
          className={cn(
            "transition-all duration-200 ease-in-out space-y-8",
            !showContent &&
              direction === "next" &&
              "opacity-0 -translate-x-4",
            !showContent &&
              direction === "prev" &&
              "opacity-0 translate-x-4",
            showContent && "opacity-100 translate-x-0",
          )}
        >
          {currentQuestions.map((question, idx) => {
            const globalIndex = currentPageIndex * QUESTIONS_PER_PAGE + idx;
            return (
              <div key={question.id} className="pb-6 border-b last:border-0">
                <QuestionField
                  question={question}
                  control={control}
                  index={globalIndex}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 sticky bottom-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 p-4 rounded-lg border shadow-lg">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={goPrev}
          disabled={!hasPrev || isAnimating}
          className="flex-1 max-w-50 gap-2 cursor-pointer"
        >
          <ChevronRight className="h-5 w-5" />
          {t("Previous")}
        </Button>

        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span>{currentPageIndex + 1}</span>
          <span>/</span>
          <span>{totalPages}</span>
        </div>

        <Button
          type="button"
          variant={hasNext ? "default" : "outline"}
          size="lg"
          onClick={goNext}
          disabled={!hasNext || isAnimating}
          className="flex-1 max-w-50 gap-2 cursor-pointer"
        >
          {isLoadingMore &&
          (currentPageIndex + 1) * QUESTIONS_PER_PAGE >= allQuestions.length - 2 ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {t("Next")}
              <ChevronLeft className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
