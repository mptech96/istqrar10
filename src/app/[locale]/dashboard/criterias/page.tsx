import NewEntityButton from "@/components/common/new-entity-button/button";
import Header from "@/components/dashboard/header/header";
import CriteriaDataTable from "@/components/dashboard/criteria/criteria-data-table";

const Criterias = () => {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <Header
          title="Criteria"
          description="Manage evaluation criteria"
        />

        <NewEntityButton
          url="/dashboard/criterias/new"
          label="New Criteria"
        />
      </header>
      <div className="flex flex-col gap-4">
        <CriteriaDataTable />
      </div>
    </section>
  );
};

export default Criterias;
