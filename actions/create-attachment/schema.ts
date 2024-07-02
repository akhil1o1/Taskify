import { z } from "zod";

export const CreateAttachment = z.object({
   formData: z
      .instanceof(FormData, {
         message: "A image/pdf file is required",
      })
      .refine((formData) => !!formData.get("attachment"), {
         message: "A image/pdf file is required",
      })
      .refine(
         (formData) => {
            const attachment = formData.get("attachment") as File;
            return (
               attachment &&
               (attachment.type.startsWith("image/") ||
                  attachment.type === "application/pdf")
            );
         },
         {
            message: "Only image/pdf files are supported",
         }
      ),
   cardId: z.string(),
   boardId: z.string(),
});
