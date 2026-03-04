import React from "react";
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
import { useState } from "react";
import { Branch } from "@/types/branch";
import CreateBranchForm from "../dashboard/branches/create-branch-form";

const BranchModel = ({ branch }: { branch: Branch }) => {
  console.log("branch data", branch);
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
          <DialogTitle>{t("Edit Branch")}</DialogTitle>
          <DialogDescription>
            {t(
              "Make changes to your branch here,Click update when you are done",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <CreateBranchForm
            initialData={branch}
            hideCardWrapper={true}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BranchModel;
