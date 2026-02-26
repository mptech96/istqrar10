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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { createInspectorSchema } from "@/schema/create-inspector.schema.zod";
import {
  useCreateInspectorMutation,
  useUpdateInspectorMutation,
} from "@/services/api/inspectors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoader } from "@/hooks/use-loader";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

import { Inspectors } from "@/types/inspectors";

interface CreateInspectorFormProps {
  initialData?: Inspectors;
  onSuccess?: () => void;
  hideCardWrapper?: boolean;
}

export default function CreateInspectorForm({
  initialData,
  onSuccess,
  hideCardWrapper = false,
}: CreateInspectorFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const { start, stop } = useLoader();
  const [createInspector, { isLoading: isCreating }] =
    useCreateInspectorMutation();
  const [updateInspector, { isLoading: isUpdating }] =
    useUpdateInspectorMutation();

  const isEditMode = !!initialData;
  const isLoading = isCreating || isUpdating;

  const form = useForm<
    z.infer<ReturnType<typeof createInspectorSchema>>
  >({
    resolver: zodResolver(
      createInspectorSchema(t),
    ) as Resolver<
      z.infer<ReturnType<typeof createInspectorSchema>>
    >,
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          password: "",
          password_confirmation: "",
          phone: initialData.phone,
          role: initialData.role,
          department: initialData.department || "",
          position: initialData.position || "",
          national_number:
            initialData.national_number || "",
          certificate_expiry: initialData.certificate_expiry
            ? format(
                new Date(initialData.certificate_expiry),
                "yyyy-MM-dd",
              )
            : "",
          license_expiry: initialData.license_expiry
            ? format(
                new Date(initialData.license_expiry),
                "yyyy-MM-dd",
              )
            : "",
          id_expiry: initialData.id_expiry
            ? format(
                new Date(initialData.id_expiry),
                "yyyy-MM-dd",
              )
            : "",
          birth_date: initialData.birth_date
            ? format(
                new Date(initialData.birth_date),
                "yyyy-MM-dd",
              )
            : "",
          gender: initialData.gender || "",
          status: initialData.status,
          must_change_password:
            initialData.must_change_password,
        }
      : {
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          phone: "",
          role: "",
          department: "",
          position: "",
          national_number: "",
          certificate_expiry: "",
          license_expiry: "",
          id_expiry: "",
          birth_date: "",
          gender: "",
          status: 1,
          must_change_password: false,
        },
  });

  useEffect(() => {
    if (isLoading) {
      start(
        isEditMode
          ? t("Updating inspector")
          : t("Creating inspector"),
      );
    } else {
      stop();
    }
  }, [isLoading, isEditMode, start, stop, t]);

  async function onSubmit(
    values: z.infer<
      ReturnType<typeof createInspectorSchema>
    >,
  ) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        if (typeof value === "boolean") {
          formData.append(key, value ? "1" : "0");
        } else if (typeof value === "number") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });

    try {
      if (isEditMode && initialData) {
        await updateInspector({
          id: initialData.id,
          data: formData,
        }).unwrap();
        toast.success(t("Inspector updated successfully!"));
      } else {
        await createInspector(formData).unwrap();
        toast.success(t("Inspector created successfully!"));
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/inspectors");
      }
    } catch (error) {
      toast.error(
        isEditMode
          ? t("Failed to update inspector")
          : t("Failed to create inspector"),
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
        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("Basic Information")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Name")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter name")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Email")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter email")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Password")} *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("Enter password")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Confirm Password")} *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("Confirm password")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Phone")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter phone number")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Role")} *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("Select Role")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="auditor">
                        {t("Auditor")}
                      </SelectItem>
                      <SelectItem value="inspector">
                        {t("Inspector")}
                      </SelectItem>
                      <SelectItem value="supervisor">
                        {t("Supervisor")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Department")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter department")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Position")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter position")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="national_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("National Number")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "Enter national number",
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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Gender")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("Select gender")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">
                        {t("Male")}
                      </SelectItem>
                      <SelectItem value="female">
                        {t("Female")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {t("Date of Birth")}
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
                          date > new Date() ||
                          date < new Date("1900-01-01")
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Status")}</FormLabel>
                  <Select
                    onValueChange={(val) =>
                      field.onChange(Number(val))
                    }
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("Select status")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">
                        {t("Active")}
                      </SelectItem>
                      <SelectItem value="0">
                        {t("Inactive")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Documents & Expiry Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("Documents & Expiry")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="municipality_certificate"
              render={({
                field: {
                  onChange,
                  value: _value,
                  ...fieldProps
                },
              }) => (
                <FormItem>
                  <FormLabel>
                    {t("Municipality Certificate")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      name={fieldProps.name}
                      ref={fieldProps.ref}
                      onBlur={fieldProps.onBlur}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) =>
                        onChange(
                          event.target.files &&
                            event.target.files[0],
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certificate_expiry"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {t("Certificate Expiry")}
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
                        initialFocus
                        captionLayout="dropdown"
                        endMonth={new Date("2100-12-31")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driving_license"
              render={({
                field: {
                  onChange,
                  value: _value,
                  ...fieldProps
                },
              }) => (
                <FormItem>
                  <FormLabel>
                    {t("Driving License")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      name={fieldProps.name}
                      ref={fieldProps.ref}
                      onBlur={fieldProps.onBlur}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) =>
                        onChange(
                          event.target.files &&
                            event.target.files[0],
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="license_expiry"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {t("License Expiry")}
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
                        initialFocus
                        captionLayout="dropdown"
                        endMonth={new Date("2100-12-31")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personal_photo"
              render={({
                field: {
                  onChange,
                  value: _value,
                  ...fieldProps
                },
              }) => (
                <FormItem>
                  <FormLabel>
                    {t("Personal Photo")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      name={fieldProps.name}
                      ref={fieldProps.ref}
                      onBlur={fieldProps.onBlur}
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        onChange(
                          event.target.files &&
                            event.target.files[0],
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id_expiry"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("ID Expiry")}</FormLabel>
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
                        initialFocus
                        captionLayout="dropdown"
                        endMonth={new Date("2100-12-31")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Other Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("Options")}
          </h3>
          <FormField
            control={form.control}
            name="must_change_password"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-4 border">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {t("Must Change Password")}
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          {isEditMode
            ? t("Update Inspector")
            : t("Create Inspector")}
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
            ? t("Edit Inspector")
            : t("Create New Inspector")}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
