"use client";

import { useState, useRef, ElementRef } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Plus, X } from "lucide-react";

import { toast } from "sonner";
import { createList } from "@/actions/create-list";
import { useAction } from "@/hooks/use-action";

import { Button } from "@/components/ui/button";
import ListWrapper from "./list-wrapper";
import FormInput from "../organization/form/form-input";
import FormSubmit from "../organization/form/form-submit";

export default function ListForm() {
   const [isEditing, setIsEditing] = useState(false);

   const params = useParams();
   const router = useRouter();

   const formRef = useRef<ElementRef<"form">>(null);
   const inputRef = useRef<ElementRef<"input">>(null);

   const { execute, fieldErrors } = useAction(createList, {
      onSuccess: (data) => {
         toast.success(`List "${data.title}" created`);
         disableEditing();
         router.refresh();
      },
      onError: (error) => {
         toast.error(error);
      },
   });

   function enableEditing() {
      setIsEditing(true);
      setTimeout(() => {
         inputRef.current?.focus();
      });
   }

   function disableEditing() {
      console.log("disable editing");
      setIsEditing(false);
   }

   function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
         disableEditing();
      }
   }

   useEventListener("keydown", onKeyDown);
   useOnClickOutside(formRef, disableEditing);

   function onSubmit(formData: FormData) {
      const title = formData.get("title") as string;
      const boardId = formData.get("boardId") as string;
      execute({ title, boardId });
   }

   if (isEditing) {
      return (
         <ListWrapper>
            <form
               action={onSubmit}
               ref={formRef}
               className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
            >
               <FormInput
                  ref={inputRef}
                  errors={fieldErrors}
                  id="title"
                  className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                  placeholder="Enter list title"
               />
               <input hidden value={params.boardId} name="boardId" />
               <div className="flex items-center justify-between gap-x-1">
                  <FormSubmit>Add list</FormSubmit>
                  <Button
                     onClick={disableEditing}
                     size={"sm"}
                     variant={"ghost"}
                  >
                     <X className="h-5 w-5" />
                  </Button>
               </div>
            </form>
         </ListWrapper>
      );
   }

   return (
      <ListWrapper>
         <Button
            className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center justify-start font-medium text-sm"
            variant={"ghost"}
            onClick={enableEditing}
         >
            <Plus className="h-4 w-4 mr-2" />
            Add a list
         </Button>
      </ListWrapper>
   );
}
