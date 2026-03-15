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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { createTicketSchema } from "@/schema/create-ticket.schema.zod";
import {
  useCreateTicketMutation,
  useUpdateTicketMutation,
} from "@/services/api/tickets";
import { useGetCompaniesQuery } from "@/services/api/companies";
import { useGetBranchesQuery } from "@/services/api/branches";
import { useGetVisitsQuery } from "@/services/api/visits";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoader } from "@/hooks/use-loader";
import { useEffect } from "react";
import {
  Ticket,
  TICKET_TYPES,
  PRIORITIES,
  DEPARTMENTS,
} from "@/types/ticket";
import { Company } from "@/types/company";
import { Branch } from "@/types/branch";
import { Visit } from "@/types/visit";

interface CreateTicketFormProps {
  initialData?: Ticket;
  onSuccess?: () => void;
  hideCardWrapper?: boolean;
}

export default function CreateTicketForm({
  initialData,
  onSuccess,
  hideCardWrapper = false,
}: CreateTicketFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const { start, stop } = useLoader();
  const [createTicket, { isLoading: isCreating }] =
    useCreateTicketMutation();
  const [updateTicket, { isLoading: isUpdating }] =
    useUpdateTicketMutation();

  const isEditMode = !!initialData;
  const isLoading = isCreating || isUpdating;

  const form = useForm<
    z.infer<ReturnType<typeof createTicketSchema>>
  >({
    resolver: zodResolver(
      createTicketSchema(t),
    ) as Resolver<
      z.infer<ReturnType<typeof createTicketSchema>>
    >,
    defaultValues: initialData
      ? {
          user_type: initialData.user_type,
          company_id: initialData.company_id || undefined,
          branch_id: initialData.branch_id || undefined,
          visit_id: initialData.visit_id || undefined,
          subject: initialData.subject,
          description: initialData.description,
          ticket_type: initialData.ticket_type,
          priority: initialData.priority || undefined,
          department: initialData.department || undefined,
        }
      : {
          user_type: undefined,
          company_id: undefined,
          branch_id: undefined,
          visit_id: undefined,
          subject: "",
          description: "",
          ticket_type: undefined,
          priority: undefined,
          department: undefined,
        },
  });

  const selectedCompanyId = form.watch("company_id");
  const selectedBranchId = form.watch("branch_id");

  const { data: companiesData } = useGetCompaniesQuery(
    "page=1&limit=1000",
  );
  const { data: branchesData } = useGetBranchesQuery(
    `page=1&page_size=1000${selectedCompanyId ? `&company_id=${selectedCompanyId}` : ""}`,
    { skip: !selectedCompanyId },
  );
  const { data: visitsData } = useGetVisitsQuery(
    `page=1&page_size=1000${selectedBranchId ? `&branch_id=${selectedBranchId}` : ""}`,
    { skip: !selectedBranchId },
  );

  // Reset branch and visit if company changes
  useEffect(() => {
    if (selectedCompanyId && !isEditMode) {
      form.setValue("branch_id", undefined as unknown as number);
      form.setValue("visit_id", undefined as unknown as number);
    }
  }, [selectedCompanyId, form, isEditMode]);

  // Reset visit if branch changes
  useEffect(() => {
    if (selectedBranchId && !isEditMode) {
      form.setValue("visit_id", undefined as unknown as number);
    }
  }, [selectedBranchId, form, isEditMode]);

  useEffect(() => {
    if (isLoading) {
      start(
        isEditMode
          ? t("Updating ticket")
          : t("Creating ticket"),
      );
    } else {
      stop();
    }
  }, [isLoading, isEditMode, start, stop, t]);

  async function onSubmit(
    values: z.infer<ReturnType<typeof createTicketSchema>>,
  ) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (
          key === "attachments" &&
          value instanceof FileList
        ) {
          Array.from(value).forEach((file) => {
            formData.append("attachments[]", file);
          });
        } else if (typeof value === "number") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      }
    });

    try {
      if (isEditMode && initialData) {
        await updateTicket({
          id: initialData.id,
          data: formData,
        }).unwrap();
        toast.success(t("Ticket updated successfully!"));
      } else {
        await createTicket(formData).unwrap();
        toast.success(t("Ticket created successfully!"));
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/tickets");
      }
    } catch (error) {
      toast.error(
        isEditMode
          ? t("Failed to update ticket")
          : t("Failed to create ticket"),
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
        {/* Ticket Type & User Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("Ticket Information")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="user_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("User Type")} *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "Select user type",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="company">
                        {t("Company")}
                      </SelectItem>
                      <SelectItem value="individual">
                        {t("Individual")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ticket_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Ticket Type")} *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "Select ticket type",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TICKET_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Priority")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("Select priority")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {t(p)}
                        </SelectItem>
                      ))}
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "Select department",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {t(d)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Related Entities */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("Related Information")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Company")}</FormLabel>
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
                  <FormLabel>{t("Branch")}</FormLabel>
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
              name="visit_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Visit")}</FormLabel>
                  <Select
                    onValueChange={(val) =>
                      field.onChange(Number(val))
                    }
                    value={field.value?.toString()}
                    disabled={!selectedBranchId}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedBranchId
                              ? t("Select branch first")
                              : t("Select visit")
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {visitsData?.data?.map(
                        (visit: Visit) => (
                          <SelectItem
                            key={visit.id}
                            value={visit.id.toString()}
                          >
                            {visit.branch?.name ||
                              t("Visit")}{" "}
                            - {visit.scheduled_date}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Subject & Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("Details")}
          </h3>
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Subject")} *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Enter subject")}
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
              <FormItem>
                <FormLabel>{t("Description")} *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t(
                      "Describe your issue in detail",
                    )}
                    className="resize-none"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attachments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Attachments")}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) =>
                      field.onChange(e.target.files)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          {isEditMode
            ? t("Update Ticket")
            : t("Create Ticket")}
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
            ? t("Edit Ticket")
            : t("Create Support Ticket")}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
