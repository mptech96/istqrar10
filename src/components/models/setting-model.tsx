"use client";

import { SmartSetting, SettingType } from "@/types/setting";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import CreateSettingForm from "../dashboard/settings/create-setting-form";
import { useTranslations } from "next-intl";
import { useDeleteSettingMutation } from "@/services/api/setting";
import { toast } from "sonner";

const SettingModel = ({
  setting,
}: {
  setting: SmartSetting<SettingType>;
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const t = useTranslations();
  const [deleteSetting, { isLoading: isDeleting }] =
    useDeleteSettingMutation();

  const handleDelete = async () => {
    try {
      await deleteSetting({ id: setting.id }).unwrap();
      toast.success(t("Setting deleted successfully!"));
      setOpenDelete(false);
    } catch (error) {
      toast.error(t("Failed to delete setting"));
      console.error(error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("Edit Setting")}</DialogTitle>
            <DialogDescription>
              {t(
                "Make changes to the system setting here,Click save when you are done",
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <CreateSettingForm
              initialData={setting}
              hideCardWrapper={true}
              onSuccess={() => setOpenEdit(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDelete}
        onOpenChange={setOpenDelete}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Are you sure?")}</DialogTitle>
            <DialogDescription>
              {t(
                "This action cannot be undone,This will permanently delete the setting",
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t("Deleting") : t("Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingModel;
