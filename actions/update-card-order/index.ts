"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./schema";

async function handler(data: InputType): Promise<ReturnType> {
   const { userId, orgId } = auth();

   if (!userId || !orgId) {
      return {
         error: "Unauthorized!",
      };
   }

   const { items, boardId } = data;

   let updatedCards;

   try {
      // updating order and list id for each card
      const queries = items.map((card) =>
         db.card.update({
            where: {
               id: card.id,
               list: {
                  board: {
                     orgId,
                  },
               },
            },
            data: {
               order: card.order,
               listId: card.listId,
            },
         })
      );

      updatedCards = await db.$transaction(queries);
   } catch (error) {
      return {
         error: "Failed to reorder cards.",
      };
   }

   revalidatePath(`/board/${boardId}`);
   return { data: updatedCards };
}

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
