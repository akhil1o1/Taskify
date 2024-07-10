"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { ENTITY_TYPE, ACTION } from "@prisma/client";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteAttachment } from "./schema";
import { deleteFiles } from "@/lib/cloudinary";

async function handler(data: InputType): Promise<ReturnType> {
   const { userId, orgId } = auth();

   if (!userId || !orgId) {
      return {
         error: "Unauthorized!",
      };
   }

   const { id, cardId, boardId } = data;

   let attachment;

   try {
      attachment = await db.attachment.delete({
         where: { id },
         include: { card: { select: { title: true } } },
      });

      // delete attachment from cloudinary
      await deleteFiles([attachment.cloudinaryId]);

      await createAuditLog({
         entityId: cardId,
         entityTitle: attachment.card.title,
         entityType: ENTITY_TYPE.CARD,
         action: ACTION.UPDATE,
      });
   } catch (error) {
      return {
         error: "Failed to delete attachment.",
      };
   }

   revalidatePath(`/board/${boardId}`);
   return { data: attachment };
}

export const deleteAttachment = createSafeAction(DeleteAttachment, handler);
