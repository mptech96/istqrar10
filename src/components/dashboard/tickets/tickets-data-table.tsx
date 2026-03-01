"use client";

import { ServerDataTable } from "@/components/dashboard/table/server-data-table";
import { getColumns } from "../columns/tickets";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useLoader } from "@/hooks/use-loader";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";
import {
  useGetAllTicketsQuery,
  useDeleteTicketMutation,
} from "@/services/api/tickets";
import { Ticket } from "@/types/ticket";
import { useAppSelector } from "@/lib/store";
import TicketModel from "@/components/models/ticket-model";
import TicketAssignDialog from "./ticket-assign-dialog";
import TicketSolveDialog from "./ticket-solve-dialog";
import TicketCloseDialog from "./ticket-close-dialog";
import { Input } from "@/components/ui/input";

const TicketsDataTable = () => {
  const { start, stop } = useLoader();
  const t = useTranslations();
  const currentUser = useAppSelector(
    (state) => state.auth.user,
  );
  const [deleteTicket] = useDeleteTicketMutation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const query = `page=${page}&page_size=${pageSize}${search ? `&search=${search}` : ""}`;

  const {
    data: ticketsData,
    isLoading,
    error,
  } = useGetAllTicketsQuery(query);

  // Dialog states
  const [assignDialogOpen, setAssignDialogOpen] =
    useState(false);
  const [solveDialogOpen, setSolveDialogOpen] =
    useState(false);
  const [closeDialogOpen, setCloseDialogOpen] =
    useState(false);
  const [editDialogOpen, setEditDialogOpen] =
    useState(false);
  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }

    if (error) {
      toast.error(t("Failed to fetch tickets"));
    }
  }, [isLoading, error, start, stop, t]);

  const handleEdit = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setEditDialogOpen(true);
  };

  const handleAssign = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setAssignDialogOpen(true);
  };

  const handleSolve = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setSolveDialogOpen(true);
  };

  const handleClose = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setCloseDialogOpen(true);
  };

  const handleDelete = async (ticket: Ticket) => {
    try {
      await deleteTicket(ticket.id).unwrap();
      toast.success(t("Ticket deleted successfully!"));
    } catch {
      toast.error(t("Failed to delete ticket"));
    }
  };

  const columns = getColumns(t, currentUser, {
    onEdit: handleEdit,
    onAssign: handleAssign,
    onSolve: handleSolve,
    onClose: handleClose,
    onDelete: handleDelete,
  });

  const tickets: Ticket[] = Array.isArray(ticketsData)
    ? ticketsData
    : ticketsData?.data || [];

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 5 * 0.1 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg">
                {t("Tickets")}
              </CardTitle>
              <div className="flex w-full md:w-64">
                <Input
                  placeholder={t("Search")}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </CardHeader>
          {tickets.length === 0 && (
            <p className="text-center text-md text-muted-foreground p-4">
              {t("No tickets found")}
            </p>
          )}
          {tickets.length > 0 && (
            <ServerDataTable
              columns={columns}
              data={tickets}
              pageCount={ticketsData?.meta?.last_page || 1}
              page={ticketsData?.meta?.current_page || 1}
              setPage={setPage}
            />
          )}
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      {selectedTicket && editDialogOpen && (
        <TicketModel ticket={selectedTicket} />
      )}

      {/* Assign Dialog */}
      {selectedTicket && (
        <TicketAssignDialog
          ticket={selectedTicket}
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
        />
      )}

      {/* Solve Dialog */}
      {selectedTicket && (
        <TicketSolveDialog
          ticket={selectedTicket}
          open={solveDialogOpen}
          onOpenChange={setSolveDialogOpen}
        />
      )}

      {/* Close Dialog */}
      {selectedTicket && (
        <TicketCloseDialog
          ticket={selectedTicket}
          open={closeDialogOpen}
          onOpenChange={setCloseDialogOpen}
        />
      )}
    </>
  );
};

export default TicketsDataTable;
