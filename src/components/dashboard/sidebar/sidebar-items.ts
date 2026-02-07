// Menu items.
import {
  Banknote,
  BarChart,
  ChartGantt,
  Home,
  Inbox,
  ListChecks,
  Settings,
  Store,
  Wallet,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
 
}

export const LeaderItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    
  },
  {
    title: "Companies",
    url: "/dashboard/companies",
    icon: Inbox,
    
  },
  {
    title: "Branches",
    url: "/dashboard/branches",
    icon: Store,
    
  },
  {
    title: "inspectors",
    url: "/dashboard/inspectors",
    icon: Banknote,
    
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
  {
    title: "Visits",
    url: "/dashboard/visits",
    icon: Wallet,
    
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: BarChart,
    
  },
  {
    title: "Models",
    url: "/dashboard/models",
    icon: Settings,
    
  },
];

export const AgentItems: SidebarItem[] = [
  {
    title: "My Dashboard",
    url: "/my-dashboard",
    icon: Home,
    
  },
  {
    title: "Daily Visits",
    url: "/daily-visits",
    icon: Inbox,
    
  },
  {
    title: "My Stores",
    url: "/my-stores",
    icon: Store,
    
  },
  {
    title: "My Commissions",
    url: "/my-commission",
    icon: Banknote,
    
  },
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
    
  },
];