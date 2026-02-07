import NewEntityButton from "@/components/common/new-entity-button/button";
import BranchesDataTable from "@/components/dashboard/branches/branches-data-table";
import BranchesStats from "@/components/dashboard/branches/stats";
import Header from "@/components/dashboard/header/header";

import React from "react";

const Branches = () => {
  return (
    <section>
      <div className="flex items-center justify-between">
        <Header
          title="Branches"
          description="show all branches in the system , with reports"
        />
        <NewEntityButton
          url="/dashboard/branches/new"
          label="Add Branch"
        />
      </div>
      <div className="mt-6">
        <BranchesStats />
        <div className="mt-6">
          <BranchesDataTable />
        </div>
      </div>
    </section>
  );
};

export default Branches;
