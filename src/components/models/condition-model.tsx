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
import { Question } from "@/types/question";
import { CreateConditionsForm } from "../dashboard/conditions/create-conditions-form";

interface ConditionModelProps {
  condition: Question;
}

const ConditionModel = ({
  condition,
}: ConditionModelProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Edit Condition")}</DialogTitle>
          <DialogDescription>
            {t(
              "Make changes to your condition here,Click update when you are done",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <CreateConditionsForm
            initialData={condition}
            hideCardWrapper={true}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConditionModel;
