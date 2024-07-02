"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { incrementAvailableCount, hasAvailableCount } from "@/lib/org-limit";

async function handler(data: InputType): Promise<ReturnType> {
   const { userId, orgId } = auth();

   if (!userId || !orgId) {
      return {
         error: "Unauthorized!",
      };
   }

   const canCreate = await hasAvailableCount();

   if (!canCreate) {
      return {
         error: "You have reached your limit of free boards. Please upgrade to create more.",
      };
   }

   const { title, image } = data;

   const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
      image.split("|");

   console.log({
      imageId,
      imageThumbUrl,
      imageFullUrl,
      imageLinkHTML,
      imageUserName,
   });

   if (
      !imageId ||
      !imageThumbUrl ||
      !imageFullUrl ||
      !imageLinkHTML ||
      !imageUserName
   ) {
      return {
         error: "Missing image fields, Failed to create baord.",
      };
   }

   let board;

   try {
      board = await db.board.create({
         data: {
            title,
            orgId,
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageUserName,
            imageLinkHTML,
         },
      });

      await incrementAvailableCount();

      await createAuditLog({
         entityId: board.id,
         entityTitle: board.title,
         entityType: ENTITY_TYPE.BOARD,
         action: ACTION.CREATE,
      });
   } catch (error) {
      return {
         error: "Failed to create board.",
      };
   }

   revalidatePath(`/board/${board.id}`);
   return { data: board };
}

export const createBoard = createSafeAction(CreateBoard, handler);
