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
import { createCompanySchema } from "@/schema/create-company.schema.zod";
import { useCreateCompanyMutation } from "@/services/api/companies";
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

export default function CreateCompanyForm() {
  const t = useTranslations();
  const router = useRouter();
  const { start, stop } = useLoader();
  const [createCompany, { isLoading }] =
    useCreateCompanyMutation();

  const form = useForm<
    z.infer<ReturnType<typeof createCompanySchema>>
  >({
    resolver: zodResolver(
      createCompanySchema(t),
    ) as Resolver<
      z.infer<ReturnType<typeof createCompanySchema>>
    >,
    defaultValues: {
      status: true,
      is_verified: false,
      user_status: true,
      subscription_status: "active",
      category: "",
      name: "",
      email: "",
      phone: "",
      commercial_registration: "",
      city: "",
      address: "",
      contact_person: "",
      subscription_start: "",
      subscription_end: "",
      user_name: "",
      user_email: "",
      user_password: "",
      user_password_confirmation: "",
      user_phone: "",
      user_birth_date: "",
      user_gender: 1,
    },
  });

  useEffect(() => {
    if (isLoading) {
      start(t("Creating company"));
    }
  }, [isLoading, start, t]);

  async function onSubmit(
    values: z.infer<ReturnType<typeof createCompanySchema>>,
  ) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "boolean") {
          formData.append(key, value ? "1" : "0");
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });
    console.log(formData);
    try {
      await createCompany(formData).unwrap();
      toast.success(t("Company created successfully!"));
      router.push("/dashboard/companies");
    } catch (error) {
      toast.error(t("failedToCreateCompany"));
      console.error(error);
    } finally {
      stop();
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("Create New Company")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Company Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {t("Company Details")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Company Name")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "Enter company name",
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Company Email")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "Enter email address",
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Company Phone")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "Enter phone number",
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
                  name="commercial_registration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Commercial Registration")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("Enter CR number")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("City")} *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("Enter city")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Address")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("Enter address")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Contact Person")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "Enter contact person name",
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
                      <FormControl>
                        <Input
                          placeholder={t("Enter category")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("Status")}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_verified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {t("Is Verified")}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscription_start"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        {t("Subscription Start")} *
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
                              <CalendarIcon className=" h-4 w-4 opacity-50" />
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
                  name="subscription_end"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        {t("Subscription End")} *
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
                              <CalendarIcon className=" h-4 w-4 opacity-50" />
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
                  name="subscription_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Subscription Status")} *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "Select status",
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">
                            {t("Active")}
                          </SelectItem>
                          <SelectItem value="inactive">
                            {t("Inactive")}
                          </SelectItem>
                          <SelectItem value="expired">
                            {t("Expired")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logo"
                  render={({
                    field: {
                      value: _value,
                      onChange,
                      ...fieldProps
                    },
                  }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Company Logo")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            onChange(
                              event.target.files &&
                                event.target.files[0],
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* User Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {t("Admin User Details")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="user_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("User Name")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("Enter user name")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("User Email")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "Enter user email",
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
                  name="user_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Password")} *
                      </FormLabel>
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
                  name="user_password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Confirm Password")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t(
                            "Confirm password",
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
                  name="user_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("User Phone")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "Enter user phone",
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
                  name="user_birth_date"
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
                                <span>
                                  {t(
                                    "Pick a date of birth",
                                  )}
                                </span>
                              )}
                              <CalendarIcon className=" h-4 w-4 opacity-50" />
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
                  name="user_gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Gender")}</FormLabel>
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
                                "Select gender",
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">
                            {t("Male")}
                          </SelectItem>
                          <SelectItem value="2">
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
                  name="user_personal_photo"
                  render={({
                    field: {
                      value: _value,
                      onChange,
                      ...fieldProps
                    },
                  }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Personal Photo")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            onChange(
                              event.target.files &&
                                event.target.files[0],
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              {t("Create Company")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
