"use client";

import {
  useForm,
  useFieldArray,
  type Resolver,
} from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { createCriteriaSchema } from "@/schema/create-criteria.schema.zod";
import { useCreateCriteriaMutation } from "@/services/api/criteria";
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
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function CreateCriteriaForm() {
  const t = useTranslations();
  const router = useRouter();
  const { start, stop } = useLoader();
  const [createCriteria, { isLoading }] =
    useCreateCriteriaMutation();

  const form = useForm<
    z.infer<ReturnType<typeof createCriteriaSchema>>
  >({
    resolver: zodResolver(
      createCriteriaSchema(t),
    ) as Resolver<
      z.infer<ReturnType<typeof createCriteriaSchema>>
    >,
    defaultValues: {
      name: "",
      description: "",
      category: "",
      weight: 0,
      is_active: true,
      sort_order: 1,
      ranges: [
        {
          name: "",
          min_score: 0,
          max_score: 100,
          color: "#28a745",
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ranges",
  });

  useEffect(() => {
    if (isLoading) {
      start(t("Creating criteria"));
    } else {
      stop();
    }
  }, [isLoading, start, stop, t]);

  async function onSubmit(
    values: z.infer<
      ReturnType<typeof createCriteriaSchema>
    >,
  ) {
    try {
      await createCriteria(values).unwrap();
      toast.success(t("Criteria created successfully!"));
      router.push("/dashboard/criterias");
    } catch (error) {
      toast.error(t("Failed to create criteria"));
      console.error(error);
    }
  }

  const addRange = () => {
    append({
      name: "",
      min_score: 0,
      max_score: 100,
      color: "#28a745",
      description: "",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("Create New Criteria")}</CardTitle>
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
                {t("Criteria Details")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Criteria Name")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "Enter criteria name",
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Category")} *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "Select category",
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cleanliness">
                            {t("Cleanliness")}
                          </SelectItem>
                          <SelectItem value="safety">
                            {t("Safety")}
                          </SelectItem>
                          <SelectItem value="quality">
                            {t("Quality")}
                          </SelectItem>
                          <SelectItem value="service">
                            {t("Service")}
                          </SelectItem>
                          <SelectItem value="compliance">
                            {t("Compliance")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Weight")} (%)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder={t("Enter weight")}
                          {...field}
                        />
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
                      <FormLabel>
                        {t("Sort Order")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder={t(
                            "Enter sort order",
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

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md  p-4">
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
              </div>
            </div>

            <Separator />

            {/* Ranges Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {t("Score Ranges")}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRange}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("Add Range")}
                </Button>
              </div>

              {fields.map((rangeField, index) => (
                <Card key={rangeField.id} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">
                      {t("Range")} {index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`ranges.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("Range Name")} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                "Enter range name",
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
                      name={`ranges.${index}.min_score`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("Min Score")} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ranges.${index}.max_score`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("Max Score")} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
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
                      name={`ranges.${index}.color`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("Color")} *
                          </FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                {...field}
                                className="w-12 h-10 p-1 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="#28a745"
                                className="flex-1"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ranges.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>
                            {t("Range Description")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                "Enter range description",
                              )}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
              {form.formState.errors.ranges?.root && (
                <p className="text-sm text-destructive">
                  {
                    form.formState.errors.ranges.root
                      .message
                  }
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              {t("Create Criteria")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
