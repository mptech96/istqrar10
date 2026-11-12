import React from "react";
import Header from "@/components/dashboard/header/header";
import VisitReport from "@/components/dashboard/visits/visit-report";

const VisitReportPage = () => {
  return (
    <section className="flex flex-col gap-4">
      <Header title="Visit Report" description="Visit report" />
      <div className="flex flex-col gap-4">
        <VisitReport />
      </div>
    </section>
  );
};

export default VisitReportPage;
