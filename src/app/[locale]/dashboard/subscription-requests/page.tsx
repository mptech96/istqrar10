import React from "react";
import Header from "@/components/dashboard/header/header";
import SubscriptionRequestsDataTable from "@/components/dashboard/subscription-requests/data-table";

const SubscriptionRequestsPage = () => {
  return (
    <section className="mt-4">
      <Header
        title="Subscription Requests"
        description="View and manage user requests for subscription plans"
      />
      <SubscriptionRequestsDataTable />
    </section>
  );
};

export default SubscriptionRequestsPage;
