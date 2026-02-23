import React from "react";
import { Checklist } from "@/types/checklist";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ChecklistCard = ({
  checklist,
}: {
  checklist: Checklist;
}) => {
  return (
    <Card className="pb-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{checklist.name}</CardTitle>
          <CardDescription>
            {checklist.industry_type}
          </CardDescription>
        </div>
        <Badge
          variant={
            checklist.is_active ? "default" : "secondary"
          }
        >
          {checklist.is_active ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>

      <CardFooter className="flex justify-end relative mt-5 ">
        <p className="text-xs text-muted-foreground absolute bottom-2 end-2">
          {checklist.created_at?.split("|")[0]}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ChecklistCard;
