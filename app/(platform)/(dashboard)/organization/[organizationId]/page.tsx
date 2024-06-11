import { Suspense } from "react";

import { Separator } from "@/components/ui/separator";
import Info from "@/components/dashboard/organization/info";
import BoardList from "@/components/dashboard/organization/board-list";

export default async function OrganizationIdPage({
   params,
}: {
   params: { organizationId: string };
}) {
   return (
      <div className="w-full mb-20">
         <Info />
         <Separator className="my-4" />
         <div className="px-2 md:px-4">
            <Suspense fallback={<BoardList.Skeleton />}>
               <BoardList />
            </Suspense>
         </div>
      </div>
   );
}
