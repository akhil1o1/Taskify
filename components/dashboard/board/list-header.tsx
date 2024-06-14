"use client";

import { useState, useRef, ElementRef } from "react";
import { useEventListener } from "usehooks-ts";

import { List } from "@prisma/client";
import { updateList } from "@/actions/update-list";
import { useAction } from "@/hooks/use-action";

import { toast } from "sonner";
import FormInput from "../organization/form/form-input";
import ListOptions from "./list-options";

interface ListHeaderProps {
   data: List;
   onAddCard : () => void;
}

export default function ListHeader({ data, onAddCard }: ListHeaderProps) {
   const [title, setTitle] = useState(data.title);
   const [isEditing, setIsEditing] = useState(false);

   const formRef = useRef<ElementRef<"form">>(null);
   const inputRef = useRef<ElementRef<"input">>(null);

   const { execute } = useAction(updateList, {
      onSuccess: (data) => {
         toast.success(`List renamed to "${data.title}"`);
         setTitle(data.title);
         disableEditing();
      },
      onError: (error) => {
         toast.error(error);
      },
   });

   function enableEditing() {
      setIsEditing(true);
      setTimeout(() => {
         inputRef.current?.focus();
         inputRef.current?.select();
      });
   }

   function disableEditing() {
      setIsEditing(false);
   }

   function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
         formRef.current?.requestSubmit();
      }
   }

   useEventListener("keydown", onKeyDown);

   function onSubmit(formData: FormData) {
      const title = formData.get("title") as string;
      const id = formData.get("id") as string;
      const boardId = formData.get("boardId") as string;

      if (title === data.title) {
         return disableEditing();
      }
      execute({ title, id, boardId });
   }

   function onBlur() {
      formRef.current?.requestSubmit();
   }

   return (
      <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
         {isEditing ? (
            <form action={onSubmit} className="flex-1 px-[2px]" ref={formRef}>
               <input hidden id="id" name="id" value={data.id} />
               <input hidden id="boardId" name="boardId" value={data.boardId} />
               <FormInput
                  ref={inputRef}
                  onBlur={onBlur}
                  id="title"
                  placeholder="Enter list title."
                  defaultValue={title}
                  className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
               />
               {/* hidden button to submit form on enter */}
               <button hidden type="submit" />
            </form>
         ) : (
            <div
               className="w-full text-sm px-2 py-1 h-7 font-medium border-transparent cursor-pointer"
               onClick={enableEditing}
            >
               {data.title}
            </div>
         )}
         <ListOptions onAddCard={onAddCard} data={data}/>
      </div>
   );
}
