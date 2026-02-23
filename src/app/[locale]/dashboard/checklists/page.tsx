import NewEntityButton from "@/components/common/new-entity-button/button";
import Header from "@/components/dashboard/header/header";

import ChecklistOverview from "@/components/dashboard/checklists/checklist-overview";

const Checklists = () => {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <Header
          title="Checklists"
          description="Manage checklists"
        />
        <div className="flex gap-2">
          <NewEntityButton
            url="/dashboard/conditions/new"
            label="Add Condition"
          />
          <NewEntityButton
            url="/dashboard/checklists/new"
            label="New Checklist"
          />
        </div>
      </header>
      <div className="flex flex-col gap-4">
        <ChecklistOverview />
      </div>
    </section>
  );
};

export default Checklists;
