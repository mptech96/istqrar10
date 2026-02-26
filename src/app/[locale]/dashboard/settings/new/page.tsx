import CreateSettingForm from "@/components/dashboard/settings/create-setting-form";
import Headers from "@/components/dashboard/header/header";

export default function NewSettingPage() {
  return (
    <section className="flex flex-col gap-6">
      <Headers
        title="New Setting"
        description="Create a new system setting"
      />
      <main>
        <div className="mx-auto">
          <CreateSettingForm />
        </div>
      </main>
    </section>
  );
}
