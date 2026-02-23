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
import { SquarePen } from "lucide-react";
import { useTranslations } from "next-intl";
import { Visit } from "@/types/visit";
import CreateVisitForm from "../dashboard/visits/create-visit-form";

interface VisitModelProps {
  visit: Visit;
}

const VisitModel = ({ visit }: VisitModelProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <SquarePen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Edit Visit")}</DialogTitle>
          <DialogDescription>
            {t(
              "Make changes to your visit here,Click update when you are done",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <CreateVisitForm
            initialData={visit}
            hideCardWrapper={true}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisitModel;
