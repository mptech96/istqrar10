import NewEntityButton from "@/components/common/new-entity-button/button";
import Header from "@/components/dashboard/header/header";
import TicketsDataTable from "@/components/dashboard/tickets/tickets-data-table";

const TicketsPage = () => {
  return (
    <section>
      <div className="flex items-center justify-between">
        <Header
          title="Tickets"
          description="View and manage support tickets"
        />
        <NewEntityButton
          url="/dashboard/tickets/new"
          label="Create Ticket"
        />
      </div>
      <TicketsDataTable />
    </section>
  );
};

export default TicketsPage;
