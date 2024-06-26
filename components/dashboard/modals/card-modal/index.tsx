"use client";

import { useQuery } from "@tanstack/react-query";
import { AuditLog } from "@prisma/client";

import { CardWithLists } from "@/types";
import fetcher from "@/lib/fetcher";
import { useCardModal } from "@/hooks/use-card-modal";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Header from "./header";
import Description from "./description";
import CardActions from "./card-actions";
import Activity from "./acitvity";

export default function CardModal() {
   const { id, isOpen, onClose } = useCardModal();

   const { data: cardData } = useQuery<CardWithLists>({
      queryKey: ["card", id],
      queryFn: () => fetcher(`/api/cards/${id}`),
   });

   const { data: auditLogsData } = useQuery<AuditLog[]>({
      queryKey: ["card-logs", id],
      queryFn: () => fetcher(`/api/cards/${id}/logs`),
   });

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
            {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
               <div className="col-span-3">
                  <div className="w-full space-y-6">
                     {!cardData ? (
                        <Description.Skeleton />
                     ) : (
                        <Description data={cardData} />
                     )}
                     {!auditLogsData ? (
                        <Activity.Skeleton />
                     ) : (
                        <Activity items={auditLogsData} />
                     )}
                  </div>
               </div>
               {!cardData ? (
                  <CardActions.Skeleton />
               ) : (
                  <CardActions data={cardData} />
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
}
