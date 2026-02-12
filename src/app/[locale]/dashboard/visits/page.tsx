import NewEntityButton from "@/components/common/new-entity-button/button";
import Header from "@/components/dashboard/header/header";
import VisitsDataTable from "@/components/dashboard/visits/visits-data-table";

const Visits = () => {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <Header
          title="Visits"
          description="Manage visits"
        />

        <NewEntityButton
          url="/dashboard/visits/new"
          label="New Visit"
        />
      </header>
      <div className="flex flex-col gap-4">
        <VisitsDataTable />
      </div>
    </section>
  );
};

export default Visits;
