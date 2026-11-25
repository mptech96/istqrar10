/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Question } from "@/types/question";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Paperclip, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionFieldProps {
  question: Question;
  control: Control<any>;
  index: number;
}

export function QuestionField({
  question,
  control,
  index,
}: QuestionFieldProps) {
  return (
    <Card className={cn("p-6 space-y-4", question.is_critical && "")}>
      {/* Question Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FormLabel className="text-lg font-semibold">
                {index + 1}. {question.question_text}
                {question.is_required && (
                  <span className="text-red-500 mr-1">*</span>
                )}
              </FormLabel>
            </div>

            {question.description && (
              <p className="text-sm text-muted-foreground">
                {question.description}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {question.is_critical && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {question.is_critical_text}
              </Badge>
            )}
            {question.has_attachment && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                مرفقات
              </Badge>
            )}
          </div>
        </div>

        {question.help_text && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">{question.help_text}</p>
          </div>
        )}

        {/* Score Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>الوزن: {question.weight}</span>
          <span>•</span>
          <span>الحد الأقصى: {question.max_score}</span>
          <span>•</span>
          <span>درجة النجاح: {question.passing_score}</span>
        </div>
      </div>

      {/* Question Input Based on Type */}
      {question.type === "yes_no" && (
        <YesNoField question={question} control={control} index={index} />
      )}

      {question.type === "multiple_choice" && (
        <MultipleChoiceField
          question={question}
          control={control}
          index={index}
        />
      )}

      {(question.type === "rating" || question.type === "scale_1_5") && (
        <RatingField question={question} control={control} index={index} />
      )}

      {question.type === "text" && (
        <TextField question={question} control={control} index={index} />
      )}

      {question.type === "number" && (
        <NumberField question={question} control={control} index={index} />
      )}

      {question.type === "date" && (
        <DateField question={question} control={control} index={index} />
      )}

      {/* Notes Field - ✅ Changed from 'notes' to 'comment' */}
      <FormField
        control={control}
        name={`answers.${index}.comment`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>ملاحظات (اختياري)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="أضف أي ملاحظات إضافية..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Attachment Field */}
      {question.has_attachment && (
        <FormField
          control={control}
          name={`answers.${index}.attachments`}
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>المرفقات</FormLabel>
              {question.attachment_instructions && (
                <FormDescription>
                  {question.attachment_instructions}
                </FormDescription>
              )}
              <FormControl>
                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const files = e.target.files;
                    onChange(files ? Array.from(files) : []);
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </Card>
  );
}

// Yes/No Field Component - ✅ Changed from 'answer' to 'answer_value'
function YesNoField({ question, control, index }: QuestionFieldProps) {
  return (
    <FormField
      control={control}
      name={`answers.${index}.answer_value`}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="yes" id={`q${question.id}-yes`} />
                <Label
                  htmlFor={`q${question.id}-yes`}
                  className="cursor-pointer"
                >
                  نعم
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="no" id={`q${question.id}-no`} />
                <Label
                  htmlFor={`q${question.id}-no`}
                  className="cursor-pointer"
                >
                  لا
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Multiple Choice Field Component - ✅ Changed from 'answer' to 'answer_value'
function MultipleChoiceField({ question, control, index }: QuestionFieldProps) {
  return (
    <FormField
      control={control}
      name={`answers.${index}.answer_value`}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="space-y-3"
            >
              {question.options?.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={cn(
                    "flex items-start space-x-3 space-x-reverse border rounded-lg p-4 transition-colors",
                    field.value === option.value &&
                      "border-primary bg-primary/5",
                  )}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`q${question.id}-opt${optionIndex}`}
                  />
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => field.onChange(option.value)}
                  >
                    <Label
                      htmlFor={`q${question.id}-opt${optionIndex}`}
                      className="cursor-pointer font-medium"
                    >
                      {option.value}
                    </Label>
                    {option.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    )}
                    <span className="text-xs text-primary mt-1 inline-block">
                      النقاط: {option.score}
                    </span>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Rating Field Component - Scale from 1 to 5 stars
function RatingField({ question, control, index }: QuestionFieldProps) {
  const maxScore = Number(question.max_score) || 5;
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <FormField
      control={control}
      name={`answers.${index}.answer_value`}
      render={({ field }) => {
        const selectedStars = Number(field.value) || 0;
        const displayStars = hoverRating ?? selectedStars;
        const calculatedScore =
          selectedStars > 0
            ? Math.round((selectedStars / 5) * maxScore * 100) / 100
            : 0;

        return (
          <FormItem>
            <FormControl>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => {
                  const isFilled = displayStars >= rating;
                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => field.onChange(rating)}
                      onMouseEnter={() => setHoverRating(rating)}
                      onMouseLeave={() => setHoverRating(null)}
                      className={cn(
                        "p-1 rounded-md transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer",
                        isFilled
                          ? "text-yellow-500"
                          : "text-gray-300 hover:text-yellow-300",
                      )}
                      aria-label={`${rating} من 5 نجوم`}
                    >
                      <Star
                        className="h-8 w-8"
                        fill={isFilled ? "currentColor" : "none"}
                      />
                    </button>
                  );
                })}
              </div>
            </FormControl>
            <FormDescription>
              {selectedStars > 0 ? (
                <span>
                  التقييم:{" "}
                  <span className="font-bold text-foreground">
                    {selectedStars}
                  </span>{" "}
                  من 5 نجوم
                  {" • "}
                  الدرجة المحسوبة:{" "}
                  <span className="font-bold text-primary">
                    {calculatedScore}
                  </span>{" "}
                  من {maxScore}
                </span>
              ) : (
                <span>
                  اختر تقييماً من 1 إلى 5 نجوم (الدرجة القصوى: {maxScore})
                </span>
              )}
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

// Text Field Component - ✅ Changed from 'answer' to 'answer_value'
function TextField({ question, control, index }: QuestionFieldProps) {
  return (
    <FormField
      control={control}
      name={`answers.${index}.answer_value`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea
              placeholder="اكتب إجابتك هنا..."
              className="resize-none min-h-[100px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Number Field Component - ✅ Changed from 'answer' to 'answer_value'
function NumberField({ question, control, index }: QuestionFieldProps) {
  return (
    <FormField
      control={control}
      name={`answers.${index}.answer_value`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input type="number" placeholder="أدخل رقم..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Date Field Component - ✅ Changed from 'answer' to 'answer_value'
function DateField({ question, control, index }: QuestionFieldProps) {
  return (
    <FormField
      control={control}
      name={`answers.${index}.answer_value`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input type="date" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
