"use client";

import { useRef, ElementRef } from "react";
import { useParams } from "next/navigation";

import { X, Paperclip } from "lucide-react";

import { CardWithLists } from "@/types";
import { createAttachment } from "@/actions/create-attachment";
import { useAction } from "@/hooks/use-action";

import { toast } from "sonner";
import {
   Popover,
   PopoverTrigger,
   PopoverContent,
   PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormSubmit from "../../organization/form/form-submit";
import FormErrors from "../../organization/form/form-errros";

interface AttachmentsProps {
   data: CardWithLists;
}

export default function Attachments({ data }: AttachmentsProps) {
   const closeRef = useRef<ElementRef<"button">>(null);

   const params = useParams();

   const { execute, isLoading, fieldErrors } = useAction(createAttachment, {
      onSuccess: (data) => {
         toast.success(`${data.type} file added to the card`);
         closeRef.current?.click();
      },
      onError: (error) => {
         toast.error(error);
      },
   });


   function onSubmit(formData: FormData) {
      const boardId = params.boardId as string;
      execute({ formData, cardId: data.id, boardId });
   }

   return (
      <Popover modal={true}>
         <PopoverTrigger className="w-full" asChild>
            <Button
               variant={"gray"}
               className="w-full justify-start"
               size={"inline"}
            >
               <Paperclip className="h-4 w-4 mr-2" />
               Attachments
            </Button>
         </PopoverTrigger>
         <PopoverContent className="px-0 py-3" side="bottom" align="start">
            <div className="text-sm font-medium text-center text-neutral-600 pb-4">
               Add Attachment
            </div>
            <form action={onSubmit} className="flex flex-col gap-y-2">
               <Input
                  id="attachment"
                  type="file"
                  name="attachment"
                  accept="image/*,application/pdf"
                  className="rounded-none"
                  aria-describedby="formData-error"
               />
               <p className="text-sm text-neutral-600 text-muted-foreground px-4">
                  Image/PDF/CSV files supported
               </p>
               <FormErrors id="formData" errors={fieldErrors}/>
               <FormSubmit
                  variant="primary"
                  className="px-5 mr-auto ml-4 mt-2 font-normal text-sm"
                  disabled={isLoading}
               >
                  Add
               </FormSubmit>
            </form>
            <PopoverClose asChild ref={closeRef}>
               <Button
                  className="h-auto w-auto absolute top-2 right-2 text-neutral-600"
                  variant={"ghost"}
               >
                  <X className="h-4 w-4" />
               </Button>
            </PopoverClose>
         </PopoverContent>
      </Popover>
   );
}
