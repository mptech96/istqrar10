import {
  Monitor,
  CalendarCheck,
  Zap,
  ShieldCheck,
  GraduationCap,
  FileText,
  LayoutList,
  Eye,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIconKey } from "@/data/marketing";

const ICON_MAP: Record<ServiceIconKey, LucideIcon> = {
  monitor: Monitor,
  calendarCheck: CalendarCheck,
  zap: Zap,
  shieldCheck: ShieldCheck,
  graduationCap: GraduationCap,
  fileText: FileText,
  layoutList: LayoutList,
  eye: Eye,
};

export function ServiceIcon({
  iconKey,
  className = "w-6 h-6",
}: {
  iconKey: ServiceIconKey;
  className?: string;
}) {
  const Icon = ICON_MAP[iconKey];
  return <Icon className={className} />;
}
