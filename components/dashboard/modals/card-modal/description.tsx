"use client";

import { useState, useRef, ElementRef } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { CardWithLists } from "@/types";
import { updateCard } from "@/actions/update-card";
import { useAction } from "@/hooks/use-action";

import { toast } from "sonner";
import { AlignLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import FormTextarea from "../../organization/form/form-textarea";
import FormSubmit from "../../organization/form/form-submit";
import { Button } from "@/components/ui/button";

interface DescriptionProps {
   data: CardWithLists;
}

export default function Description({ data }: DescriptionProps) {
   const [isEditing, setIsEditing] = useState(false);

   const params = useParams();
   const queryClient = useQueryClient();

   const textareaRef = useRef<ElementRef<"textarea">>(null);
   const formRef = useRef<ElementRef<"form">>(null);

   const { execute, fieldErrors } = useAction(updateCard, {
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: ["card", data.id],
         }); // clear cache

         queryClient.invalidateQueries({
            queryKey: ["card-logs", data.id],
         }); // clear cache

         toast.success(`Card "${data.title} "updated successfully`);
         disableEditing();
      },
      onError: (error) => {
         toast.error(error);
      },
   });

   function enableEditng() {
      setIsEditing(true);
      setTimeout(() => {
         textareaRef.current?.focus();
      });
   }

   function disableEditing() {
      setIsEditing(false);
   }

   function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ESCAPE") {
         setIsEditing(false);
      }
   }

   useEventListener("keydown", onKeyDown);
   useOnClickOutside(formRef, disableEditing);

   function onSubmit(formData: FormData) {
      const description = formData.get("description") as string;
      const boardId = params.boardId as string;

      execute({ id: data.id, description, boardId });
   }

   return (
      <div className="flex items-start gap-x-3 w-full">
         <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
         <div className="w-full">
            <p className="font-semibold text-neutral-700 mb-2">Description</p>
            {isEditing ? (
               <form action={onSubmit} ref={formRef} className="space-y-2">
                  <FormTextarea
                     id="description"
                     ref={textareaRef}
                     className="w-full mt-2"
                     placeholder="Add a more detailed description"
                     defaultValue={data.description || undefined}
                     errors={fieldErrors}
                  />
                  <div className="flex items-center gap-x-2">
                     <FormSubmit>Save</FormSubmit>
                     <Button
                        type="button"
                        onClick={disableEditing}
                        size={"sm"}
                        variant={"ghost"}
                     >
                        Cancel
                     </Button>
                  </div>
               </form>
            ) : (
               <div
                  role="button"
                  onClick={enableEditng}
                  className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
               >
                  {data.description || "Add a more detailed description..."}
               </div>
            )}
         </div>
      </div>
   );
}

Description.Skeleton = () => {
   return (
      <div className="flex items-start gap-x-3 w-full">
         <Skeleton className="h-6 w-6 bg-neutral-200" />
         <div className="w-full">
            <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
            <Skeleton className="w-full h-[78px] bg-neutral-200" />
         </div>
      </div>
   );
};
