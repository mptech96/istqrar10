/* eslint-disable @typescript-eslint/no-explicit-any */
import { Question } from "@/types/question";
import * as z from "zod";

export const createAnswersSchema = (questions: Question[], t: any) =>
  z.object({
    answers: z.tuple(
      questions.map((question) => {
        let answerSchema: z.ZodTypeAny = z.any();
        
        if (question.type === "multiple_choice" || question.type === "yes_no") {
          answerSchema = z.string().optional();
        } else if (question.type === "rating" || question.type === "number") {
          answerSchema = z.union([z.number(), z.string()]).optional();
        } else if (question.type === "text" || question.type === "date") {
          answerSchema = z.string().optional();
        }
        
        if (question.is_required) {
          answerSchema = answerSchema.refine(
            (val: any) =>
              val !== undefined && val !== null && val !== "",
            {
              message: t("Answer is required"),
            },
          );
        } else {
          answerSchema = answerSchema.optional().nullable();
        }
        
        if (question.type === "rating") {
          answerSchema = answerSchema.refine(
            (val: any) => {
              if (!val) return true;
              const num = Number(val);
              return num >= 1 && num <= question.max_score;
            },
            {
              message: t(
                `Answer must be between 1 and ${question.max_score}`,
              ),
            },
          );
        }
        
        return z.object({
          question_id: z.coerce.number(),
          answer_value: answerSchema, // ✅ Changed from 'answer' to 'answer_value'
          score: z.number().optional(),
          comment: z.string().optional(), // ✅ Changed from 'notes' to 'comment'
          auditor_comment: z.string().optional(), // ✅ Added
          corrective_action: z.string().optional(), // ✅ Added
          corrective_deadline: z.string().optional(), // ✅ Added (could be z.date() if needed)
          attachments: z.array(z.any()).optional(),
        });
      }) as any,
    ),
  });