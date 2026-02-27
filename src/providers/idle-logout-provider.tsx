"use client";

import { useIdleLogout } from "@/hooks/use-idle-logout";
import React from "react";

export function IdleLogoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useIdleLogout();
  return <>{children}</>;
}
