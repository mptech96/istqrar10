import ChecklistsDataTable from "../checklists/checklists-data-table";
import Stats from "./stats";

export const OverView = () => {
  return (
    <section>
      <Stats />
      <ChecklistsDataTable />
    </section>
  );
};
