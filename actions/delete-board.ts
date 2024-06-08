"use server"

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

export async function deleteBoard(orgId: string, boardId: string) {
   console.log("orgId", orgId);

   await db.board.delete({
      where: {
         id: boardId,
      },
   });

   revalidatePath(`/organization/${orgId}`);
}

