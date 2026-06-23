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
import { VirtualSelect } from "@/components/virtual-select";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { createChecklistSchema } from "@/schema/create-checklist.schema.zod";
import {
  useCreateChecklistMutation,
  useUpdateChecklistMutation,
} from "@/services/api/checklists";
import { useGetCompaniesSelectInfiniteQuery } from "@/services/api/companies";
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
import { Company } from "@/types/company";
import { Checklist } from "@/types/checklist";

interface CreateChecklistFormProps {
  initialData?: Checklist;
  onSuccess?: () => void;
  hideCardWrapper?: boolean;
}

export default function CreateChecklistForm({
  initialData,
  onSuccess,
  hideCardWrapper = false,
}: CreateChecklistFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const { start, stop } = useLoader();

  const [createChecklist, { isLoading: isCreating }] =
    useCreateChecklistMutation();
  const [updateChecklist, { isLoading: isUpdating }] =
    useUpdateChecklistMutation();

  const isEditMode = !!initialData;
  const isLoading = isCreating || isUpdating;

  const form = useForm<
    z.infer<ReturnType<typeof createChecklistSchema>>
  >({
    resolver: zodResolver(
      createChecklistSchema(t),
    ) as Resolver<
      z.infer<ReturnType<typeof createChecklistSchema>>
    >,
    defaultValues: initialData
      ? {
          name: initialData.name,
          code: initialData.code,
          description: initialData.description || "",
          version: initialData.version,
          company_id: initialData.company_id,
          industry_type: initialData.industry_type || "",
          total_score: initialData.total_score,
          passing_score: initialData.passing_score,
          time_estimate: initialData.time_estimate || 60,
          is_active: initialData.is_active,
          is_template: initialData.is_template,
        }
      : {
          name: "",
          code: "",
          description: "",
          version: "1.0",
          company_id: 0,
          industry_type: "",
          total_score: 100,
          passing_score: 70,
          time_estimate: 60,
          is_active: true,
          is_template: false,
        },
  });

  useEffect(() => {
    if (isLoading) {
      start(
        isEditMode
          ? t("Updating checklist")
          : t("Creating checklist"),
      );
    } else {
      stop();
    }
  }, [isLoading, isEditMode, start, stop, t]);

  async function onSubmit(
    values: z.infer<
      ReturnType<typeof createChecklistSchema>
    >,
  ) {
    try {
      if (isEditMode && initialData) {
        await updateChecklist({
          id: initialData.id,
          data: values,
        }).unwrap();
        toast.success(t("Checklist updated successfully!"));
      } else {
        await createChecklist(values).unwrap();
        toast.success(t("Checklist created successfully!"));
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/checklists");
      }
    } catch (error) {
      toast.error(
        isEditMode
          ? t("Failed to update checklist")
          : t("Failed to create checklist"),
      );
      console.error(error);
    }
  }

  const FormContent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-1"
      >
        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("Checklist Details")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Checklist Name")} *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "Enter checklist name",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Code")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter code")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Version")}</FormLabel>
                  <FormControl>
                    <Input placeholder="1.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Company")} *</FormLabel>
                  <FormControl>
                    <VirtualSelect<Company>
                      value={field.value?.toString()}
                      selectedLabel={initialData?.company?.name}
                      onChange={(selectedValue) =>
                        field.onChange(Number(selectedValue))
                      }
                      placeholder={t("Select company")}
                      searchPlaceholder={t("Search")}
                      emptyMessage={t("No companies found")}
                      useQuery={useGetCompaniesSelectInfiniteQuery}
                      getOptionValue={(company) =>
                        company.id.toString()
                      }
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
              name="industry_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Industry Type")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "Select industry type",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="restaurants">
                        {t("Restaurants")}
                      </SelectItem>
                      <SelectItem value="hotels">
                        {t("Hotels")}
                      </SelectItem>
                      <SelectItem value="retail">
                        {t("Retail")}
                      </SelectItem>
                      <SelectItem value="healthcare">
                        {t("Healthcare")}
                      </SelectItem>
                      <SelectItem value="manufacturing">
                        {t("Manufacturing")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t("Description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("Enter description")}
                      className="resize-none"
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

        {/* Scoring Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("Scoring Settings")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="total_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Total Score")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="100"
                      {...field}
                    />
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
                  <FormLabel>
                    {t("Passing Score")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time_estimate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Time Estimate")} ({t("min")})
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
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

        {/* Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("Options")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("Active")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_template"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t("Is Template")}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          {isEditMode
            ? t("Update Checklist")
            : t("Create Checklist")}
        </Button>
      </form>
    </Form>
  );

  if (hideCardWrapper) {
    return FormContent;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isEditMode
            ? t("Update Checklist")
            : t("Create New Checklist")}
        </CardTitle>
      </CardHeader>
      <CardContent>{FormContent}</CardContent>
    </Card>
  );
}
