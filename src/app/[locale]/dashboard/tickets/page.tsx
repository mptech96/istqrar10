import Header from "@/components/dashboard/header/header";
import TicketsDataTable from "@/components/dashboard/tickets/tickets-data-table";

const TicketsPage = () => {
  return (
    <section>
      <Header
        title="Tickets"
        description="View and manage support tickets"
      />
      <TicketsDataTable />
    </section>
  );
};

export default TicketsPage;
