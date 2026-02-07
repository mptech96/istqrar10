import NewEntityButton from "@/components/common/new-entity-button/button";
import Header from "@/components/dashboard/header/header";
import InspectorsStats from "@/components/dashboard/inspectors/stats";
import InspectorsDataTable from "@/components/dashboard/inspectors/inspectors-data-table";

const Inspectors = () => {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <Header
          title="Inspectors"
          description="Manage inspectors"
        />

        <NewEntityButton
          url="/dashboard/inspectors/new"
          label="New Inspector"
        />
      </header>
      <div className="flex flex-col gap-4">
        <InspectorsStats />
        <InspectorsDataTable />
      </div>
    </section>
  );
};

export default Inspectors;
