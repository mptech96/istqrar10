/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { useTranslations } from "next-intl";
import CreateCompanyForm from "./create-company-form";
import { createCompanySchema } from "@/schema/create-company.schema.zod";
import z from "zod";
import { useCreateCompanyMutation } from "@/services/api/companies";
import { toast } from "sonner";
import { useLoader } from "@/hooks/use-loader";

const CreateCompanyModel = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const { start, stop } = useLoader();
  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const onSubmit = async (
    values: z.infer<ReturnType<typeof createCompanySchema>>,
  ) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      // Ignore user details if user_id is selected (and not "new")
      const isManualUserField =
        key.startsWith("user_") &&
        key !== "user_id" &&
        key !== "use_existing_user";
      if (values.use_existing_user && isManualUserField) {
        return;
      }

      // Ignore use_existing_user virtual field
      if (key === "use_existing_user") return;
      if (key === "subscription_start" || key === "subscription_end") {
        formData.append(key, (value as Date).toISOString());
        return;
      }

      if (value !== undefined && value !== null) {
        if (typeof value === "boolean") {
          formData.append(key, value ? "1" : "0");
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value as string);
        }
      }
    });
    try {
      console.log("Submitting form data:", formData);
      start();
      const res = await createCompany(formData).unwrap();
      toast.success(t("Company created successfully!"));
    } catch (error: any) {
      toast.error(error.data.message || t("Failed to create company."));
    } finally {
      stop();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-[rgba(248,142,140,0.97)] w-[150px] text-white hover:bg-[rgba(248,142,140,1)] cursor-pointer py-4 "
        >
          {t("Create Company")}
        </Button>
      </DialogTrigger>
      {/* Set a max height so the form is scrollable without breaking the layout */}
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Create Company")}</DialogTitle>
          <DialogDescription>
            {t(
              "Make changes to your company here,Click update when you are done",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <CreateCompanyForm
            hideCardWrapper={true}
            onSuccess={() => setOpen(false)}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCompanyModel;
