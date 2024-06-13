import { z } from "zod";

export const UpdateList = z.object({
   title: z
      .string({
         invalid_type_error: "Title is required.",
         required_error: "Title is required.",
      })
      .min(3, { message: "Title is too short! (min 3 characters)." }),
   id: z.string(),
   boardId: z.string(),
});
