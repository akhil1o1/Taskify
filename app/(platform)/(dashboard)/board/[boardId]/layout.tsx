import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { startCase } from "lodash";

import { db } from "@/lib/db";

import BoardNavbar from "@/components/dashboard/board/board-navbar";

export async function generateMetadata({
   params,
}: {
   params: { boardId: string };
}) {
   const { orgId } = auth();

   if (!orgId) {
      return {
         title: "Board",
      };
   }

   const board = await db.board.findUnique({
      where: {
         id: params.boardId,
         orgId,
      },
   });

   return {
      title: startCase(board?.title || "board"),
   };
}

export default async function BoardIdLayout({
   children,
   params,
}: {
   children: React.ReactNode;
   params: { boardId: string };
}) {
   const { orgId } = auth();

   if (!orgId) {
      redirect("/select-org");
   }

   const board = await db.board.findUnique({
      where: {
         id: params.boardId,
         orgId,
      },
   });

   if (!board) {
      notFound();
   }

   console.log(board);

   return (
      <div
         className="relative h-full bg-no-repeat bg-cover bg-center"
         style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      >
         <BoardNavbar data={board}/>
         <div className="absolute inset-0 bg-black/10" />
         <main className="relative pt-28 h-full">{children}</main>
      </div>
   );
}
