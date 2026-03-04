import * as z from "zod";

export const createAnswersSchema = () =>
  z.object({
    answers: z.array(
      z.object({
        question_id: z.number(),
        answer_value: z.any().optional(),
        score: z.number().optional(),
        comment: z.string().optional(),
        auditor_comment: z.string().optional(),
        corrective_action: z.string().optional(),
        corrective_deadline: z.string().optional(),
        attachments: z.array(z.any()).optional(),
      })
    ),
  });