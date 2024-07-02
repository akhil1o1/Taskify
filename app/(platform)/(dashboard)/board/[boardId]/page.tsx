import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

import ListContainer from "@/components/dashboard/board/list-container";

interface BoardIdPageProps {
   params: {
      boardId: string;
   };
}

export default async function BoardIdPage({ params }: BoardIdPageProps) {
   const { orgId } = auth();

   if (!orgId) {
      redirect("/select-org");
   }

   const lists = await db.list.findMany({
      where: {
         boardId: params.boardId,
         board: {
            // the related board was also created in the current orgId of logged in user
            orgId,
         },
      },
      orderBy: {
         // order of the lists by order field
         order: "asc",
      },
      include: {
         //also include cards in the response
         cards: {
            orderBy: {
               // order of the cards by order field
               order: "asc",
            },
            include: {
               attachments: {
                  orderBy: {
                     createdAt: "desc",
                  },
               },
            },
         },
      },
   });

   return (
      <div className="p-4 h-full overflow-x-auto">
         <ListContainer boardId={params.boardId} data={lists} />
      </div>
   );
}
