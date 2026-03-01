import ChecklistsDataTable from "../checklists/checklists-data-table";
import CompaniesDataTable from "../companies/companies-data-table";
import Stats from "./stats";
import VisitAreaChart from "./visit-chart";

export const OverView = () => {
  return (
    <section className="space-y-6">
      <Stats />
      <VisitAreaChart />
      <ChecklistsDataTable />
      <CompaniesDataTable />
    </section>
  );
};
