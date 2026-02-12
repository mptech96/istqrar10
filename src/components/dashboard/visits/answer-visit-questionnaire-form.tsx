/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Question } from "@/types/question";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { QuestionField } from "@/components/dashboard/question-field/question-field";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createAnswersSchema } from "@/schema/create-answer.schema.zod";
import { useAnswerQuestionnaireMutation } from "@/services/api/visits";
import { useLoader } from "@/hooks/use-loader";

interface VisitAnswersFormProps {
  questions: Question[];
  visitId: number;
}

export function VisitAnswersForm({
  questions,
  visitId,
}: VisitAnswersFormProps) {
  const { start, stop } = useLoader();

  const [
    answerQuestionnaire,
    { isLoading: isSubmittingAnswers },
  ] = useAnswerQuestionnaireMutation();
  const t = useTranslations();
  const [totalScore, setTotalScore] = useState<{
    score: number;
    maxScore: number;
  } | null>(null);

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
    const processedAnswers = answers.map(
      (answer, index) => {
        const question = questionsList[index];
        let score = 0;

        if (
          question.type === "multiple_choice" &&
          question.options
        ) {
          const selectedOption = question.options.find(
            (opt) => opt.value === answer.answer_value, // ✅ Changed
          );
          score = selectedOption
            ? Number(selectedOption.score)
            : 0;
        } else if (question.type === "rating") {
          score = Number(answer.answer_value); // ✅ Changed
        } else if (question.type === "yes_no") {
          score =
            answer.answer_value === "yes"
              ? question.max_score
              : 0; // ✅ Changed
        }

        currentScore += score;
        return { ...answer, score };
      },
    );

    const maxScore = questionsList.reduce(
      (acc, q) => acc + q.max_score,
      0,
    );

    return { processedAnswers, currentScore, maxScore };
  };
  // Generate dynamic schema
  const formSchema = createAnswersSchema(questions, t);
  type FormValues = z.infer<typeof formSchema>;

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: questions.map((question) => ({
        question_id: question.id,
        answer_value: undefined,
        comment: "",
        auditor_comment: "",
        corrective_action: "",
        corrective_deadline: "",
        attachments: [],
      })),
    },
  });

  // Reset form when questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      form.reset({
        answers: questions.map((question) => ({
          question_id: Number(question.id),
          answer: undefined,
          notes: "",
          attachments: [],
        })),
      });
    }
  }, [questions, form]);

  // Calculate progress
  const watchedAnswers = form.watch("answers");
  const answeredCount = watchedAnswers.filter(
    (answer) =>
      answer.answer_value !== undefined &&
      answer.answer_value !== "", // ✅ Changed
  ).length;
  const progress = (answeredCount / questions.length) * 100;

  // Handle form submission
  async function onSubmit(data: FormValues) {
    try {
      const { processedAnswers, currentScore, maxScore } =
        calculateTotalScores(data.answers, questions);

      setTotalScore({
        score: currentScore,
        maxScore: maxScore,
      });

      const formData = new FormData();
      processedAnswers.forEach((answer, index) => {
        formData.append(
          `answers[${index}][question_id]`,
          String(answer.question_id),
        );
        formData.append(
          `answers[${index}][answer_value]`, // ✅ Changed
          answer.answer_value ?? "",
        );
        if (answer.score !== undefined) {
          formData.append(
            `answers[${index}][score]`,
            String(answer.score),
          );
        }
        if (answer.comment) {
          // ✅ Changed
          formData.append(
            `answers[${index}][comment]`,
            answer.comment,
          );
        }
        if (answer.auditor_comment) {
          // ✅ Added
          formData.append(
            `answers[${index}][auditor_comment]`,
            answer.auditor_comment,
          );
        }
        if (answer.corrective_action) {
          // ✅ Added
          formData.append(
            `answers[${index}][corrective_action]`,
            answer.corrective_action,
          );
        }
        if (answer.corrective_deadline) {
          // ✅ Added
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
      });

      console.log("Submitting FormData entries:");
      for (const [key, value] of (
        formData as any
      ).entries()) {
        console.log(`${key}:`, value);
      }

      await answerQuestionnaire({
        visitId: Number(visitId),
        data: formData,
      }).unwrap();

      toast.success(
        t("your answers have been saved successfully"),
      );
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(t("an error occurred while saving"));
    } finally {
      stop();
    }
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

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t("progress")}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {answeredCount} {t("of")} {questions.length}{" "}
                {t("questions")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionField
              key={question.id}
              question={question}
              control={form.control}
              index={index}
            />
          ))}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 sticky bottom-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border shadow-lg ">
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
              // Save as draft logic
              toast.info(t("saved as draft"));
            }}
            size="lg"
          >
            <Save className="ml-2 h-5 w-5" />
            {t("save as draft")}
          </Button>
        </div>

        {/* Validation Summary */}
        {/* Validation Summary */}
        {/* Validation Summary - REMOVED */}
      </form>
    </Form>
  );
}
