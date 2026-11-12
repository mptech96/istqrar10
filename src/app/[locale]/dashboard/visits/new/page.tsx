import CreateVisitForm from "@/components/dashboard/visits/create-visit-form";
import Header from "@/components/dashboard/header/header";
import React from "react";

const NewVisit = () => {
  return (
    <section className="flex flex-col gap-6">
      <Header title="New Visit" description="Schedule a new visit" />
      <CreateVisitForm />
    </section>
  );
};

export default NewVisit;
