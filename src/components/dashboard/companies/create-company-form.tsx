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
import { useLocale, useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createCompanySchema,
  updateCompanySchema,
  getCompanySchema,
  type CreateCompanySchema,
  type UpdateCompanySchema,
  type CompanyFormValues,
} from "@/schema/create-company.schema.zod";
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "@/services/api/companies";
import { useGetInspectorsQuery } from "@/services/api/inspectors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoader } from "@/hooks/use-loader";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { cn, safeFormatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useState } from "react";
import { LocationPicker } from "@/components/ui/location-picker";
import { Switch } from "@/components/ui/switch";

import { Company } from "@/types/company";
import { User } from "@/types/user";

interface CreateCompanyFormProps<
  T extends CompanyFormValues = CompanyFormValues,
> {
  initialData?: Company;
  onSuccess?: () => void;
  hideCardWrapper?: boolean;
  onSubmit: (values: T) => void | Promise<void>;
  updateMode?: boolean;
}

export default function CreateCompanyForm<
  T extends CompanyFormValues = CompanyFormValues,
>({
  initialData,
  onSuccess,
  hideCardWrapper = false,
  onSubmit,
  updateMode = false,
}: CreateCompanyFormProps<T>) {
  console.log(initialData);
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const { start, stop } = useLoader();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  // Start from Jan 1 of previous year
  const minDate = useMemo(
    () => new Date(currentYear - 18, currentMonth, currentDate),
    [currentYear, currentMonth, currentDate],
  );

  // Start from Jan 1 of previous year
  const startMonth = useMemo(
    () => new Date(currentYear - 1, 0, 1),
    [currentYear],
  );
  // End at Dec 31 of next year
  const endMonth = useMemo(
    () => new Date(currentYear + 1, 11, 31),
    [currentYear],
  );
  /* 
  
  const currentYear = new Date().getFullYear();
 
  
  */

  const { data: adminsData } = useGetInspectorsQuery(
    "page=1&page_size=100&role=company_admin",
  );
  const [showPassword, setShowPassword] = useState(false);
  const isEditMode = Boolean(initialData || updateMode);

  const currentSchema = useMemo(
    () => getCompanySchema(t, isEditMode),
    [isEditMode, t],
  );

  const form = useForm<CreateCompanySchema>({
    resolver: zodResolver(
      currentSchema,
    ) as unknown as Resolver<CreateCompanySchema>,
    defaultValues: initialData
      ? {
          status: initialData.status,
          is_verified: initialData.is_verified,
          subscription_status: initialData.subscription_status,
          category: initialData.category || "",
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          commercial_registration: initialData.commercial_registration,
          city: initialData.city,
          address: initialData.address,
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          max_allowed_branches: initialData.max_allowed_branches || 1,
          max_allowed_users: initialData.max_allowed_users || 1,
          contact_person: initialData.contact_person,
          subscription_start: new Date(
            safeFormatDate(initialData.subscription_start),
          ),
          subscription_end: new Date(
            safeFormatDate(initialData.subscription_end),
          ),
          use_existing_user: true,
          user_id: initialData.manager?.id?.toString() || "",
          user_name: initialData.manager?.name || "",
          user_email: initialData.manager?.email || "",
          user_password: "",
          user_password_confirmation: "",
          user_phone: initialData.manager?.phone || "",
          user_birth_date: initialData.manager?.birth_date || "",
          user_status: Boolean(initialData.manager?.status) || true,
          user_gender: initialData.manager?.gender === "male" ? 1 : 2,
        }
      : {
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
          latitude: undefined,
          longitude: undefined,
          max_allowed_branches: 1,
          max_allowed_users: 1,
          contact_person: "",
          subscription_start: new Date(),
          subscription_end: new Date(),
          use_existing_user: false,
          user_id: "",
          user_name: "",
          user_email: "",
          user_password: "",
          user_password_confirmation: "",
          user_phone: "",
          user_birth_date: "",
          user_gender: 1,
        },
  });

  async function handleSubmit(values: CreateCompanySchema) {
    await onSubmit(values as unknown as T);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.log("errors", form.formState.errors);

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Company Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t("Company Details")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Company Name")} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter company name")} {...field} />
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
                  <FormLabel>{t("Company Email")} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter email address")} {...field} />
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
                  <FormLabel>{t("Company Phone")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        locale === "ar"
                          ? "********5 (966+) "
                          : "(966+) 5********  "
                      }
                      {...field}
                      type="tel"
                      dir={locale === "ar" ? "rtl" : "ltr"}
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
                  <FormLabel>{t("Commercial Registration")} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter CR number")} {...field} />
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
                  <FormLabel>{t("Contact Person")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter contact person name")}
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
                  <FormLabel>{t("Category")} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter category")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_allowed_branches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Max Allowed Branches")} *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("Enter max branches")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_allowed_users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Max Allowed Users")} *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("Enter max users")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscription_start"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("Subscription Start")} *</FormLabel>
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
                          <span>
                            {field.value
                              ? format(new Date(field.value), "yyyy-MM-dd")
                              : t("Pick a date")}
                          </span>

                          <CalendarIcon className=" h-4 w-4 opacity-50" />
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
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                        captionLayout="dropdown"
                        startMonth={startMonth}
                        endMonth={endMonth}
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
                  <FormLabel>{t("Subscription End")} *</FormLabel>
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
                          <span>
                            {field.value
                              ? format(new Date(field.value), "yyyy-MM-dd")
                              : t("Pick a date")}
                          </span>

                          <CalendarIcon className=" h-4 w-4 opacity-50" />
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
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                        captionLayout="dropdown"
                        startMonth={new Date(new Date().getFullYear(), 0, 1)}
                        endMonth={new Date("2040-12-31")}
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
                <FormItem className="hidden">
                  <FormLabel>{t("Subscription Status")} *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select status")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">{t("Active")}</SelectItem>
                      <SelectItem value="inactive">{t("Inactive")}</SelectItem>
                      <SelectItem value="expired">{t("Expired")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
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
            /> */}

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>{t("City")} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter city")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>{t("Address")} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter address")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} value={field.value || ""} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} value={field.value || ""} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <FormItem>
                <FormLabel>{t("Location Pin")}</FormLabel>
                <LocationPicker
                  initialLat={
                    initialData?.latitude ?? form.getValues("latitude")
                  }
                  initialLng={
                    initialData?.longitude ?? form.getValues("longitude")
                  }
                  onChange={(lat, lng) => {
                    form.setValue("latitude", lat, {
                      shouldValidate: true,
                    });
                    form.setValue("longitude", lng, {
                      shouldValidate: true,
                    });
                  }}
                  onAddressSelect={(address, city) => {
                    form.setValue("address", address, {
                      shouldValidate: true,
                    });
                    form.setValue("city", city, {
                      shouldValidate: true,
                    });
                  }}
                />
              </FormItem>
            </div>
            <FormField
              control={form.control}
              name="logo"
              render={({
                field: { value: _value, onChange, ...fieldProps },
              }) => (
                <FormItem>
                  <FormLabel>{t("Company Logo")}</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        onChange(event.target.files && event.target.files[0]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
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
                    <FormLabel>{t("Is Verified")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* User Selection Toggle */}
        <div className="space-y-4">
          {!isEditMode && (
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {t("Admin User Selection")}
              </h3>
              <FormField
                control={form.control}
                name="use_existing_user"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      {t("Use Existing Admin")}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          )}

          {form.watch("use_existing_user") && !isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Select Existing Admin")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("Select Existing Admin")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {adminsData?.data?.map((user: User) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* User Details */}

        {!form.watch("use_existing_user") && !isEditMode && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("Admin User Details")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("User Name")} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter user name")} {...field} />
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
                    <FormLabel>{t("User Email")} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter user email")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user_password"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-4">
                    <FormLabel>{t("Password")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="p@ssw0rd"
                          className={`${locale === "ar" ? "pl-10" : "pr-10"}`}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute  top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${locale === "ar" ? "left-3" : "right-3"}`}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
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
                    <FormLabel>{t("Confirm Password")} *</FormLabel>
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
                name="user_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("User Phone")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          locale === "ar" ? "05xxxxxxxx" : "05xxxxxxxx"
                        }
                        type="tel"
                        dir={locale === "ar" ? "rtl" : "ltr"}
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
                    <FormLabel>{t("Date of Birth")}</FormLabel>
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
                              <span>{t("Pick a date of birth")}</span>
                            )}
                            <CalendarIcon className=" h-4 w-4 opacity-50" />
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
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : "",
                            )
                          }
                          disabled={(date) => date > minDate}
                          initialFocus
                          captionLayout="dropdown"
                          endMonth={minDate}
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
                      onValueChange={(val) => field.onChange(Number(val))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select gender")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">{t("Male")}</SelectItem>
                        <SelectItem value="2">{t("Female")}</SelectItem>
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
                  field: { value: _value, onChange, ...fieldProps },
                }) => (
                  <FormItem>
                    <FormLabel>{t("Personal Photo")}</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          onChange(event.target.files && event.target.files[0]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full cursor-pointer">
          {isEditMode ? t("Update Company") : t("Create Company")}
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
          {isEditMode ? t("Update Company") : t("Create New Company")}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
