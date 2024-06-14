"use client";

import { forwardRef, useRef, ElementRef, KeyboardEventHandler } from "react";
import { useParams } from "next/navigation";
import { useOnClickOutside, useEventListener } from "usehooks-ts";

import { Plus, X } from "lucide-react";

import { createCard } from "@/actions/create-card";
import { useAction } from "@/hooks/use-action";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import FormTextarea from "../organization/form/form-textarea";
import FormSubmit from "../organization/form/form-submit";

interface CardFormProps {
   listId: string;
   isEditing: boolean;
   enableEditing: () => void;
   disableEditing: () => void;
}

const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
   ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
      const params = useParams();
      const formRef = useRef<ElementRef<"form">>(null);

      const { execute, fieldErrors } = useAction(createCard, {
         onSuccess: (data) => {
            toast.success(`Card "${data.title}" created`);
            formRef.current?.reset();
         },
         onError: (error) => {
            toast.error(error);
         },
      });

      function onKeyDown(e: KeyboardEvent) {
         if (e.key === "Escape") {
            disableEditing();
         }
      }

      useOnClickOutside(formRef, disableEditing);
      useEventListener("keydown", onKeyDown);

      // if user presses enter key without shift key inside the text area input submit the form instead of default behaviour of opening next line
      const onTextareaKeydown: KeyboardEventHandler<HTMLTextAreaElement> = (
         e
      ) => {
         if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
         }
      };

      function onSubmit(formData: FormData) {
         const title = formData.get("title") as string;
         const listId = formData.get("listId") as string;
         const boardId = params.boardId as string;
         execute({ title, listId, boardId });
      }

      if (isEditing) {
         return (
            <form
               action={onSubmit}
               ref={formRef}
               className="m-1  py-0.5 px-1 space-y-4"
            >
               <FormTextarea
                  id="title"
                  onKeyDown={onTextareaKeydown}
                  ref={ref}
                  placeholder="Enter a title for this card."
                  errors={fieldErrors}
               />
               <input hidden id="listId" name="listId" value={listId} />
               <div className="flex items-center justify-between gap-x-1">
                  <FormSubmit>Add card</FormSubmit>
                  <Button
                     onClick={disableEditing}
                     size={"sm"}
                     variant={"ghost"}
                  >
                     <X className="h-5 w-5" />
                  </Button>
               </div>
            </form>
         );
      }

      return (
         <div className="pt-2 px-2">
            <Button
               onClick={enableEditing}
               className="h-auto px-2 py-1 w-full justify-start text-muted-foreground text-sm"
               size={"sm"}
               variant={"ghost"}
            >
               <Plus className="h-4 w-4" />
               Add a card
            </Button>
         </div>
      );
   }
);

CardForm.displayName = "CardForm";
export default CardForm;
