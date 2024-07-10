"use client";

import { useState, useRef, ElementRef } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";

import { CardWithLists } from "@/types";
import { updateCard } from "@/actions/update-card";
import { useAction } from "@/hooks/use-action";

import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import FormInput from "../../organization/form/form-input";

interface HeaderProps {
   data: CardWithLists;
   refetchData: () => void;
}

export default function Header({ data, refetchData }: HeaderProps) {
   const [title, setTitle] = useState(data.title);
   const params = useParams();

   const inputRef = useRef<ElementRef<"input">>(null);

   const { execute } = useAction(updateCard, {
      onSuccess: (data) => {
         refetchData();
         toast.success(`Card updated successfully`);
         setTitle(data.title);
      },
      onError: (error) => {
         toast.error(error);
      },
   });

   function onBlur() {
      inputRef.current?.form?.requestSubmit();
   }

   function onSubmit(formData: FormData) {
      const title = formData.get("title") as string;
      const boardId = params.boardId as string;
      // const description = data.description as string;

      if (title === data.title) {
         return;
      }

      execute({
         id: data.id,
         title,
         boardId,
      });
   }

   return (
      <div className="flex items-start gap-x-3 mb-6 w-full">
         <Layout className="h-5 w-5 mt-1 text-neutral-700" />
         <div className="w-full">
            <form action={onSubmit}>
               <FormInput
                  ref={inputRef}
                  onBlur={onBlur}
                  id="title"
                  defaultValue={title}
                  className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
               />
            </form>
            <p className="text-sm text-muted-foreground">
               in list <span className="underline">{data.list.title}</span>
            </p>
         </div>
      </div>
   );
}

Header.Skeleton = () => {
   return (
      <div className="flex items-start gap-x-3 mb-6">
         <Skeleton className="h-6 w-6 mt-1 bg-neutral-200 " />
         <div>
            <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
            <Skeleton className="w-12 h-4 bg-neutral-200" />
         </div>
      </div>
   );
};
