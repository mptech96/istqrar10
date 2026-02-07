import NewEntityButton from "@/components/common/new-entity-button/button";
import Header from "@/components/dashboard/header/header";
import ChecklistsDataTable from "@/components/dashboard/checklists/checklists-data-table";

const Checklists = () => {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <Header
          title="Checklists"
          description="Manage checklists"
        />

        <NewEntityButton
          url="/dashboard/checklists/new"
          label="New Checklist"
        />
      </header>
      <div className="flex flex-col gap-4">
        <ChecklistsDataTable />
      </div>
    </section>
  );
};

export default Checklists;
