"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { DeleteCard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";

async function handler(data: InputType): Promise<ReturnType> {
   const { userId, orgId } = auth();

   if (!userId || !orgId) {
      return {
         error: "Unauthorized!",
      };
   }

   const { id, boardId } = data;

   let card;

   try {
      card = await db.card.delete({
         where: {
            id,
            list: {
               board: {
                  orgId,
               },
            },
         },
      });

      await createAuditLog({
         entityId: card.id,
         entityTitle: card.title,
         entityType: ENTITY_TYPE.CARD,
         action: ACTION.DELETE,
      });
   } catch (error) {
      return {
         error: "Failed to delete card.",
      };
   }

   revalidatePath(`/board/${boardId}`);
   return { data: card };
}

export const deleteCard = createSafeAction(DeleteCard, handler);
