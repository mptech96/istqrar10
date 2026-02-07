import CreateCriteriaForm from "@/components/dashboard/criteria/create-criteria-form";
import Header from "@/components/dashboard/header/header";
import React from "react";

const NewCriteria = () => {
  return (
    <section className="flex flex-col gap-6">
      <Header
        title="New Criteria"
        description="Add a new evaluation criteria"
      />
      <CreateCriteriaForm />
    </section>
  );
};

export default NewCriteria;
