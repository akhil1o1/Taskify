"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyList } from "./schema";

async function handler(data: InputType): Promise<ReturnType> {
   const { userId, orgId } = auth();

   if (!userId || !orgId) {
      return {
         error: "Unauthorized!",
      };
   }

   const { id, boardId } = data;

   let list;

   try {
      const listToCopy = await db.list.findUnique({
         where: {
            id,
            boardId,
            board: {
               orgId,
            },
         },
         include: {
            cards: true, // include cards in the response since cards will also be copied to new list
         },
      });

      if (!listToCopy) {
         return { error: "List not found" };
      }

      const lastList = await db.list.findFirst({
         where: {
            boardId: boardId,
         },
         orderBy: { order: "desc" },
         select: { order: true },
      });

      const newOrder = lastList ? lastList.order + 1 : 1;

      list = await db.list.create({
         data: {
            title: `${listToCopy.title} - Copy`,
            boardId: listToCopy.boardId,
            order: newOrder,
            cards: {
               createMany: {
                  data: listToCopy.cards.map((card) => ({
                     title: card.title,
                     description: card.description,
                     order: card.order,
                  })),
               },
            },
         },
         include: {
            cards: true,
         },
      });
   } catch (error) {
      return {
         error: "Failed to copy list.",
      };
   }

   revalidatePath(`/board/${boardId}`);
   return { data: list };
}

export const copyList = createSafeAction(CopyList, handler);
