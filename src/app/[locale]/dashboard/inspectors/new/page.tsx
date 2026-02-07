import CreateInspectorForm from "@/components/dashboard/inspectors/create-inspector-form";
import Header from "@/components/dashboard/header/header";
import React from "react";

const NewInspector = () => {
  return (
    <section className="flex flex-col gap-6">
      <Header
        title="New Inspector"
        description="Add a new inspector"
      />
      <CreateInspectorForm />
    </section>
  );
};

export default NewInspector;
