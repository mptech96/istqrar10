import Header from "@/components/dashboard/header/header";
import CreateTicketForm from "@/components/dashboard/tickets/create-ticket-form";

const NewTicketPage = () => {
  return (
    <section>
      <Header
        title="Create Support Ticket"
        description="Submit a new support ticket"
      />
      <div className="mt-4">
        <CreateTicketForm />
      </div>
    </section>
  );
};

export default NewTicketPage;
