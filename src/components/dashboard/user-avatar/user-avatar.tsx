import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/lib/store";

const UserAvatar = () => {
  const t = useTranslations();
  /* const { user } = useAppSelector((state) => state.auth); */
  const user = {
    name: "Ahmed",
    avatar: "",
    type: "admin",
  };
  return (
    <>
      <Avatar>
        <AvatarImage src={user?.avatar || ""} />
        <AvatarFallback>
          {user?.name?.[0] || "A"}
        </AvatarFallback>
      </Avatar>
      <div>
        <h5 className="text-sm font-semibold">
          {user?.name || "Ahmed"}
        </h5>
        <p className="text-xs text-muted-foreground">
          {t(user?.type || "admin")}
        </p>
      </div>
    </>
  );
};

export default UserAvatar;
