import { SidebarTrigger } from "@/components/ui/sidebar";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import UserAvatar from "@/components/dashboard/user-avatar/user-avatar";
import LangSwitcher from "@/components/common/lang/lang-switcher";

const ToolBar = () => {
  return (
    <div className="flex justify-between align-center  py-2 mt-2 ">
      <SidebarTrigger className=" flex   h-full align-center" />
      <div className="flex gap-3 align-center">
        <div className="cursor-pointer text-sm flex align-center">
          <AnimatedThemeToggler />
        </div>
        <div>
          <LangSwitcher />
        </div>
        <UserAvatar />
      </div>
    </div>
  );
};

export default ToolBar;
