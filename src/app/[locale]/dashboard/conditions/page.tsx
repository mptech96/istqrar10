import NewEntityButton from "@/components/common/new-entity-button/button";
import Header from "@/components/dashboard/header/header";
import React from "react";

const ConditionsPage = () => {
  return (
    <section>
      <div className="flex items-center justify-between">
        <Header
          title="Conditions"
          description="show all conditions in the system , with reports"
        />
        <NewEntityButton
          url="/dashboard/conditions/new"
          label="Add Condition"
        />
      </div>
    </section>
  );
};

export default ConditionsPage;
