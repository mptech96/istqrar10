import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StatsCardProps } from "@/types/stats-card-props";

const StatsCard = ({
  title,
  subtitle,
  icon,
  Badge: { variant, className, badgeTitle, badgeIcon } = {
    variant: "default",
    className: "",
    badgeTitle: "",
    badgeIcon: <></>,
  },
}: StatsCardProps) => {
  return (
    <Card className="w-full bg-linear-to-br from-coralRed/5 to-cyan-500/5 ">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h4>
            <span>{icon}</span>
          </h4>
          <Badge variant={variant} className={className}>
            {badgeIcon}
            {badgeTitle}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {title}
      </CardContent>

      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      </CardFooter>
    </Card>
  );
};

export default StatsCard;
