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
  FormDescription,
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
import { createSettingSchema } from "@/schema/create-setting.schema.zod";
import {
  useCreateSettingMutation,
  useUpdateSettingMutation,
} from "@/services/api/setting";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoader } from "@/hooks/use-loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { SmartSetting, SettingType } from "@/types/setting";

interface CreateSettingFormProps {
  initialData?: SmartSetting<SettingType>;
  onSuccess?: () => void;
  hideCardWrapper?: boolean;
}

export default function CreateSettingForm({
  initialData,
  onSuccess,
  hideCardWrapper = false,
}: CreateSettingFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const { start, stop } = useLoader();

  const [createSetting, { isLoading: isCreating }] =
    useCreateSettingMutation();
  const [updateSetting, { isLoading: isUpdating }] =
    useUpdateSettingMutation();

  const isEditMode = !!initialData;
  const isLoading = isCreating || isUpdating;

  const form = useForm<
    z.infer<ReturnType<typeof createSettingSchema>>
  >({
    resolver: zodResolver(
      createSettingSchema(t),
    ) as Resolver<
      z.infer<ReturnType<typeof createSettingSchema>>
    >,
    defaultValues: initialData
      ? {
          group: initialData.group,
          key: initialData.key,
          value: initialData.value,
          type: initialData.type,
          label: initialData.label,
          description: initialData.description || "",
          is_public: initialData.is_public,
        }
      : {
          group: "general",
          key: "",
          value: "",
          type: "string",
          label: "",
          description: "",
          is_public: true,
        },
  });

  const watchType = form.watch("type");

  useEffect(() => {
    if (isLoading) {
      start(
        isEditMode
          ? t("Updating setting")
          : t("Creating setting"),
      );
    } else {
      stop();
    }
  }, [isLoading, isEditMode, start, stop, t]);

  async function onSubmit(
    values: z.infer<ReturnType<typeof createSettingSchema>>,
  ) {
    try {
      if (isEditMode && initialData) {
        await updateSetting({
          id: initialData.id,
          body: values,
        }).unwrap();
        toast.success(t("Setting updated successfully!"));
      } else {
        await createSetting({ body: values }).unwrap();
        toast.success(t("Setting created successfully!"));
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/settings");
      }
    } catch (error) {
      toast.error(
        isEditMode
          ? t("Failed to update setting")
          : t("Failed to create setting"),
      );
      console.error(error);
    }
  }

  const FormContent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-1"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Group")} *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("general, ai, mail etc")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Key")} *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("site name")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Label")} *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Display name")}
                    {...field}
                  />
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
                <FormLabel>{t("Type")} *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("Select type")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="string">
                      {t("String")}
                    </SelectItem>
                    <SelectItem value="number">
                      {t("Number")}
                    </SelectItem>
                    <SelectItem value="boolean">
                      {t("Boolean")}
                    </SelectItem>
                    <SelectItem value="select">
                      {t("Select")}
                    </SelectItem>
                    <SelectItem value="json">
                      {t("JSON")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t("Value")} *</FormLabel>
                <FormControl>
                  {watchType === "boolean" ? (
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm text-muted-foreground">
                        {field.value
                          ? t("True")
                          : t("False")}
                      </span>
                    </div>
                  ) : watchType === "number" ? (
                    <Input
                      type="number"
                      placeholder={t("Enter number")}
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          Number(e.target.value),
                        )
                      }
                    />
                  ) : (
                    <Input
                      placeholder={t("Enter value")}
                      {...field}
                    />
                  )}
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
                <FormLabel>{t("Description")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t(
                      "What this setting does",
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
            name="is_public"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 md:col-span-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {t("Public Setting")}
                  </FormLabel>
                  <FormDescription>
                    {t(
                      "Whether this setting is accessible by unauthorized users",
                    )}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isEditMode
            ? t("Update Setting")
            : t("Create Setting")}
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
            ? t("Update Setting")
            : t("Create New Setting")}
        </CardTitle>
      </CardHeader>
      <CardContent>{FormContent}</CardContent>
    </Card>
  );
}
