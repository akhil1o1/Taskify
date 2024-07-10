import { z } from "zod";

export const DeleteAttachment = z.object({
   id: z.string(),
   cardId: z.string(),
   boardId: z.string(),
});
