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
import { useCallback, useEffect, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/dashboard/user-avatar/user-avatar";

import { LogIn, LogOut } from "lucide-react";
import {
  sidebarItems,
  SidebarItem,
} from "@/components/dashboard/sidebar/sidebar-items";
import Image from "next/image";
import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/store";
import { logout as logoutAction } from "@/features/auth-slice";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLogoutMutation } from "@/services/api/auth";
import { useLoader } from "@/hooks/use-loader";
import { toast } from "sonner";

export function AppSidebar() {
  const locale = useLocale();
  const { user } = useAppSelector((state) => state.auth);
  const { start, stop } = useLoader();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const [logout, { isLoading: isLogoutLoading }] =
    useLogoutMutation();
  const items = useMemo(() => {
    return user && user.role
      ? sidebarItems[
          user.role as keyof typeof sidebarItems
        ] || []
      : [];
  }, [user]);

  const logoutHandler = async () => {
    console.log("logout");
    try {
      const res = await logout({}).unwrap();

      console.log("logout", res);
      if (res.success) {
        toast.success(t("Logged out successfully"));
        dispatch(logoutAction());
        router.push(`/login`);
      }
    } catch (error) {
      toast.error(t("Failed to logout"));
    }
  };

  useEffect(() => {
    if (isLogoutLoading) {
      start();
    } else {
      stop();
    }
  }, [isLogoutLoading, start, stop]);

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
              src="https://res.cloudinary.com/doxyvufkz/image/upload/v1772428106/ChatGPT_Image_Mar_2_2026_07_08_05_AM_ccmhaf.png"
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
                      isActive={
                        item.url === "/dashboard"
                          ? pathname === "/dashboard"
                          : pathname.startsWith(item.url)
                      }
                      className="text-lg py-5 hover:bg-linear-to-br from-cyan-500/10 to-coralRed/10 cursor-pointer relative z-10 
                      data-[active=true]:after:content-[''] data-[active=true]:after:absolute data-[active=true]:after:top-1/2 data-[active=true]:after:-translate-y-1/2 data-[active=true]:after:end-2 data-[active=true]:after:w-1 data-[active=true]:after:h-4 data-[active=true]:after:bg-coralRed data-[active=true]:after:rounded-full data-[active=true]:after:shadow-[0_0_8px_rgba(248,113,113,0.6)]
                      active:bg-linear-to-br from-cyan-500/10 to-coralRed/10 data-[active=true]:bg-linear-to-br data-[active=true]:from-cyan-500/15 data-[active=true]:to-coralRed/15 data-[active=true]:font-semibold"
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
        <p
          className="cursor-pointer"
          onClick={logoutHandler}
        >
          {locale === "ar" ? (
            <LogOut size={20} />
          ) : (
            <LogIn size={20} />
          )}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
