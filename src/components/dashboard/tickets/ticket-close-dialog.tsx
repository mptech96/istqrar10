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
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { Ticket } from "@/types/ticket";
import { useCloseTicketMutation } from "@/services/api/tickets";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface TicketCloseDialogProps {
  ticket: Ticket;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TicketCloseDialog({
  ticket,
  open,
  onOpenChange,
}: TicketCloseDialogProps) {
  const t = useTranslations();
  const [closeTicket, { isLoading }] =
    useCloseTicketMutation();
  const [notes, setNotes] = useState("");

  const handleClose = async () => {
    try {
      await closeTicket({
        ticketId: ticket.id,
        data: { notes },
      }).unwrap();
      toast.success(t("Ticket closed successfully!"));
      onOpenChange(false);
    } catch {
      toast.error(t("Failed to close ticket"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("Close Ticket")} #{ticket.ticket_number}
          </DialogTitle>
          <DialogDescription>
            {t(
              "Are you sure you want to close this ticket?",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("Notes")}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("Optional closing notes")}
              rows={3}
            />
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
            variant="destructive"
            onClick={handleClose}
            disabled={isLoading}
          >
            {isLoading
              ? t("Closing...")
              : t("Close Ticket")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
