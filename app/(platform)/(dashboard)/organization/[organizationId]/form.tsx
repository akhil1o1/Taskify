"use client";

import { createBoard } from "@/actions/create-board";
import { useAction } from "@/hooks/use-action";
import { FormInput } from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-submit";

export default function Form({ orgId }: { orgId: string }) {
   const { execute, fieldErrors, isLoading } = useAction(createBoard, {
      onSuccess: (data) => {
         console.log(data, "SUCCESS");
      },
      onError: (error) => {
         console.error(error);
      },
   });

   console.log(fieldErrors);

   const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      execute({ title });
   };

   return (
      <div className="flex gap-y-2 flex-col">
         <form action={onSubmit} className="flex gap-x-2 items-end">
            <FormInput id="title" errors={fieldErrors} label="Board Title" />
            <FormSubmit>Save</FormSubmit>
         </form>
      </div>
   );
}
