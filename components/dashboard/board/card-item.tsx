"use client";

import { Draggable } from "@hello-pangea/dnd";

import { Card } from "@prisma/client";

import { useCardModal } from "@/hooks/use-card-modal";

interface CardItemProps {
   data: Card;
   index: number;
}

export default function CardItem({ data, index }: CardItemProps) {
   const { onOpen } = useCardModal();

   return (
      <Draggable draggableId={data.id} index={index}>
         {(provided) => (
            <div
               role="button"
               className="truncate border-2 border-transparent hover:border-black/50  py-2 px-3 text-sm bg-white rounded-md shadow-sm"
               ref={provided.innerRef}
               {...provided.draggableProps}
               {...provided.dragHandleProps}
               onClick={() => onOpen(data.id)}
            >
               {data.title}
            </div>
         )}
      </Draggable>
   );
}
