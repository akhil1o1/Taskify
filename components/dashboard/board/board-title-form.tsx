"use client";

import { useState, useRef, ElementRef } from "react";
import { Board } from "@prisma/client";

import { useAction } from "@/hooks/use-action";
import { updateBoard } from "@/actions/update-board";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormInput } from "../organization/form/form-input";

interface BoardTitleFormProps {
   data: Board;
}

export default function BoardTitleForm({ data }: BoardTitleFormProps) {
   const formRef = useRef<ElementRef<"form">>(null);
   const inputRef = useRef<ElementRef<"input">>(null);

   const [title, setTitle] = useState(data.title); 
   const [isEditing, setIsEditing] = useState(false);

   const { execute } = useAction(updateBoard, {
      onSuccess: (data) => {
         // console.log(data);
         toast.success(`Board ${data.title} updated!`);
         setIsEditing(false);
         setTitle(data.title);
      },
      onError: (error) => {
         // console.log(error);
         toast.error(error);
      },
   });

   function enableEditing() {
      setIsEditing(true);
      // focus input, using setTimeOut to make sure the input is in the dom after the state changes to true
      setTimeout(() => {
         inputRef.current?.focus();
         inputRef.current?.select();
      });
   }

   function onSubmit(formData: FormData) {
      const title = formData.get("title") as string;
      // console.log(title);
      execute({title, id: data.id})
   }

   function onBlur() {
      formRef.current?.requestSubmit();
   }

   if (isEditing) {
      return (
         <form
            ref={formRef}
            action={onSubmit}
            className="flex items-center gap-x-2"
            onBlur={onBlur}
         >
            <FormInput
               ref={inputRef}
               id="title"
               onBlur={() => {}}
               defaultValue={title}
               className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
            />
         </form>
      );
   }

   return (
      <Button
         className="font-bold textlg h-auto w-auto p-1 px-2"
         variant={"transparent"}
         onClick={enableEditing}
      >
         {title}
      </Button>
   );
}
