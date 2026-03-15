import NewEntityButton from "@/components/common/new-entity-button/button";
import Header from "@/components/dashboard/header/header";
import InspectorsStats from "@/components/dashboard/inspectors/stats";
import InspectorsDataTable from "@/components/dashboard/inspectors/inspectors-data-table";
import OverViewStats from "@/components/dashboard/over-view/stats";

const Inspectors = () => {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <Header
          title="Users"
          description="Users Management"
        />

        <NewEntityButton
          url="/dashboard/inspectors/new"
          label="New User"
        />
      </header>
      <div className="flex flex-col gap-4">
        <OverViewStats />
        <InspectorsDataTable />
      </div>
    </section>
  );
};

export default Inspectors;
