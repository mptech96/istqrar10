"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Ticket } from "@/types/ticket";
import { useAssignTicketMutation } from "@/services/api/tickets";
import { useGetInspectorsQuery } from "@/services/api/inspectors";
import { Inspectors } from "@/types/inspectors";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface TicketAssignDialogProps {
  ticket: Ticket;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TicketAssignDialog({
  ticket,
  open,
  onOpenChange,
}: TicketAssignDialogProps) {
  const t = useTranslations();
  const [assignTicket, { isLoading }] =
    useAssignTicketMutation();
  const { data: auditorsData } = useGetInspectorsQuery(
    "page=1&page_size=1000",
  );
  const [selectedAuditor, setSelectedAuditor] =
    useState<string>("");

  const handleAssign = async () => {
    if (!selectedAuditor) return;
    try {
      await assignTicket({
        ticketId: ticket.id,
        data: { assigned_to: Number(selectedAuditor) },
      }).unwrap();
      toast.success(t("Ticket assigned successfully!"));
      onOpenChange(false);
    } catch {
      toast.error(t("Failed to assign ticket"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("Assign Ticket")} #{ticket.ticket_number}
          </DialogTitle>
          <DialogDescription>
            {t("Select user to assign this ticket to")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("Assign To")}</Label>
            <Select
              onValueChange={setSelectedAuditor}
              value={selectedAuditor}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("Select user")}
                />
              </SelectTrigger>
              <SelectContent>
                {auditorsData?.data?.map(
                  (auditor: Inspectors) => (
                    <SelectItem
                      key={auditor.id}
                      value={auditor.id.toString()}
                    >
                      {auditor.name} ({auditor.email})
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleAssign}
            disabled={isLoading || !selectedAuditor}
          >
            {isLoading ? t("Assigning...") : t("Assign")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
