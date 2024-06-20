"use client";

import { useQuery } from "@tanstack/react-query";

import { CardWithLists } from "@/types";
import fetcher from "@/lib/fetcher";
import { useCardModal } from "@/hooks/use-card-modal";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Header from "./header";

export default function CardModal() {
   const { id, isOpen, onClose } = useCardModal();

   const { data: cardData } = useQuery<CardWithLists>({
      queryKey: ["card", id],
      queryFn: () => fetcher(`/api/cards/${id}`),
   });

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
            {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
         </DialogContent>
      </Dialog>
   );
}
