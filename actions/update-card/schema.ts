import { z } from "zod";

export const UpdateCard = z.object({
   id: z.string(),
   title: z.optional(
      z
         .string({
            invalid_type_error: "Title is required.",
            required_error: "Title is required.",
         })
         .min(3, { message: "Title is too short! (min 3 characters)." })
   ),
   description: z.optional(
      z
         .string({
            required_error: "Description is required",
            invalid_type_error: "Description is required",
         })
         .min(3, {
            message: "Description is too short(min 3 characters)",
         })
   ),
   boardId: z.string(),
});
