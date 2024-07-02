"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { DeleteBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { decrementAvailableCount } from "@/lib/org-limit";

async function handler(data: InputType): Promise<ReturnType> {
   const { userId, orgId } = auth();

   if (!userId || !orgId) {
      return {
         error: "Unauthorized!",
      };
   }

   const { id } = data;

   let board;

   try {
      board = await db.board.delete({
         where: { id, orgId },
      });
      
      await decrementAvailableCount();

      await createAuditLog({
         entityId: board.id,
         entityTitle: board.title,
         entityType: ENTITY_TYPE.BOARD,
         action: ACTION.DELETE,
      });

   } catch (error) {
      return {
         error: "Failed to delete board.",
      };
   }

   revalidatePath(`/organization/${orgId}`);
   redirect(`/organization/${orgId}`);
}

export const deleteBoard = createSafeAction(DeleteBoard, handler);
