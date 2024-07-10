"use client";

import Image from "next/image";
import { Draggable } from "@hello-pangea/dnd";

import { CardWithAttachments } from "@/types";

import { useCardModal } from "@/hooks/use-card-modal";

import { FileText } from "lucide-react";

interface CardItemProps {
   data: CardWithAttachments;
   index: number;
}

export default function CardItem({ data, index }: CardItemProps) {
   const { onOpen } = useCardModal();

   const imageAttachments = data.attachments.filter((attachment) =>
      attachment.type.includes("image")
   );
   const pdfAttachments = data.attachments.filter((attachment) =>
      attachment.type.includes("pdf")
   );

   return (
      <Draggable draggableId={data.id} index={index}>
         {(provided) => (
            <div
               role="button"
               className="truncate border-2 border-transparent hover:border-black/50 py-2 px-3 text-sm bg-white rounded-md shadow-sm"
               ref={provided.innerRef}
               {...provided.draggableProps}
               {...provided.dragHandleProps}
               onClick={() => onOpen(data.id)}
            >
               {data.title}
               <div className="my-2 space-y-2">
                  {imageAttachments?.map((attachment) => (
                     <div key={attachment.id} className="relative">
                        <Image
                           src={attachment.url}
                           alt="attachment"
                           width={300}
                           height={300}
                           className="rounded-md object-contain"
                        />
                     </div>
                  ))}
                  {pdfAttachments?.map((attachment) => (
                     <div
                        key={attachment.id}
                        className="flex w-full h-[100px] items-center justify-center bg-slate-200 rounded-md"
                     >
                        <div className="flex flex-col items-center">
                           <FileText className="h-8 w-8" />
                           <span className="truncate font-semibold text-neutral-600">
                              PDF
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </Draggable>
   );
}
