import NewEntityButton from "@/components/common/new-entity-button/button";
import DailyVisitsDataTable from "@/components/dashboard/auditor-dashboard/daily-visitsj-table";
import Header from "@/components/dashboard/header/header";
import VisitsDataTable from "@/components/dashboard/visits/visits-data-table";

const DailyVisits = () => {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <Header
          title="Daily Visits"
          description="Manage visits"
        />

        <NewEntityButton
          url="/dashboard/visits/new"
          label="New Visit"
        />
      </header>
      <div className="flex flex-col gap-4">
        <DailyVisitsDataTable />
      </div>
    </section>
  );
};

export default DailyVisits;
