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

const CompanyModel = ({
  company,
}: {
  company: Company;
}) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  console.log("company data", company);
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
            hideCardWrapper={true}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyModel;
