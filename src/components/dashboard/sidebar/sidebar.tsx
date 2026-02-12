"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/dashboard/user-avatar/user-avatar";

import { LogIn, LogOut } from "lucide-react";
import {
  SidebarItem,
  LeaderItems,
} from "@/components/dashboard/sidebar/sidebar-items";
import Image from "next/image";

export function AppSidebar() {
  const locale = useLocale();

  const t = useTranslations();

  const [items] = useState(() => LeaderItems);

  // 2. Sync Language with DOM and i18n

  return (
    <Sidebar
      side={locale === "ar" ? "right" : "left"}
      className="p-4  "
    >
      <SidebarHeader className="  ">
        <div className="flex items-center gap-2 justify-center  ">
          <div className=" ">
            <Image
              className="object-fill "
              src="https://res.cloudinary.com/doxyvufkz/image/upload/v1769547758/Gemini_Generated_Image_v13ifrv13ifrv13i-removebg-preview_lqvicb.png"
              alt="istqrar"
              width={80}
              height={80}
            />
          </div>
          {/* <h2 className="text-xl font-semibold leading-12 text-(--primary-300)  h-16">
            {t("alballd")}
          </h2> */}
        </div>
      </SidebarHeader>
      <Separator className=" w-3/4 mx-auto shadow-sm" />
      <SidebarContent className="rounded-lg  ">
        <SidebarGroup className="border-0 rounded-lg">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item: SidebarItem) => (
                <SidebarMenuItem
                  key={item.title}
                  className="gap-3"
                >
                  <Link href={item.url}>
                    <SidebarMenuButton
                      asChild
                      className="text-lg py-5 hover:bg-linear-to-br from-cyan-500/10 to-coralRed/10 cursor-pointer active:bg-linear-to-br from-cyan-500/10 to-coralRed/10 "
                    >
                      <div className="flex items-center gap-2">
                        <item.icon />
                        <span>
                          {t(item.title as string)}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator className=" w-3/4 mx-auto shadow-sm" />
      <SidebarFooter className="h-28 flex flex-row items-center gap-10 ">
        <div className="flex items-center gap-2 ">
          <UserAvatar />
        </div>
        <Link href="/signin">
          {locale === "ar" ? (
            <LogOut size={20} />
          ) : (
            <LogIn size={20} />
          )}
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
