"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./schema";

async function handler(data: InputType): Promise<ReturnType> {
   const { userId, orgId } = auth();

   if (!userId || !orgId) {
      return {
         error: "Unauthorized!",
      };
   }

   const { items, boardId } = data;

   let lists;

   try {
      // updating order for each list
      const queries = items.map((list) =>
         db.list.update({
            where: {
               id: list.id,
               board: {
                  orgId,
               },
            },
            data: {
               order: list.order,
            },
         })
      );

      lists = await db.$transaction(queries);

   } catch (error) {
      return {
         error: "Failed to reorder lists.",
      };
   }

   revalidatePath(`/board/${boardId}`);
   return { data: lists };
}

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
