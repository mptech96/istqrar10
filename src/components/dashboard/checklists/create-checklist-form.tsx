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
import { Checkbox } from "@/components/ui/checkbox";
import { createChecklistSchema } from "@/schema/create-checklist.schema.zod";
import { useCreateChecklistMutation } from "@/services/api/checklists";
import { useGetCompaniesQuery } from "@/services/api/companies";
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

export default function CreateChecklistForm() {
  const t = useTranslations();
  const router = useRouter();
  const { start, stop } = useLoader();
  const [createChecklist, { isLoading }] =
    useCreateChecklistMutation();
  const { data: companiesData } = useGetCompaniesQuery(
    "page=1&page_size=100",
  );

  const form = useForm<
    z.infer<ReturnType<typeof createChecklistSchema>>
  >({
    resolver: zodResolver(
      createChecklistSchema(t),
    ) as Resolver<
      z.infer<ReturnType<typeof createChecklistSchema>>
    >,
    defaultValues: {
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
      start(t("Creating checklist"));
    } else {
      stop();
    }
  }, [isLoading, start, stop, t]);

  async function onSubmit(
    values: z.infer<
      ReturnType<typeof createChecklistSchema>
    >,
  ) {
    try {
      await createChecklist(values).unwrap();
      toast.success(t("Checklist created successfully!"));
      router.push("/dashboard/checklists");
    } catch (error) {
      toast.error(t("Failed to create checklist"));
      console.error(error);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("Create New Checklist")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
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
                        <Input
                          placeholder="1.0"
                          {...field}
                        />
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
                      <FormLabel>
                        {t("Company")} *
                      </FormLabel>
                      <Select
                        onValueChange={(val) =>
                          field.onChange(Number(val))
                        }
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "Select company",
                              )}
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
                      <FormLabel>
                        {t("Description")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "Enter description",
                          )}
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
                      <FormLabel>
                        {t("Total Score")}
                      </FormLabel>
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
              {t("Create Checklist")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
