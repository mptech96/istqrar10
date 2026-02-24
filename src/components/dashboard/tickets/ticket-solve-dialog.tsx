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
import { useSolveTicketMutation } from "@/services/api/tickets";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface TicketSolveDialogProps {
  ticket: Ticket;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TicketSolveDialog({
  ticket,
  open,
  onOpenChange,
}: TicketSolveDialogProps) {
  const t = useTranslations();
  const [solveTicket, { isLoading }] =
    useSolveTicketMutation();
  const [resolution, setResolution] = useState("");

  const handleSolve = async () => {
    if (!resolution.trim()) return;
    try {
      await solveTicket({
        ticketId: ticket.id,
        data: { resolution },
      }).unwrap();
      toast.success(t("Ticket solved successfully!"));
      onOpenChange(false);
    } catch {
      toast.error(t("Failed to solve ticket"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("Solve Ticket")} #{ticket.ticket_number}
          </DialogTitle>
          <DialogDescription>
            {t("Provide a resolution for this ticket")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("Resolution")} *</Label>
            <Textarea
              value={resolution}
              onChange={(e) =>
                setResolution(e.target.value)
              }
              placeholder={t(
                "Describe how this ticket was resolved",
              )}
              rows={4}
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
            onClick={handleSolve}
            disabled={isLoading || !resolution.trim()}
          >
            {isLoading
              ? t("Solving...")
              : t("Mark as Solved")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
