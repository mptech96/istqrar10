import { AppSidebar } from "@/components/dashboard/sidebar/sidebar";
import ToolBar from "@/components/dashboard/tool-bar/toolbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import React from "react";

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SidebarProvider className="p-4 pe-8 relative rounded-lg ">
      <AppSidebar />
      <main className="flex w-full flex-col mt-2 space-y-2 ">
        <ToolBar />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  );
};

export default DashboardLayout;
