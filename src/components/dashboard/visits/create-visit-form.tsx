/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { useTranslations } from "next-intl";
import { createVisitSchema } from "@/schema/create-visit.schema.zod";
import {
  useCreateVisitMutation,
  useUpdateVisitMutation,
} from "@/services/api/visits";
import {
  useGetBranchesQuery,
  useGetBranchesSelectInfiniteQuery,
} from "@/services/api/branches";
import {
  useGetCompaniesQuery,
  useGetCompaniesSelectInfiniteQuery,
} from "@/services/api/companies";
import {
  useGetChecklistsQuery,
  useGetChecklistsSelectInfiniteQuery,
} from "@/services/api/checklists";
import {
  useGetAuditorsSelectInfiniteQuery,
  useGetInspectorsQuery,
} from "@/services/api/inspectors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoader } from "@/hooks/use-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Branch } from "@/types/branch";
import { Checklist } from "@/types/checklist";
import { Inspectors } from "@/types/inspectors";
import { useAppSelector } from "@/lib/store";
import { Visit } from "@/types/visit";
import { Company } from "@/types/company";
import { TimePicker } from "@/components/ui/time-picker";
import { VirtualSelect } from "@/components/virtual-select";
import { User } from "@/types/user";

interface CreateVisitFormProps {
  initialData?: Visit;
  onSuccess?: () => void;
  hideCardWrapper?: boolean;
}

export default function CreateVisitForm({
  initialData,
  onSuccess,
  hideCardWrapper = false,
}: CreateVisitFormProps) {
  const { language } = useAppSelector((state) => state.settings);

  const t = useTranslations();
  const router = useRouter();
  const { start, stop } = useLoader();
  const [createVisit, { isLoading: isCreating }] = useCreateVisitMutation();
  const [updateVisit, { isLoading: isUpdating }] = useUpdateVisitMutation();

  const isEditMode = !!initialData;
  const isLoading = isCreating || isUpdating;

  const form = useForm<z.infer<ReturnType<typeof createVisitSchema>>>({
    resolver: zodResolver(createVisitSchema(t)) as Resolver<
      z.infer<ReturnType<typeof createVisitSchema>>
    >,
    defaultValues: initialData
      ? {
          company_id: initialData.company_id,
          branch_id: initialData.branch_id,
          auditor_id: initialData.auditor_id,
          checklist_id: initialData.checklist_id,
          scheduled_date: initialData.scheduled_date,
          scheduled_time: initialData.scheduled_time,
          estimated_duration: initialData.estimated_duration || 60,
          internal_notes: initialData.internal_notes || "",
        }
      : {
          company_id: undefined,
          branch_id: undefined,
          auditor_id: undefined,
          checklist_id: undefined,
          scheduled_date: "",
          scheduled_time: format(new Date(), "HH:mm"),
          estimated_duration: 60,
          internal_notes: "",
        },
  });

  const selectedCompanyId = form.watch("company_id");
  const scheduledDate = form.watch("scheduled_date");
  const scheduledTime = form.watch("scheduled_time");

  // Re-validate time when date or time changes so that "future hour" rule triggers immediately
  useEffect(() => {
    if (scheduledDate) {
      form.trigger("scheduled_time");
    }
  }, [scheduledDate, scheduledTime, form]);

  // Reset branch if company changes
  useEffect(() => {
    if (selectedCompanyId && !isEditMode) {
      form.setValue("branch_id", undefined as unknown as number);
    }
  }, [selectedCompanyId, form, isEditMode]);

  useEffect(() => {
    if (isLoading) {
      start(isEditMode ? t("Updating visit") : t("Creating visit"));
    } else {
      stop();
    }
  }, [isLoading, isEditMode, start, stop, t]);
  async function onSubmit(
    values: z.infer<ReturnType<typeof createVisitSchema>>,
  ) {
    try {
      if (isEditMode && initialData) {
        await updateVisit({
          id: initialData.id,
          data: values,
        }).unwrap();
        toast.success(t("Visit updated successfully!"));
      } else {
        await createVisit(values).unwrap();
        toast.success(t("Visit created successfully!"));
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/visits");
      }
    } catch (error: any) {
      toast.error(error.message || t("Failed to create visit"));
    }
  }

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Visit Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t("Visit Details")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Company")} <span className="text-red-500">*</span>{" "}
                  </FormLabel>
                  <FormControl>
                    <VirtualSelect<Company>
                      value={field.value ? field.value.toString() : ""}
                      onChange={(selectedValue) => {
                        const nextCompanyId = selectedValue
                          ? Number(selectedValue)
                          : undefined;
                        if (nextCompanyId !== field.value) {
                          form.setValue(
                            "branch_id",
                            undefined as unknown as number,
                          );
                        }
                        field.onChange(nextCompanyId);
                      }}
                      placeholder={t("Select Company")}
                      searchPlaceholder={t("Search")}
                      emptyMessage={t("No companies found")}
                      useQuery={useGetCompaniesSelectInfiniteQuery}
                      getOptionValue={(company) => company.id.toString()}
                      getOptionLabel={(company) => company.name}
                      renderOption={(company) => (
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium">
                            {company.name}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {company.email}
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
              name="branch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Branch")} <span className="text-red-500">*</span>{" "}
                  </FormLabel>
                  <FormControl>
                    <VirtualSelect<Branch, { company_id?: number }>
                      value={field.value ? field.value.toString() : ""}
                      onChange={(selectedValue) =>
                        field.onChange(
                          selectedValue ? Number(selectedValue) : undefined,
                        )
                      }
                      placeholder={
                        selectedCompanyId
                          ? t("Select Branch")
                          : t("Select company first")
                      }
                      searchPlaceholder={t("Search")}
                      emptyMessage={t("No branches found")}
                      disabled={!selectedCompanyId}
                      queryArgs={{ company_id: selectedCompanyId }}
                      useQuery={useGetBranchesSelectInfiniteQuery}
                      getOptionValue={(branch) => branch.id.toString()}
                      getOptionLabel={(branch) => branch.name}
                      renderOption={(branch) => (
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium">
                            {branch.name}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {branch.email}
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
              name="auditor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Auditor")} <span className="text-red-500">*</span>{" "}
                  </FormLabel>
                  <FormControl>
                    <VirtualSelect<User, { role?: string }>
                      value={field.value ? field.value.toString() : ""}
                      onChange={(selectedValue) =>
                        field.onChange(
                          selectedValue ? Number(selectedValue) : undefined,
                        )
                      }
                      placeholder={t("Select Auditor")}
                      searchPlaceholder={t("Search")}
                      emptyMessage={t("No auditors found")}
                      queryArgs={{ role: "auditor" }}
                      useQuery={useGetAuditorsSelectInfiniteQuery}
                      getOptionValue={(auditor) => auditor.id.toString()}
                      getOptionLabel={(auditor) => auditor.name}
                      renderOption={(auditor) => (
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium">
                            {auditor.name}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {auditor.email}
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
              name="checklist_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Checklist")}{" "}
                    <span className="text-red-500">*</span>{" "}
                  </FormLabel>
                  <FormControl>
                    <VirtualSelect<Checklist, { company_id?: number }>
                      value={field.value ? field.value.toString() : ""}
                      onChange={(selectedValue) =>
                        field.onChange(
                          selectedValue ? Number(selectedValue) : undefined,
                        )
                      }
                      placeholder={t("Select Checklist")}
                      searchPlaceholder={t("Search")}
                      emptyMessage={t("No checklists found")}
                      useQuery={useGetChecklistsSelectInfiniteQuery}
                      queryArgs={{ company_id: selectedCompanyId }}
                      getOptionValue={(checklist) => checklist.id.toString()}
                      getOptionLabel={(checklist) => checklist.name}
                      renderOption={(checklist) => (
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium">
                            {checklist.name}
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
              name="estimated_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Estimated Duration")} ({t("min")})
                  </FormLabel>
                  <FormControl>
                    <Input type="number" min="1" placeholder="60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Schedule */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t("Schedule")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="scheduled_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("Scheduled Date")} *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal flex items-center justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>{t("Pick a date")}</span>
                          )}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduled_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Scheduled Time")} (24h) *</FormLabel>
                  <FormControl>
                    <TimePicker
                      value={field.value || "12:00"}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t("Notes")}</h3>
          <FormField
            control={form.control}
            name="internal_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Internal Notes")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("Enter internal notes")}
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          {isEditMode ? t("Update Visit") : t("Create Visit")}
        </Button>
      </form>
    </Form>
  );

  if (hideCardWrapper) {
    return content;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isEditMode ? t("Edit Visit") : t("Create New Visit")}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
