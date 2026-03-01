// Menu items.
import {
  Banknote,
  BarChart,
  Building2,
  Calendar,
  ChartGantt,
  Home,
  Inbox,
  Landmark,
  ListChecks,
  ListOrdered,
  Settings,
  Store,
  Telescope,
  Ticket,
  User,
  Users,
  Wallet,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
 
}


export const super_admin_items: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    
  },
  {
    title: "Companies",
    url: "/dashboard/companies",
    icon: Landmark,
    
  },
  {
    title: "Branches",
    url: "/dashboard/branches",
    icon: Building2,
    
  },
  {
    title: "Users",
    url: "/dashboard/inspectors",
    icon: Users,
    
  },
  {
    title: "Criterias",
    url: "/dashboard/criterias",
    icon: ChartGantt ,
    
  },
  {
    title: "Watch lists",
    url: "/dashboard/checklists",
    icon: ListChecks ,
    
  },
  /* {
    title: "List Of conditions",
    url: "/dashboard/conditions",
    icon: ListOrdered ,
    
  }, */
  {
    title: "Visits",
    url: "/dashboard/visits",
    icon: Telescope,
    
  },
  {
    title: "Tickets",
    url: "/dashboard/tickets",
    icon: Ticket,

  },
  /* {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
    
  },
  {
    title: "Models",
    url: "/dashboard/models",
    icon: Settings,
    
  }, */
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    
  },
];

export const auditor_items: SidebarItem[] = [
  {
    title: "My Dashboard",
    url: "/dashboard/auditor-dashboard",
    icon: Home,
    
  },
  {
    title: "Daily Visits",
    url: "/dashboard/daily-visits",
    icon: Telescope,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
    
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart,
    
  },
];
export const company_admin_items: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/company-dashboard",
    icon: Home,
    
  },
  {
    title: "Branches",
    url: "/dashboard/branches",
    icon: Building2,
  },
  {
    title: "Visits",
    url: "/dashboard/visits",
    icon: Telescope,
    
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: BarChart,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User ,
  },
];
export const branch_manager_items: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/branch-dashboard",
    icon: Home,
    
  },
  /* {
    title: "Criterias",
    url: "/dashboard/criterias",
    icon: ChartGantt ,
    
  }, 
  {
    title: "Watch lists",
    url: "/dashboard/checklists",
    icon: ListChecks ,
    
  },*/
  {
    title: "Visits",
    url: "/dashboard/visits",
    icon: Telescope,
    
  },
   {
    title: "Tickets",
    url: "/dashboard/tickets",
    icon: Ticket,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: BarChart,
    
  },
];
export const sidebarItems = {
  super_admin: super_admin_items,
  auditor: auditor_items,
  company_admin: company_admin_items,
  branch_manager: branch_manager_items,
};