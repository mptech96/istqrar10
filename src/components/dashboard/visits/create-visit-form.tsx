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
import { useGetBranchesQuery } from "@/services/api/branches";
import { useGetCompaniesQuery } from "@/services/api/companies";
import { useGetChecklistsQuery } from "@/services/api/checklists";
import { useGetInspectorsQuery } from "@/services/api/inspectors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoader } from "@/hooks/use-loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
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
  const { language } = useAppSelector(
    (state) => state.settings,
  );

  const t = useTranslations();
  const router = useRouter();
  const { start, stop } = useLoader();
  const [createVisit, { isLoading: isCreating }] =
    useCreateVisitMutation();
  const [updateVisit, { isLoading: isUpdating }] =
    useUpdateVisitMutation();

  const isEditMode = !!initialData;
  const isLoading = isCreating || isUpdating;

  const { data: companiesData } = useGetCompaniesQuery(
    "page=1&page_size=100",
  );
  const { data: checklistsData } = useGetChecklistsQuery(
    "page=1&page_size=100",
  );
  const { data: auditorsData } = useGetInspectorsQuery(
    "page=1&page_size=100&role=auditor",
  );

  const form = useForm<
    z.infer<ReturnType<typeof createVisitSchema>>
  >({
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
          estimated_duration:
            initialData.estimated_duration || 60,
          internal_notes: initialData.internal_notes || "",
        }
      : {
          company_id: undefined,
          branch_id: undefined,
          auditor_id: undefined,
          checklist_id: undefined,
          scheduled_date: "",
          scheduled_time: "",
          estimated_duration: 60,
          internal_notes: "",
        },
  });

  const selectedCompanyId = form.watch("company_id");

  const { data: branchesData } = useGetBranchesQuery(
    `page=1&page_size=100${selectedCompanyId ? `&company_id=${selectedCompanyId}` : ""}`,
    { skip: !selectedCompanyId },
  );

  // Reset branch if company changes
  useEffect(() => {
    if (selectedCompanyId && !isEditMode) {
      form.setValue("branch_id", undefined as unknown as number);
    }
  }, [selectedCompanyId, form, isEditMode]);

  useEffect(() => {
    if (isLoading) {
      start(
        isEditMode
          ? t("Updating visit")
          : t("Creating visit"),
      );
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
    } catch (error) {
      toast.error(
        isEditMode
          ? t("Failed to update visit")
          : t("Failed to create visit"),
      );
      console.error(error);
    }
  }

  const content = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Visit Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("Visit Details")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Company")} *</FormLabel>
                  <Select
                    onValueChange={(val) =>
                      field.onChange(Number(val))
                    }
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("Select company")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companiesData?.data?.map(
                        (company: Company) => (
                          <SelectItem
                            key={company.id}
                            value={company.id.toString()}
                          >
                            {company.name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Branch")} *</FormLabel>
                  <Select
                    onValueChange={(val) =>
                      field.onChange(Number(val))
                    }
                    value={field.value?.toString()}
                    disabled={!selectedCompanyId}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedCompanyId
                              ? t("Select company first")
                              : t("Select branch")
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branchesData?.data?.map(
                        (branch: Branch) => (
                          <SelectItem
                            key={branch.id}
                            value={branch.id.toString()}
                          >
                            {branch.name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="auditor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Auditor")} *</FormLabel>
                  <Select
                    onValueChange={(val) =>
                      field.onChange(Number(val))
                    }
                    defaultValue={field.value?.toString()}
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <FormControl className="w-full ">
                      <SelectTrigger
                        dir={
                          language === "ar" ? "rtl" : "ltr"
                        }
                      >
                        <SelectValue
                          placeholder={t("Select auditor")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {auditorsData?.data?.map(
                        (auditor: Inspectors) => (
                          <SelectItem
                            key={auditor.id}
                            value={auditor.id.toString()}
                          >
                            {auditor.name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checklist_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Checklist")} *</FormLabel>
                  <Select
                    onValueChange={(val) =>
                      field.onChange(Number(val))
                    }
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "Select checklist",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {checklistsData?.data?.map(
                        (checklist: Checklist) => (
                          <SelectItem
                            key={checklist.id}
                            value={checklist.id.toString()}
                          >
                            {checklist.name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
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
                    <Input
                      type="number"
                      min="1"
                      placeholder="60"
                      {...field}
                    />
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
          <h3 className="text-lg font-medium">
            {t("Schedule")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="scheduled_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {t("Scheduled Date")} *
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal flex items-center justify-between",
                            !field.value &&
                              "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(
                              new Date(field.value),
                              "PPP",
                            )
                          ) : (
                            <span>{t("Pick a date")}</span>
                          )}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          field.value
                            ? new Date(field.value)
                            : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(
                            date
                              ? format(date, "yyyy-MM-dd")
                              : "",
                          )
                        }
                        disabled={(date) =>
                          date <
                          new Date(
                            new Date().setHours(0, 0, 0, 0),
                          )
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
                  <FormLabel>
                    {t("Scheduled Time")} *
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
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
          <h3 className="text-lg font-medium">
            {t("Notes")}
          </h3>
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
          {isEditMode
            ? t("Update Visit")
            : t("Create Visit")}
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
          {isEditMode
            ? t("Edit Visit")
            : t("Create New Visit")}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
