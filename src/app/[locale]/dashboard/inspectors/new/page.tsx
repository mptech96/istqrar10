import CreateInspectorForm from "@/components/dashboard/inspectors/create-inspector-form";
import Header from "@/components/dashboard/header/header";
import React from "react";

const NewInspector = () => {
  return (
    <section className="flex flex-col gap-6">
      <Header
        title="New User"
        description="Add a new user"
      />
      <CreateInspectorForm />
    </section>
  );
};

export default NewInspector;
