import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { Skeleton } from "../ui/skeleton";
import ActivityItem from "../shared/activity-Item";

export default async function ActivityList() {
   const { orgId } = auth();

   if (!orgId) {
      redirect("/select-org");
   }

   const auditLogs = db.auditLog.findMany({
      where: {
         orgId,
      },
      orderBy: {
         createdAt: "desc",
      },
   });

   return (
      <ol className="space-y-4 mt-4">
         <p className="hidden last:block text-xs text-center">
            No activity found inside this organization
         </p>
         {(await auditLogs).map((log) => (
            <ActivityItem key={log.id} data={log} />
         ))}
      </ol>
   );
}

ActivityList.Skeleton = () => {
   return (
      <ol className="space-y-4 mt-4">
         <Skeleton className="w-[80%] h-14" />
         <Skeleton className="w-[50%] h-14" />
         <Skeleton className="w-[70%] h-14" />
         <Skeleton className="w-[80%] h-14" />
         <Skeleton className="w-[750%] h-14" />
         <Skeleton className="w-[50%] h-14" />
         <Skeleton className="w-[70%] h-14" />
         <Skeleton className="w-[80%] h-14" />
      </ol>
   );
};
