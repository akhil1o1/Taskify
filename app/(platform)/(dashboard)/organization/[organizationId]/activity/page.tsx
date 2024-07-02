import { Suspense } from "react";

import Info from "@/components/dashboard/organization/info";
import { Separator } from "@/components/ui/separator";
import ActivityList from "@/components/dashboard/activity-list";

export default function ActivityPage() {
   return (
      <div className="w-full">
         <Info />
         <Separator className="my-2" />
         <Suspense fallback={<ActivityList.Skeleton />}>
            <ActivityList />
         </Suspense>
      </div>
   );
}
