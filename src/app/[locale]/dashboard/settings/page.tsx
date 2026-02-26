import Headers from "@/components/dashboard/header/header";
import SettingsDataTable from "@/components/dashboard/settings/settings-data-table";
import NewEntityButton from "@/components/common/new-entity-button/button";

const Settings = () => {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <Headers
          title="Settings"
          description="manage system settings"
        />
        <NewEntityButton
          url="/dashboard/settings/new"
          label="New Setting"
        />
      </header>
      <main>
        <SettingsDataTable />
      </main>
    </section>
  );
};

export default Settings;
