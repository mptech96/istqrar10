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
import { Criteria } from "@/types/criteria";
import CreateCriteriaForm from "../dashboard/criteria/create-criteria-form";

interface CriteriaModelProps {
  criteria: Criteria;
}

const CriteriaModel = ({
  criteria,
}: CriteriaModelProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Edit Criteria")}</DialogTitle>
          <DialogDescription>
            {t(
              "Make changes to your criteria here,Click update when you are done",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <CreateCriteriaForm
            initialData={criteria}
            hideCardWrapper={true}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CriteriaModel;
