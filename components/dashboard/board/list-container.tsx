"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { useAction } from "@/hooks/use-action";

import { toast } from "sonner";
import ListForm from "./list-form";
import ListItem from "./list-item";

interface ListContainerProps {
   boardId: string;
   data: ListWithCards[];
}

export default function ListContainer({ boardId, data }: ListContainerProps) {
   const [orderedData, setOrderedData] = useState(data);

   useEffect(() => {
      setOrderedData(data);
   }, [data]);
   
   const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
      onSuccess: (data) => {
         toast.success("List moved successfully");
      },
      onError: (error) => {
         toast.error(error);
      },
   });

   const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
      onSuccess: (data) => {
         toast.success("Card moved successfully");
      },
      onError: (error) => {
         toast.error(error);
      },
   });

   function reorder<T>(list: T[], startIndex: number, endIndex: number) {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
   }

   function onDragEnd(result: DropResult) {
      console.log(result);
      const { destination, source, type } = result;

      if (!destination) {
         console.log("No destination");
         return;
      }

      // if list or card is dropped in the same position
      if (
         destination.droppableId === source.droppableId &&
         destination.index === source.index
      ) {
         console.log("Dropped in the same position");
         return;
      }

      // if user moves a list
      if (type === "list") {
         const reorderedLists = reorder(
            orderedData,
            source.index,
            destination.index
         ).map((list, index) => {
            return {
               ...list,
               order: index,
            };
         });

         setOrderedData(reorderedLists);
         executeUpdateListOrder({ items: reorderedLists, boardId });
      }

      // if user moves a card
      if (type === "card") {
         let newOrderedData = [...orderedData];

         const sourceList = newOrderedData.find(
            (list) => list.id === source.droppableId
         );
         const destinationList = newOrderedData.find(
            (list) => list.id === destination.droppableId
         );

         console.log(sourceList);
         console.log(destinationList);

         if (!sourceList || !destinationList) {
            return;
         }

         // If card was moved in the same list
         if (source.droppableId === destination.droppableId) {
            const reorderedCards = reorder(
               sourceList.cards,
               source.index,
               destination.index
            ).map((card, index) => {
               return { ...card, order: index };
            });

            sourceList.cards = reorderedCards;

            setOrderedData(newOrderedData);
            executeUpdateCardOrder({ items: reorderedCards, boardId });
         } else {
            // else if card was moved in different list

            // remove card from source list
            const [movedCard] = sourceList.cards.splice(source.index, 1);

            // assign the new destination list id to moved card ****important step****
            movedCard.listId = destination.droppableId;

            // add card to destination list
            destinationList.cards.splice(destination.index, 0, movedCard);

            // change the order of each card in source list and destination list after reordering ****important step****
            sourceList.cards.forEach((card, index) => (card.order = index));
            destinationList.cards.forEach(
               (card, index) => (card.order = index)
            );

            setOrderedData(newOrderedData);
            executeUpdateCardOrder({ items: destinationList.cards, boardId });
         }
      }
   }

   return (
      <DragDropContext onDragEnd={onDragEnd}>
         <Droppable droppableId="lists" type="list" direction={"horizontal"}>
            {(provided) => (
               <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-x-3 h-full"
               >
                  {orderedData.map((list, index) => (
                     <ListItem key={list.id} index={index} data={list} />
                  ))}
                  {provided.placeholder}
                  {/* to add a new a list */}
                  <ListForm />
                  <div className="flex-shrink-0 w-1" />
               </ol>
            )}
         </Droppable>
      </DragDropContext>
   );
}
