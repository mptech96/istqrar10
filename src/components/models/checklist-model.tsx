"use client";

import { Checklist } from "@/types/checklist";
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
import CreateChecklistForm from "../dashboard/checklists/create-checklist-form";
import { useTranslations } from "next-intl";

const ChecklistModel = ({
  checklist,
}: {
  checklist: Checklist;
}) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

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
          <DialogTitle>{t("Edit Checklist")}</DialogTitle>
          <DialogDescription>
            {t(
              "Make changes to your checklist here,Click update when you are done",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <CreateChecklistForm
            initialData={checklist}
            hideCardWrapper={true}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChecklistModel;
