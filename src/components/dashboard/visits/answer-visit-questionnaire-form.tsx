/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Question } from "@/types/question";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { CheckCircle2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createAnswersSchema } from "@/schema/create-answer.schema.zod";
import { useAnswerQuestionnaireMutation } from "@/services/api/visits";
import { useLoader } from "@/hooks/use-loader";
import { useParams } from "next/navigation";
import { useQuestionCarousel } from "@/hooks/use-question-carousel";
import { QuestionCarousel } from "./question-carousel";

export function VisitAnswersForm() {
  const { start, stop } = useLoader();
  const { visitId } = useParams();
  const t = useTranslations();

  const carousel = useQuestionCarousel(Number(visitId));

  const [
    answerQuestionnaire,
    { isLoading: isSubmittingAnswers },
  ] = useAnswerQuestionnaireMutation();

  const [totalScore, setTotalScore] = useState<{
    score: number;
    maxScore: number;
  } | null>(null);

  useEffect(() => {
    if (carousel.isLoading) {
      start();
    } else {
      stop();
    }
  }, [carousel.isLoading, start, stop]);

  useEffect(() => {
    if (isSubmittingAnswers) {
      start();
    } else {
      stop();
    }
  }, [isSubmittingAnswers, start, stop]);

  // Score calculation helper
  const calculateTotalScores = (
    answers: any[],
    questionsList: Question[],
  ) => {
    let currentScore = 0;
    const processedAnswers = answers.map((answer) => {
      const question = questionsList.find(
        (q) => q.id === answer.question_id,
      );
      if (!question) return { ...answer, score: 0 };

      let score = 0;
      if (
        question.type === "multiple_choice" &&
        question.options
      ) {
        const selectedOption = question.options.find(
          (opt) => opt.value === answer.answer_value,
        );
        score = selectedOption
          ? Number(selectedOption.score)
          : 0;
      } else if (question.type === "rating") {
        score = Number(answer.answer_value);
      } else if (question.type === "yes_no") {
        score =
          answer.answer_value === "yes"
            ? question.max_score
            : 0;
      }

      currentScore += score;
      return { ...answer, score };
    });

    const maxScore = questionsList.reduce(
      (acc, q) => acc + q.max_score,
      0,
    );

    return { processedAnswers, currentScore, maxScore };
  };

  // Schema
  const formSchema = createAnswersSchema();
  type FormValues = z.infer<typeof formSchema>;

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    shouldUnregister: false,
    defaultValues: {
      answers: [],
    },
  });

  // Update form answers array when new questions are loaded
  useEffect(() => {
    if (carousel.allQuestions.length > 0) {
      const currentAnswers =
        form.getValues("answers") || [];
      const existingIds = new Set(
        currentAnswers.map((a: any) => a?.question_id),
      );

      carousel.allQuestions.forEach((question, index) => {
        if (!existingIds.has(question.id)) {
          form.setValue(
            `answers.${index}`,
            {
              question_id: question.id,
              answer_value: undefined,
              comment: "",
              auditor_comment: "",
              corrective_action: "",
              corrective_deadline: "",
              attachments: [],
            },
            { shouldDirty: false },
          );
        }
      });
    }
  }, [carousel.allQuestions, form]);

  // Watch answers for progress and carousel
  const watchedAnswers = form.watch("answers");

  // Validate current question before allowing Next navigation
  const validateCurrentQuestion = (): boolean => {
    if (!carousel.currentQuestion) return true;
    const question = carousel.currentQuestion;
    const answer = watchedAnswers?.[carousel.currentIndex];
    if (
      question.is_required &&
      (!answer?.answer_value || answer.answer_value === "")
    ) {
      toast.error(
        `${t("Answer is required")}: ${question.question_text}`,
      );
      return false;
    }
    return true;
  };

  // Wrapped goNext that validates before navigating
  const handleGoNext = () => {
    if (validateCurrentQuestion()) {
      carousel.goNext();
    }
  };

  // Count answered across all loaded questions
  const answeredCount =
    watchedAnswers?.filter(
      (answer: any) =>
        answer?.answer_value !== undefined &&
        answer?.answer_value !== "",
    ).length ?? 0;

  const overallProgress =
    carousel.totalQuestions > 0
      ? (answeredCount / carousel.totalQuestions) * 100
      : 0;

  // Validate required questions at submit time
  const validateRequired = (): string[] => {
    const errors: string[] = [];
    carousel.allQuestions.forEach((question, index) => {
      if (question.is_required) {
        const answer = watchedAnswers?.[index];
        if (
          !answer?.answer_value ||
          answer.answer_value === ""
        ) {
          errors.push(
            `${t("Question")} ${index + 1}: ${question.question_text}`,
          );
        }
      }
    });
    return errors;
  };

  // Handle form submission
  async function onSubmit(data: FormValues) {
    // Validate required questions
    const requiredErrors = validateRequired();
    if (requiredErrors.length > 0) {
      toast.error(
        `${t("Please answer all required questions")}:\n${requiredErrors.slice(0, 3).join("\n")}${requiredErrors.length > 3 ? `\n...${t("and")} ${requiredErrors.length - 3} ${t("more")}` : ""}`,
      );
      return;
    }

    try {
      const { processedAnswers, currentScore, maxScore } =
        calculateTotalScores(
          data.answers.filter(
            (a: any) =>
              a.answer_value !== undefined &&
              a.answer_value !== "",
          ),
          carousel.allQuestions,
        );

      setTotalScore({
        score: currentScore,
        maxScore: maxScore,
      });

      const formData = new FormData();
      processedAnswers.forEach(
        (answer: any, index: number) => {
          formData.append(
            `answers[${index}][question_id]`,
            String(answer.question_id),
          );
          formData.append(
            `answers[${index}][answer_value]`,
            answer.answer_value ?? "",
          );
          if (answer.score !== undefined) {
            formData.append(
              `answers[${index}][score]`,
              String(answer.score),
            );
          }
          if (answer.comment) {
            formData.append(
              `answers[${index}][comment]`,
              answer.comment,
            );
          }
          if (answer.auditor_comment) {
            formData.append(
              `answers[${index}][auditor_comment]`,
              answer.auditor_comment,
            );
          }
          if (answer.corrective_action) {
            formData.append(
              `answers[${index}][corrective_action]`,
              answer.corrective_action,
            );
          }
          if (answer.corrective_deadline) {
            formData.append(
              `answers[${index}][corrective_deadline]`,
              answer.corrective_deadline,
            );
          }

          if (
            answer.attachments &&
            Array.isArray(answer.attachments)
          ) {
            answer.attachments.forEach(
              (file: any, fileIndex: number) => {
                formData.append(
                  `answers[${index}][attachments][${fileIndex}]`,
                  file,
                );
              },
            );
          }
        },
      );

      await answerQuestionnaire({
        visitId: Number(visitId),
        data: formData,
      }).unwrap();

      toast.success(
        t("your answers have been saved successfully"),
      );
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          t("an error occurred while saving"),
      );
    } finally {
      stop();
    }
  }

  if (carousel.isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Validation Errors:", errors);
        })}
        className="space-y-6"
      >
        {/* Score Card */}
        {totalScore !== null && (
          <Card className="bg-green-500/10 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-primary">
                <span>{t("Total Score")}</span>
                <span className="text-2xl font-bold">
                  {totalScore.score} / {totalScore.maxScore}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={
                  (totalScore.score / totalScore.maxScore) *
                  100
                }
                className="h-3"
              />
            </CardContent>
          </Card>
        )}

        {/* Carousel */}
        <QuestionCarousel
          currentQuestion={carousel.currentQuestion}
          currentIndex={carousel.currentIndex}
          allQuestions={carousel.allQuestions}
          totalQuestions={carousel.totalQuestions}
          isLoadingMore={carousel.isLoadingMore}
          goNext={handleGoNext}
          goPrev={carousel.goPrev}
          goTo={carousel.goTo}
          hasNext={carousel.hasNext}
          hasPrev={carousel.hasPrev}
          progress={overallProgress}
          direction={carousel.direction}
          control={form.control}
          watchedAnswers={watchedAnswers}
        />

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 cursor-pointer"
            size="lg"
          >
            {isSubmittingAnswers ? (
              t("saving")
            ) : (
              <>
                <CheckCircle2 className="ml-2 h-5 w-5" />
                {t("send answers")}
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              toast.info(t("saved as draft"));
            }}
            size="lg"
          >
            <Save className="ml-2 h-5 w-5" />
            {t("save as draft")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
