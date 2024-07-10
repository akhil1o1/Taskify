import { MouseEvent } from "react";

import { useParams } from "next/navigation";
import Image from "next/image";

import { CardWithLists } from "@/types";
import { deleteAttachment } from "@/actions/delete-attachment";
import { useAction } from "@/hooks/use-action";

import { Paperclip, FileText, CircleX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Hint from "@/components/shared/hint";
import { toast } from "sonner";

interface AttachmentListProps {
   data: CardWithLists;
   refetchData: () => void;
}

export default function AttachmentList({
   data,
   refetchData,
}: AttachmentListProps) {
   console.log("AttachmentList", data);

   const params = useParams();

   const { execute, isLoading } = useAction(deleteAttachment, {
      onSuccess: (data) => {
         toast.success("Attachment removed successfully");
         refetchData();
      },
      onError: (error) => {
         toast.error(error);
      },
   });

   function onDelete(
      event: MouseEvent<HTMLButtonElement>,
      attachmentId: string
   ) {
      event.stopPropagation();
      event.preventDefault();

      execute({
         id: attachmentId,
         cardId: data.id,
         boardId: params.boardId as string,
      });
   }

   return (
      <div className="flex items-start gap-x-3 w-full">
         <Paperclip className="h-5 w-5 mt-0.5 text-neutral-700" />
         <div className="w-full">
            <p className="font-semibold text-neutral-700 mb-2 ">Attachments</p>
            <ol className="gap-2 flex flex-wrap">
               {data?.attachments.map((attachment) => (
                  <a href={attachment.url} target="_blank">
                     <div
                        key={attachment.id}
                        className="relative h-[120px] w-[200px]"
                     >
                        <div className="absolute right-2 top-2 z-20">
                           <Hint
                              sideOffset={5}
                              side={"right"}
                              description={"Remove attachment"}
                           >
                              <Button
                                 variant={"outline"}
                                 size={"icon"}
                                 className="z-10 rounded-full w-6 h-6"
                                 disabled={isLoading }
                                 onClick={(event) =>
                                    onDelete(event, attachment.id)
                                 }
                              >
                                 <CircleX className="h-4 w-4" />
                              </Button>
                           </Hint>
                        </div>
                        {attachment.type.includes("image") ? (
                           <div className="relative w-full h-full">
                              <Image
                                 src={attachment.url}
                                 alt="attachment"
                                 fill
                                 className="rounded-md object-contain"
                              />
                           </div>
                        ) : (
                           <div
                              key={attachment.id}
                              className="flex h-full w-full items-center justify-center bg-slate-200 rounded-md"
                           >
                              <div className="flex flex-col items-center">
                                 <FileText className="h-8 w-8" />
                                 <span className="truncate font-semibold text-neutral-600">
                                    PDF
                                 </span>
                              </div>
                           </div>
                        )}
                     </div>
                  </a>
               ))}
            </ol>
         </div>
      </div>
   );
}

AttachmentList.Skeleton = () => {
   return (
      <div className="flex items-start gap-x-3 w-full">
         <Skeleton className="h-6 w-6 bg-neutral-200" />
         <div>
            <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
            <div className="gap-2 flex flex-wrap">
               <Skeleton className="h-[120px] w-[200px] bg-neutral-200" />
               <Skeleton className="h-[120px] w-[200px] bg-neutral-200" />
            </div>
         </div>
      </div>
   );
};
