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
import { useCreateVisitMutation } from "@/services/api/visits";
import { useGetBranchesQuery } from "@/services/api/branches";
import { useGetChecklistsQuery } from "@/services/api/checklists";
import { useGetInspectorsQuery } from "@/services/api/inspectors";
import { toast, Toaster } from "sonner";
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
import { Inspectors } from "@/schema/inspectors";
import { useAppSelector } from "@/lib/store";

export default function CreateVisitForm() {
  const { language } = useAppSelector(
    (state) => state.settings,
  );

  const t = useTranslations();
  const router = useRouter();
  const { start, stop } = useLoader();
  const [createVisit, { isLoading }] =
    useCreateVisitMutation();

  const { data: branchesData } = useGetBranchesQuery(
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
    defaultValues: {
      branch_id: undefined,
      auditor_id: undefined,
      checklist_id: undefined,
      scheduled_date: "",
      scheduled_time: "",
      estimated_duration: 60,
      internal_notes: "",
    },
  });

  useEffect(() => {
    if (isLoading) {
      start(t("Creating visit"));
    } else {
      stop();
    }
  }, [isLoading, start, stop, t]);

  async function onSubmit(
    values: z.infer<ReturnType<typeof createVisitSchema>>,
  ) {
    try {
      await createVisit(values).unwrap();
      toast.success(t("Visit created successfully!"));
      router.push("/dashboard/visits");
    } catch (error) {
      toast.error(t("Failed to create visit"));
      console.error(error);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("Create New Visit")}</CardTitle>
      </CardHeader>
      <CardContent>
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
                  name="branch_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Branch")} *</FormLabel>
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
                                "Select branch",
                              )}
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
                      <FormLabel>
                        {t("Auditor")} *
                      </FormLabel>
                      <Select
                        onValueChange={(val) =>
                          field.onChange(Number(val))
                        }
                        defaultValue={field.value?.toString()}
                        dir={
                          language === "ar" ? "rtl" : "ltr"
                        }
                      >
                        <FormControl className="w-full ">
                          <SelectTrigger
                            dir={
                              language === "ar"
                                ? "rtl"
                                : "ltr"
                            }
                          >
                            <SelectValue
                              placeholder={t(
                                "Select auditor",
                              )}
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
                      <FormLabel>
                        {t("Checklist")} *
                      </FormLabel>
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
                        {t("Estimated Duration")} (
                        {t("min")})
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
                                <span>
                                  {t("Pick a date")}
                                </span>
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
                                  ? format(
                                      date,
                                      "yyyy-MM-dd",
                                    )
                                  : "",
                              )
                            }
                            disabled={(date) =>
                              date <
                              new Date(
                                new Date().setHours(
                                  0,
                                  0,
                                  0,
                                  0,
                                ),
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
                    <FormLabel>
                      {t("Internal Notes")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "Enter internal notes",
                        )}
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
              {t("Create Visit")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
