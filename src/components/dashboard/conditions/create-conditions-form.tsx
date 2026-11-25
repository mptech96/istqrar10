/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VirtualSelect } from "@/components/virtual-select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { createConditionSchema } from "@/schema/create-condition.schema.zod";
import { useTranslations } from "next-intl";
import {
  useCreateConditionMutation,
  useUpdateConditionMutation,
} from "@/services/api/conditions";
import { useGetCriteriaSelectInfiniteQuery } from "@/services/api/criteria";
import { Criteria } from "@/types/criteria";
import { useGetChecklistsSelectInfiniteQuery } from "@/services/api/checklists";
import { toast } from "sonner";
import { useEffect } from "react";
import { useLoader } from "@/hooks/use-loader";
import { Checklist } from "@/types/checklist";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store";

import { Question } from "@/types/question";

interface CreateConditionsFormProps {
  initialData?: Question;
  onSuccess?: () => void;
  hideCardWrapper?: boolean;
}

export function CreateConditionsForm({
  initialData,
  onSuccess,
  hideCardWrapper = false,
}: CreateConditionsFormProps) {
  const [createCondition, { isLoading: isCreating }] =
    useCreateConditionMutation();
  const [updateCondition, { isLoading: isUpdating }] =
    useUpdateConditionMutation();
  console.log("qustion", initialData);
  const isEditMode = !!initialData;
  const isLoading = isCreating || isUpdating;
  const { language } = useAppSelector((state) => state.settings);

  const router = useRouter();
  const t = useTranslations();
  const { start, stop } = useLoader();

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isLoading, start, stop]);
  const form = useForm<z.infer<ReturnType<typeof createConditionSchema>>>({
    resolver: zodResolver(createConditionSchema(t)) as Resolver<
      z.infer<ReturnType<typeof createConditionSchema>>
    >,
    defaultValues: initialData
      ? {
          checklist_id: initialData.checklist_id,
          criteria_id: initialData.criteria_id,
          question_text: initialData.question_text,
          description: initialData.description || "",
          help_text: initialData.help_text || "",
          type: initialData.type,
          options: initialData.options?.length
            ? initialData.options.map((opt) => ({
                value: opt.value,
                score: Number(opt.score),
                description: opt.description || "",
              }))
            : [{ value: "", score: 0, description: "" }],
          correct_answer: initialData.correct_answer || "",
          weight: initialData.weight || 1,
          max_score: initialData.max_score,
          passing_score: initialData.passing_score,
          is_required: initialData.is_required,
          is_critical: initialData.is_critical,
          has_attachment: initialData.has_attachment,
          attachment_instructions: initialData.attachment_instructions || "",
          sort_order: initialData.sort_order,
          is_active: initialData.is_active,
        }
      : {
          checklist_id: undefined,
          criteria_id: undefined,
          question_text: "",
          description: "",
          help_text: "",
          type: "yes_no",
          options: [{ value: "", score: 0, description: "" }],
          correct_answer: "",

          max_score: 10,
          passing_score: 6,
          is_required: true,
          is_critical: false,
          has_attachment: false,
          attachment_instructions: "",
          sort_order: 1,
          is_active: true,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const onSubmit = async (
    values: z.infer<ReturnType<typeof createConditionSchema>>,
  ) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "boolean") {
          formData.append(key, value ? "1" : "0");
        } else if (Array.isArray(value)) {
          // For arrays, append each item properly
          if (key === "options" && value.length > 0) {
            value.forEach((item, index) => {
              formData.append(`${key}[${index}][value]`, item.value);
              formData.append(`${key}[${index}][score]`, item.score.toString());
              formData.append(
                `${key}[${index}][description]`,
                item.description || "",
              );
            });
          } else {
            formData.append(key, JSON.stringify(value));
          }
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });

    try {
      if (isEditMode && initialData) {
        await updateCondition({
          checklistId: values.checklist_id,
          questionId: initialData.id,
          data: formData,
        }).unwrap();
        toast.success(t("Condition updated successfully!"));
      } else {
        await createCondition({
          checklistId: values.checklist_id,
          data: formData,
        }).unwrap();
        toast.success(t("Condition created successfully!"));
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/checklists");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("Failed to create condition"));
      console.error(error);
    }
  };

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? t("Update Question") : t("Save Question")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checklist_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("Checklist")} *</FormLabel>
                    <FormControl>
                      <VirtualSelect<Checklist>
                        value={field.value?.toString()}
                        onChange={(selectedValue) =>
                          field.onChange(Number(selectedValue))
                        }
                        placeholder={t("Select Checklist")}
                        searchPlaceholder={t("Search")}
                        emptyMessage={t("No checklists found")}
                        useQuery={useGetChecklistsSelectInfiniteQuery}
                        getOptionValue={(checklist) => checklist.id.toString()}
                        getOptionLabel={(checklist) => checklist.name}
                        renderOption={(checklist) => (
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate font-medium">
                              {checklist.name}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {checklist.code}
                              {checklist.company?.name
                                ? ` - ${checklist.company.name}`
                                : ""}
                            </span>
                          </div>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="criteria_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Criteria")} *</FormLabel>
                    <FormControl>
                      <VirtualSelect<Criteria>
                        value={field.value?.toString()}
                        onChange={(selectedValue) =>
                          field.onChange(Number(selectedValue))
                        }
                        placeholder={t("Select Criteria")}
                        searchPlaceholder={t("Search")}
                        emptyMessage={t("No criteria found")}
                        useQuery={useGetCriteriaSelectInfiniteQuery}
                        getOptionValue={(criteria) => criteria.id.toString()}
                        getOptionLabel={(criteria) => criteria.name}
                        renderOption={(criteria) => (
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate font-medium">
                              {criteria.name}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {criteria.category} - {criteria.weight}
                            </span>
                          </div>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="question_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Question Text")} *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("Enter question text")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Basic description")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("Enter description")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="help_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Help Text")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter help text")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Question Type")} *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select question type")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes_no">{t("Yes/No")}</SelectItem>
                      <SelectItem value="multiple_choice">
                        {t("Multiple Choice")}
                      </SelectItem>
                      <SelectItem value="rating">{t("Rating")}</SelectItem>
                      <SelectItem value="text">{t("Text")}</SelectItem>
                      <SelectItem value="number">{t("Number")}</SelectItem>
                      <SelectItem value="date">{t("Date")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Options")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border rounded-lg space-y-4 relative"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">
                    {t("Option")} {index + 1}
                  </h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={`options.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Value")} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t("Enter value")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`options.${index}.score`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Points")} *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`options.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Basic description")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("Enter description")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  value: "",
                  score: 0,
                  description: "",
                })
              }
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("Add Option")}
            </Button>
          </CardContent>
        </Card>

        {/* Scoring & Validation */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Scoring & Validation")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="correct_answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Correct Answer")}</FormLabel>
                  <FormControl>
                    <Input placeholder="نعم" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Max Points")} *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passing_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Passing Score")} *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Weight")} *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Sort Order")} *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Attachment Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Attachment Settings")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="has_attachment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("Allow Attachments")}
                    </FormLabel>
                    <FormDescription>
                      {t("User can attach files")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachment_instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Attachment Instructions")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("Enter attachment instructions")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Status & Flags */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Status & Flags")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="is_required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("Required Question")}
                    </FormLabel>
                    <FormDescription>
                      {t("User must answer this question")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_critical"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("Critical Question")}
                    </FormLabel>
                    <FormDescription>
                      {t("Is this question critical?")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem
                  dir={language === "ar" ? "rtl" : "ltr"}
                  className="flex flex-row items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t("Active")}</FormLabel>
                    <FormDescription>
                      {t("Is this question active?")}
                    </FormDescription>
                  </div>
                  <FormControl dir={language === "ar" ? "rtl" : "ltr"}>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      dir={language === "ar" ? "rtl" : "ltr"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          {!onSuccess && (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              {t("Cancel")}
            </Button>
          )}
          <Button type="submit">
            {isEditMode ? t("Update Question") : t("Save Question")}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (hideCardWrapper) {
    return content;
  }

  return <div className="w-full">{content}</div>;
}
