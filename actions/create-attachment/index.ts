"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { ENTITY_TYPE, ACTION } from "@prisma/client";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateAttachment } from "./schema";
import { uploadFile } from "@/lib/cloudinary";

async function handler(data: InputType): Promise<ReturnType> {
   const { userId, orgId } = auth();

   if (!userId || !orgId) {
      return {
         error: "Unauthorized!",
      };
   }

   const { formData, cardId, boardId } = data;

   const file = formData.get("attachment") as File;
   console.log(file);

   let attachment;

   try {
      const { fileUrl, publicId } = await uploadFile(file);

      if (!fileUrl || !publicId) {
         throw new Error();
      }

      attachment = await db.attachment.create({
         data: {
            url: fileUrl,
            type: file.type,
            cardId: cardId,
            cloudinaryId: publicId,
         },
      });

      await createAuditLog({
         entityId: attachment.id,
         entityTitle: attachment.type,
         entityType: ENTITY_TYPE.ATTACHMENT,
         action: ACTION.CREATE,
      });
   } catch (error) {
      return {
         error: "Failed to create attachment.",
      };
   }

   revalidatePath(`/board/${boardId}`);
   return { data: attachment };
}

export const createAttachment = createSafeAction(CreateAttachment, handler);
