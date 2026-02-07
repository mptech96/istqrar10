import CreateChecklistForm from "@/components/dashboard/checklists/create-checklist-form";
import Header from "@/components/dashboard/header/header";
import React from "react";

const NewChecklist = () => {
  return (
    <section className="flex flex-col gap-6">
      <Header
        title="New Checklist"
        description="Add a new checklist"
      />
      <CreateChecklistForm />
    </section>
  );
};

export default NewChecklist;
