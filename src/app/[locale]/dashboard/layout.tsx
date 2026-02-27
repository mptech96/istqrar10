import { AppSidebar } from "@/components/dashboard/sidebar/sidebar";
import ToolBar from "@/components/dashboard/tool-bar/toolbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import SupportButton from "@/components/common/support-button";
import { IdleLogoutProvider } from "@/providers/idle-logout-provider";
import React from "react";

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SidebarProvider className="p-4 pe-8 relative rounded-lg ">
      <IdleLogoutProvider>
        <AppSidebar />
        <main className="flex w-full flex-col mt-2 space-y-2 ">
          <ToolBar />
          {children}
        </main>
        <SupportButton />
      </IdleLogoutProvider>
    </SidebarProvider>
  );
};

export default DashboardLayout;
