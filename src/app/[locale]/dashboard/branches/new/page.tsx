import CreateBranchForm from "@/components/dashboard/branches/create-branch-form";
import Header from "@/components/dashboard/header/header";
import React from "react";

const NewBranch = () => {
  return (
    <section className="flex flex-col gap-6">
      <Header
        title="Branches"
        description="show all branches in the system , with reports"
      />
      <CreateBranchForm />
    </section>
  );
};

export default NewBranch;
