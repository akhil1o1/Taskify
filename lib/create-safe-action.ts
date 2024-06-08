import { z } from "zod";

export type FieldErrors<T> = {
   [K in keyof T]?: string[];
};

export type ActionState<TInput, TOutput> = {
   fieldErrors?: FieldErrors<TInput>;
   error?: string | null;
   data?: TOutput;
};

export function createSafeAction<TInput, TOutput>(
   schema: z.Schema<TInput>,
   handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
): (data: TInput) => Promise<ActionState<TInput, TOutput>> {
   return async function (data: TInput): Promise<ActionState<TInput, TOutput>> {
      const validatedResults = schema.safeParse(data);
      if (!validatedResults.success) {
         return {
            fieldErrors: validatedResults.error.flatten()
               .fieldErrors as FieldErrors<TInput>,
         };
      }

      return handler(validatedResults.data);
   };
}
