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
import { createBranchSchema } from "@/schema/create-branch.schema.zod";
import {
  useCreateBranchMutation,
  useUpdateBranchMutation,
} from "@/services/api/branches";
import { useGetCompaniesQuery } from "@/services/api/companies";
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
import { Company } from "@/types/company";

import { Branch } from "@/types/branch";

interface CreateBranchFormProps {
  initialData?: Branch;
  onSuccess?: () => void;
  hideCardWrapper?: boolean;
}

export default function CreateBranchForm({
  initialData,
  onSuccess,
  hideCardWrapper = false,
}: CreateBranchFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const { start, stop } = useLoader();
  const [createBranch, { isLoading: isCreating }] =
    useCreateBranchMutation();
  const [updateBranch, { isLoading: isUpdating }] =
    useUpdateBranchMutation();

  const isEditMode = !!initialData;
  const isLoading = isCreating || isUpdating;
  // Fetch companies for selection (assuming a reasonable page size or search later)
  const { data: companiesData } = useGetCompaniesQuery(
    "page=1&page_size=100",
  );

  const form = useForm<
    z.infer<ReturnType<typeof createBranchSchema>>
  >({
    resolver: zodResolver(
      createBranchSchema(t),
    ) as Resolver<
      z.infer<ReturnType<typeof createBranchSchema>>
    >,
    defaultValues: initialData
      ? {
          status: initialData.status ?? true,
          category: initialData.category || "",
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          city: initialData.city,
          address: initialData.address,
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          compliance_score:
            initialData.compliance_score || 0,
          user_name: initialData.user_name || "",
          user_email: initialData.user_email || "",
          user_password: "",
          user_password_confirmation: "",
          user_phone: initialData.user_phone || "",
          user_birth_date: initialData.user_birth_date
            ? format(
                new Date(initialData.user_birth_date),
                "yyyy-MM-dd",
              )
            : "",
          user_gender: initialData.user_gender || 1,
          company_id: initialData.company_id,
        }
      : {
          status: true,
          category: "",
          name: "",
          email: "",
          phone: "",
          city: "",
          address: "",
          latitude: undefined,
          longitude: undefined,
          compliance_score: 0,
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
      start(
        isEditMode
          ? t("Updating branch")
          : t("Creating branch"),
      );
    } else {
      stop();
    }
  }, [isLoading, isEditMode, start, stop, t]);

  async function onSubmit(
    values: z.infer<ReturnType<typeof createBranchSchema>>,
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

    try {
      if (isEditMode && initialData) {
        await updateBranch({
          id: initialData.id,
          data: formData,
        }).unwrap();
        toast.success(t("Branch updated successfully!"));
      } else {
        await createBranch(formData).unwrap();
        toast.success(t("Branch created successfully!"));
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/branches");
      }
    } catch (error) {
      toast.error(
        isEditMode
          ? t("Failed to update branch")
          : t("Failed to create branch"),
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
        {/* Branch Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("Branch Details")}
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
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("Select Company")}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Branch Name")} *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter branch name")}
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
                    {t("Branch Email")} *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter email address")}
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
                    {t("Branch Phone")} *
                  </FormLabel>
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
                  <FormLabel>{t("Address")} *</FormLabel>
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Category")} *</FormLabel>
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
              name="compliance_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Compliance Score")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t(
                        "Enter compliance score",
                      )}
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          Number(e.target.value),
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
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Latitude")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder={t("Enter latitude")}
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          Number(e.target.value),
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
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Longitude")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder={t("Enter longitude")}
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          Number(e.target.value),
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
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-4">
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
          </div>
        </div>

        <Separator />

        {/* User Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("Manager Details")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("User Name")} *</FormLabel>
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
                  <FormLabel>{t("User Email")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter user email")}
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
              name="user_password_confirmation"
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
              name="user_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("User Phone")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter user phone")}
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
                            <span>{t("Pick a date")}</span>
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
                          placeholder={t("Select gender")}
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
          {isEditMode
            ? t("Update Branch")
            : t("Create Branch")}
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
            ? t("Update Branch")
            : t("Create New Branch")}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
