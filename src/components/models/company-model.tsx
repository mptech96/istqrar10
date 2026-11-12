"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { Company } from "@/types/company";
import CreateCompanyForm from "../dashboard/companies/create-company-form";
import { UpdateCompanySchema } from "@/schema/create-company.schema.zod";
import z from "zod";
import { useUpdateCompanyMutation } from "@/services/api/companies";
import { toast } from "sonner";
import { useLoader } from "@/hooks/use-loader";

const CompanyModel = ({ company }: { company: Company }) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const { start, stop } = useLoader();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const onSubmit = async (values: UpdateCompanySchema) => {
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

      // Ignore empty password fields when updating
      if (
        (key === "user_password" || key === "user_password_confirmation") &&
        !value
      ) {
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
      start();
      const res = await updateCompany({
        id: company.id,
        data: formData,
      }).unwrap();
      toast.success(t("Company updated successfully!"));
    } catch (error) {
      toast.error(t("Failed to update company."));
    } finally {
      stop();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      {/* Set a max height so the form is scrollable without breaking the layout */}
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Edit Company")}</DialogTitle>
          <DialogDescription>
            {t(
              "Make changes to your company here,Click update when you are done",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <CreateCompanyForm
            initialData={company}
            updateMode={true}
            hideCardWrapper={true}
            onSuccess={() => setOpen(false)}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyModel;
